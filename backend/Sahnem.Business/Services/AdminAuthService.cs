using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Sahnem.Business.DTOs.AdminAuth;
using Sahnem.Business.Email;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    // Normal kullanıcı auth akışından (UserService/TokenService/JwtService)
    // BİLİNÇLİ olarak tamamen ayrı — ayrı tablo, ayrı şifre hash'i, ayrı JWT
    // imzalama anahtarı. Ana sistemdeki bir açık admin erişimini otomatik
    // olarak tehlikeye atmasın diye.
    public class AdminAuthService : IAdminAuthService
    {
        private static readonly TimeSpan PasswordResetCooldown = TimeSpan.FromSeconds(60);
        private readonly PasswordHasher<Admin> _passwordHasher = new();

        private readonly IGenericRepository<Admin> _adminRepository;
        private readonly IGenericRepository<AdminRefreshToken> _refreshTokenRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AdminJwtSettings _jwtSettings;
        private readonly IEmailService _emailService;
        private readonly ICurrentAdminService _currentAdminService;

        public AdminAuthService(
            IGenericRepository<Admin> adminRepository,
            IGenericRepository<AdminRefreshToken> refreshTokenRepository,
            IUnitOfWork unitOfWork,
            IOptions<AdminJwtSettings> jwtSettings,
            IEmailService emailService,
            ICurrentAdminService currentAdminService)
        {
            _adminRepository = adminRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _unitOfWork = unitOfWork;
            _jwtSettings = jwtSettings.Value;
            _emailService = emailService;
            _currentAdminService = currentAdminService;
        }

        public async Task<AdminTokenPairDto> Login(AdminLoginDto dto, string? ipAddress)
        {
            var username = dto.Username.Trim().ToLower();
            var admin = await _adminRepository.FirstOrDefaultAsync(a => a.Username.ToLower() == username);
            if (admin == null)
            {
                throw new Exception("Invalid username or password");
            }

            var result = _passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, dto.Password);
            if (result != PasswordVerificationResult.Success && result != PasswordVerificationResult.SuccessRehashNeeded)
            {
                throw new Exception("Invalid username or password");
            }
            if (!admin.IsActive)
            {
                throw new Exception("This admin account has been disabled");
            }

            admin.LastLoginAt = DateTime.UtcNow;
            admin.LastLoginIp = ipAddress;
            await _unitOfWork.SaveChanges();

            return await IssueTokens(admin);
        }

        public async Task<AdminTokenPairDto> RefreshToken(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                throw new Exception("Refresh token is required");
            }

            var existing = await _refreshTokenRepository.FirstOrDefaultAsync(r => r.Token == refreshToken);
            if (existing == null || !existing.IsActive)
            {
                throw new Exception("Invalid or expired refresh token");
            }

            var admin = await _adminRepository.GetByIdAsync(existing.AdminId);
            if (admin == null || !admin.IsActive)
            {
                throw new Exception("Invalid or expired refresh token");
            }

            existing.RevokedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();

            return await IssueTokens(admin);
        }

        public async Task Logout(string refreshToken)
        {
            var existing = await _refreshTokenRepository.FirstOrDefaultAsync(r => r.Token == refreshToken);
            if (existing == null || existing.RevokedAt != null) return;
            existing.RevokedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();
        }

        public async Task<AdminResponseDto> GetMe()
        {
            var admin = await _adminRepository.GetByIdAsync(_currentAdminService.AdminId);
            if (admin == null) throw new Exception("Admin not found");

            return new AdminResponseDto
            {
                Id = admin.Id,
                Username = admin.Username,
                Email = admin.Email,
                LastLoginAt = admin.LastLoginAt,
                CreatedDate = admin.CreatedDate,
            };
        }

        public async Task ForgotPassword(AdminForgotPasswordDto dto)
        {
            var admin = await GetByUsernameOrThrow(dto.Username);

            if (admin.PasswordResetCodeSentAt.HasValue)
            {
                var elapsed = DateTime.UtcNow - admin.PasswordResetCodeSentAt.Value;
                if (elapsed < PasswordResetCooldown)
                {
                    var wait = (int)Math.Ceiling((PasswordResetCooldown - elapsed).TotalSeconds);
                    throw new Exception($"Please wait {wait} seconds before requesting a new code");
                }
            }

            admin.PasswordResetCode = Random.Shared.Next(100000, 999999).ToString();
            admin.PasswordResetCodeExpiresAt = DateTime.UtcNow.AddMinutes(15);
            admin.PasswordResetCodeSentAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();

            await _emailService.SendAsync(
                admin.Email,
                "Sahnem Admin — şifre sıfırlama kodun",
                EmailTemplates.PasswordResetCode(admin.Username, admin.PasswordResetCode));
        }

        public async Task VerifyResetCode(AdminVerifyResetCodeDto dto)
        {
            var admin = await GetByUsernameOrThrow(dto.Username);
            EnsureResetCodeIsValid(admin, dto.Code);
        }

        public async Task ResetPassword(AdminResetPasswordDto dto)
        {
            var admin = await GetByUsernameOrThrow(dto.Username);
            EnsureResetCodeIsValid(admin, dto.Code);

            if (dto.NewPassword.Length < 8)
            {
                throw new Exception("New password must be at least 8 characters long");
            }

            admin.PasswordHash = _passwordHasher.HashPassword(admin, dto.NewPassword);
            admin.PasswordResetCode = null;
            admin.PasswordResetCodeExpiresAt = null;
            admin.PasswordResetCodeSentAt = null;

            var tokens = await _refreshTokenRepository.WhereAsync(t => t.AdminId == admin.Id);
            foreach (var token in tokens)
            {
                _refreshTokenRepository.Delete(token);
            }

            await _unitOfWork.SaveChanges();
        }

        public async Task ChangePassword(AdminChangePasswordDto dto)
        {
            var admin = await _adminRepository.GetByIdAsync(_currentAdminService.AdminId);
            if (admin == null) throw new Exception("Admin not found");

            var result = _passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, dto.CurrentPassword);
            if (result != PasswordVerificationResult.Success && result != PasswordVerificationResult.SuccessRehashNeeded)
            {
                throw new Exception("Current password is incorrect");
            }
            if (dto.NewPassword.Length < 8)
            {
                throw new Exception("New password must be at least 8 characters long");
            }

            admin.PasswordHash = _passwordHasher.HashPassword(admin, dto.NewPassword);
            await _unitOfWork.SaveChanges();
        }

        private async Task<Admin> GetByUsernameOrThrow(string username)
        {
            var normalized = username.Trim().ToLower();
            var admin = await _adminRepository.FirstOrDefaultAsync(a => a.Username.ToLower() == normalized);
            if (admin == null) throw new Exception("No admin account found with this username");
            return admin;
        }

        private static void EnsureResetCodeIsValid(Admin admin, string code)
        {
            if (string.IsNullOrEmpty(admin.PasswordResetCode)
                || admin.PasswordResetCodeExpiresAt == null
                || admin.PasswordResetCodeExpiresAt < DateTime.UtcNow)
            {
                throw new Exception("Reset code has expired, please request a new one");
            }
            if (admin.PasswordResetCode != code.Trim())
            {
                throw new Exception("Invalid reset code");
            }
        }

        private async Task<AdminTokenPairDto> IssueTokens(Admin admin)
        {
            var accessToken = GenerateAccessToken(admin);

            var refreshToken = new AdminRefreshToken
            {
                Token = GenerateSecureToken(),
                AdminId = admin.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpireDays),
            };
            await _refreshTokenRepository.AddAsync(refreshToken);
            await _unitOfWork.SaveChanges();

            return new AdminTokenPairDto
            {
                AccessToken = accessToken.token,
                ExpiresAt = accessToken.expiresAt,
                RefreshToken = refreshToken.Token,
                RefreshTokenExpiresAt = refreshToken.ExpiresAt,
            };
        }

        private (string token, DateTime expiresAt) GenerateAccessToken(Admin admin)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, admin.Id.ToString()),
                new(ClaimTypes.Email, admin.Email),
                new(ClaimTypes.Name, admin.Username),
                // Bu claim'i sadece bu servis üretebilir — normal kullanıcı JWT'si
                // içinde asla yer almaz, admin endpoint'lerinin yetkilendirme
                // politikası tam olarak bunu arıyor.
                new("token_type", "system_admin"),
            };

            var expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpireMinutes);
            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiration,
                signingCredentials: credentials);

            return (new JwtSecurityTokenHandler().WriteToken(token), expiration);
        }

        private static string GenerateSecureToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
    }
}
