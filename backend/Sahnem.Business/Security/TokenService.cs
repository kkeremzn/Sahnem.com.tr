using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Security
{
    public class TokenService : ITokenService
    {
        private readonly IJwtService _jwtService;
        private readonly IGenericRepository<RefreshToken> _refreshTokenRepository;
        private readonly IGenericRepository<AppUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtSettings _jwtSettings;

        public TokenService(
            IJwtService jwtService,
            IGenericRepository<RefreshToken> refreshTokenRepository,
            IGenericRepository<AppUser> userRepository,
            IUnitOfWork unitOfWork,
            IOptions<JwtSettings> jwtSettings)
        {
            _jwtService = jwtService;
            _refreshTokenRepository = refreshTokenRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<TokenPairDto> IssueTokensAsync(AppUser user)
        {
            var accessToken = _jwtService.GenerateToken(user);

            var refreshToken = new RefreshToken
            {
                Token = GenerateSecureToken(),
                AppUserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpireDays),
            };
            await _refreshTokenRepository.AddAsync(refreshToken);
            await _unitOfWork.SaveChanges();

            return new TokenPairDto
            {
                AccessToken = accessToken.AccessToken,
                ExpiresAt = accessToken.ExpiresAt,
                RefreshToken = refreshToken.Token,
                RefreshTokenExpiresAt = refreshToken.ExpiresAt,
            };
        }

        public async Task<TokenPairDto> RefreshAsync(string refreshToken)
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

            var user = await _userRepository.GetByIdAsync(existing.AppUserId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Rotasyon: eski token iptal edilir, yenisi üretilir.
            existing.RevokedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();

            return await IssueTokensAsync(user);
        }

        public async Task RevokeAsync(string refreshToken)
        {
            var existing = await _refreshTokenRepository.FirstOrDefaultAsync(r => r.Token == refreshToken);
            if (existing == null || existing.RevokedAt != null)
            {
                return;
            }
            existing.RevokedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();
        }

        private static string GenerateSecureToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
        }
    }
}
