using AutoMapper;
using FluentValidation;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;
using Sahnem.Business.Email;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Business.Validators;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<AppUser> _repository;
        private readonly IGenericRepository<Offer> _offerRepository;
        private readonly IGenericRepository<Advert> _advertRepository;
        private readonly IGenericRepository<Favorite> _favoriteRepository;
        private readonly IGenericRepository<Notification> _notificationRepository;
        private readonly IGenericRepository<RefreshToken> _refreshTokenRepository;
        private readonly IGenericRepository<Conversation> _conversationRepository;
        private readonly IGenericRepository<Message> _messageRepository;
        private readonly IValidator<AppUserRegisterDto> _appUserRegisterValidator;
        private readonly IValidator<AppUserLoginDto> _appUserLoginValidator;
        private readonly IValidator<AppUserUpdateDto> _appUserUpdateValidator;
        private readonly IValidator<ChangePasswordDto> _changePasswordValidator;
        private readonly IValidator<ForgotPasswordDto> _forgotPasswordValidator;
        private readonly IValidator<VerifyResetCodeDto> _verifyResetCodeValidator;
        private readonly IValidator<ResetPasswordDto> _resetPasswordValidator;
        private readonly IPasswordService _passwordService;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly ICurrentUserService _currentUserService;


        public UserService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IGenericRepository<AppUser> repository,
            IGenericRepository<Offer> offerRepository,
            IGenericRepository<Advert> advertRepository,
            IGenericRepository<Favorite> favoriteRepository,
            IGenericRepository<Notification> notificationRepository,
            IGenericRepository<RefreshToken> refreshTokenRepository,
            IGenericRepository<Conversation> conversationRepository,
            IGenericRepository<Message> messageRepository,
            IValidator<AppUserRegisterDto> appUserRegiserValidator,
            IValidator<AppUserLoginDto> appUserLoginValidator,
            IValidator<AppUserUpdateDto> appUserUpdateValidator,
            IValidator<ChangePasswordDto> changePasswordValidator,
            IValidator<ForgotPasswordDto> forgotPasswordValidator,
            IValidator<VerifyResetCodeDto> verifyResetCodeValidator,
            IValidator<ResetPasswordDto> resetPasswordValidator,
            IPasswordService passwordService,
            ITokenService tokenService,
            IEmailService emailService,
            ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repository = repository;
            _offerRepository = offerRepository;
            _advertRepository = advertRepository;
            _favoriteRepository = favoriteRepository;
            _notificationRepository = notificationRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
            _appUserRegisterValidator = appUserRegiserValidator;
            _appUserLoginValidator = appUserLoginValidator;
            _appUserUpdateValidator = appUserUpdateValidator;
            _changePasswordValidator = changePasswordValidator;
            _forgotPasswordValidator = forgotPasswordValidator;
            _verifyResetCodeValidator = verifyResetCodeValidator;
            _resetPasswordValidator = resetPasswordValidator;
            _passwordService = passwordService;
            _tokenService = tokenService;
            _emailService = emailService;
            _currentUserService = currentUserService;
        }



        public async Task<PagedResultDto<AppUserResponseDto>> GetAllUsers(
            int page = 1, int pageSize = 20, string? search = null, UserType? role = null,
            bool? isActive = null, bool? isEmailConfirmed = null)
        {
            // Bu metoda sadece AdminController'dan erişiliyor ve o controller
            // [Authorize(Policy="SystemAdmin")] ile korunuyor — ayrı bir kimlik
            // doğrulama şeması (AdminScheme) kullandığı için burada normal kullanıcı
            // ICurrentUserService'iyle tekrar rol kontrolü yapmak mümkün değil.
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var users = (await _repository.GetAllAsync()).AsEnumerable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLowerInvariant();
                users = users.Where(u =>
                    u.FirstName.ToLowerInvariant().Contains(term) ||
                    u.LastName.ToLowerInvariant().Contains(term) ||
                    u.Email.ToLowerInvariant().Contains(term) ||
                    u.PhoneNumber.Contains(term));
            }
            if (role.HasValue) users = users.Where(u => u.Role == role.Value);
            if (isActive.HasValue) users = users.Where(u => u.IsActive == isActive.Value);
            if (isEmailConfirmed.HasValue) users = users.Where(u => u.IsEmailConfirmed == isEmailConfirmed.Value);

            var filtered = users.OrderByDescending(u => u.CreatedDate).ToList();
            var paged = filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PagedResultDto<AppUserResponseDto>
            {
                Items = _mapper.Map<IEnumerable<AppUserResponseDto>>(paged),
                Page = page,
                PageSize = pageSize,
                TotalCount = filtered.Count,
            };
        }

        public async Task SuspendUser(int userId)
        {
            var user = await _repository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User Not Found");

            user.IsActive = false;

            // Askıya alınan kullanıcının açık oturumları da kesilsin — access token
            // süresi dolana kadar (en fazla Jwt:ExpireMinutes) işlem yapabilir ama
            // sonrasında yeni bir token alamaz.
            var tokens = await _refreshTokenRepository.WhereAsync(t => t.AppUserId == userId);
            foreach (var token in tokens)
            {
                _refreshTokenRepository.Delete(token);
            }

            await _unitOfWork.SaveChanges();
        }

        public async Task ReactivateUser(int userId)
        {
            var user = await _repository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User Not Found");

            user.IsActive = true;
            await _unitOfWork.SaveChanges();
        }

        public async Task<AppUserResponseDto> GetUserById(int id)
        {
            // IDOR koruması: bir kullanıcının e-posta/telefon gibi PII bilgilerini
            // sadece kendisi ya da bir Admin görebilir — id'yi değiştirip başka bir
            // kullanıcının profiline bakmak mümkün olmamalı.
            if (id != _currentUserService.UserId && _currentUserService.Role != nameof(UserType.Admin))
            {
                throw new Exception("You are not authorized to view this user");
            }

            var user = await _repository.GetByIdAsync(id);
            if(user == null)
            {
                throw new Exception("User Not Found");
            }
            var dto = _mapper.Map<AppUserResponseDto>(user);
            return dto;


        }

        public async Task<TokenPairDto> RegisterUser(AppUserRegisterDto userRegisterDto)
        {
            var validationResult = await _appUserRegisterValidator.ValidateAsync(userRegisterDto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }


            var user = _mapper.Map<AppUser>(userRegisterDto);
            user.Email = user.Email.Trim().ToLower();

            if (await EmailExists(user.Email))
            {
                throw new Exception("User with this email already exists");
            }
            if(await PhoneNumberExists(user.PhoneNumber))
            {
                throw new Exception("User with this phone number already exists");
            }

            user.PasswordHash = _passwordService.HashPassword(user, userRegisterDto.Password);
            SetNewVerificationCode(user);

            await _repository.AddAsync(user);
            await _unitOfWork.SaveChanges();

            await SendVerificationEmail(user);

            // Kayıt anında da token üretiliyor: kullanıcı hesap oluşturur oluşturmaz
            // giriş yapmış sayılır ve profil kurulum sihirbazına bu token ile devam
            // eder. Profilini tamamladığında (CreateMusicianProfile vb.) Role ve
            // IsProfileCompleted=true claim'lerini taşıyan İKİNCİ bir token üretilir —
            // uygulamanın asıl ana ekranına o token ile girilir.
            return await _tokenService.IssueTokensAsync(user);
        }



        public Task DeleteUser()
        {
            return DeleteUserById(_currentUserService.UserId);
        }

        public Task AdminDeleteUser(int userId)
        {
            // Bu metoda sadece AdminController'dan (SystemAdmin policy'siyle korunan)
            // erişiliyor — admin artık ayrı bir tabloda (Admins), silinen AppUser
            // ile aynı kimlik uzayında olmadığı için burada bir "kendini silme"
            // ihtimali de yok.
            return DeleteUserById(userId);
        }

        private async Task DeleteUserById(int userId)
        {
            var user = await _repository.GetByIdAsync(userId);
            if(user == null)
            {
                throw new Exception("User Not Found");

            }

            // AppUser'a Restrict ile bağlı ilişkiler (Offer/Advert/Favorite/
            // Notification/RefreshToken/Conversation/Message) veritabanı seviyesinde
            // otomatik silinmiyor — kullanıcıyı silmeden önce bunları burada elle
            // temizlemezsek FK ihlaliyle patlar. Profil kayıtları (Musician/
            // Organizer/Venue) zaten cascade olduğu için ayrıca elle silinmiyor.

            var conversations = await _conversationRepository.WhereAsync(
                c => c.UserAId == userId || c.UserBId == userId);
            foreach (var conversation in conversations)
            {
                var messages = await _messageRepository.WhereAsync(m => m.ConversationId == conversation.Id);
                foreach (var message in messages)
                {
                    _messageRepository.Delete(message);
                }
                _conversationRepository.Delete(conversation);
            }

            var offersAsMusician = await _offerRepository.WhereAsync(o => o.MusicianId == userId);
            foreach (var offer in offersAsMusician)
            {
                _offerRepository.Delete(offer);
            }

            var ownAdverts = await _advertRepository.WhereAsync(a => a.CreatorId == userId);
            foreach (var advert in ownAdverts)
            {
                var offersOnAdvert = await _offerRepository.WhereAsync(o => o.AdvertId == advert.Id);
                foreach (var offer in offersOnAdvert)
                {
                    _offerRepository.Delete(offer);
                }
                _advertRepository.Delete(advert);
            }

            var favorites = await _favoriteRepository.WhereAsync(
                f => f.OwnerUserId == userId || f.MusicianUserId == userId);
            foreach (var favorite in favorites)
            {
                _favoriteRepository.Delete(favorite);
            }

            var notifications = await _notificationRepository.WhereAsync(n => n.UserId == userId);
            foreach (var notification in notifications)
            {
                _notificationRepository.Delete(notification);
            }

            var refreshTokens = await _refreshTokenRepository.WhereAsync(r => r.AppUserId == userId);
            foreach (var refreshToken in refreshTokens)
            {
                _refreshTokenRepository.Delete(refreshToken);
            }

            _repository.Delete(user);
            await _unitOfWork.SaveChanges();
        }

        public async Task<TokenPairDto> LoginUser(AppUserLoginDto userLoginDto)
        {
            var validationResult = await _appUserLoginValidator.ValidateAsync(userLoginDto);
            if(!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await _repository.FirstOrDefaultAsync(u=> u.Email == userLoginDto.Email.Trim().ToLower());
            if(user == null)
            {
                throw new Exception("Invalid Email Or Password");
            }
            var isValid = _passwordService.VerifyPassword(user, user.PasswordHash, userLoginDto.Password);
            if (!isValid)
            {
                throw new Exception("Invalid Email Or Password");
            }
            if (!user.IsActive)
            {
                throw new Exception("This account has been suspended");
            }

            return await _tokenService.IssueTokensAsync(user);

        }

        public async Task<AppUserResponseDto> GetMe()
        {
            var userId = _currentUserService.UserId;
            var me = await _repository.GetByIdAsync(userId);
            return _mapper.Map<AppUserResponseDto>(me);
        }


        public async Task UpdateUser(AppUserUpdateDto dto)
        {
            var validationResult = await _appUserUpdateValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }


            var user = await _repository.GetByIdAsync(_currentUserService.UserId);

            if(user == null)
            {
                throw new Exception("User not found");
            }

            _mapper.Map(dto, user);
            await _unitOfWork.SaveChanges();
        }

        public async Task ChangePassword(ChangePasswordDto dto)
        {
            var validationResult = await _changePasswordValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await _repository.GetByIdAsync(_currentUserService.UserId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var isValid = _passwordService.VerifyPassword(user, user.PasswordHash, dto.CurrentPassword);
            if (!isValid)
            {
                throw new Exception("Current password is incorrect");
            }

            user.PasswordHash = _passwordService.HashPassword(user, dto.NewPassword);
            await _unitOfWork.SaveChanges();
        }

        public async Task<TokenPairDto> RefreshToken(string refreshToken)
        {
            return await _tokenService.RefreshAsync(refreshToken);
        }

        public async Task Logout(string refreshToken)
        {
            await _tokenService.RevokeAsync(refreshToken);
        }

        public async Task VerifyEmail(string code)
        {
            var userId = _currentUserService.UserId;
            var user = await _repository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            if (user.IsEmailConfirmed)
            {
                throw new Exception("Email already verified");
            }
            if (string.IsNullOrEmpty(user.EmailVerificationCode)
                || user.EmailVerificationCodeExpiresAt == null
                || user.EmailVerificationCodeExpiresAt < DateTime.UtcNow)
            {
                throw new Exception("Verification code has expired, please request a new one");
            }
            if (user.EmailVerificationCode != code.Trim())
            {
                throw new Exception("Invalid verification code");
            }

            user.IsEmailConfirmed = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationCodeExpiresAt = null;
            await _unitOfWork.SaveChanges();
        }

        private static readonly TimeSpan VerificationResendCooldown = TimeSpan.FromSeconds(60);

        public async Task ResendVerificationEmail()
        {
            var userId = _currentUserService.UserId;
            var user = await _repository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            if (user.IsEmailConfirmed)
            {
                throw new Exception("Email already verified");
            }

            // Aynı kullanıcının saniyeler içinde defalarca "yeniden gönder"e basıp
            // hem kendi kutusunu spam'lemesini hem de Zoho gönderim kotamızı
            // gereksiz tüketmesini engelliyor — IP bazlı genel rate limiter (auth
            // policy) bunu tek başına yakalamaz çünkü aynı kullanıcı/IP'den gelir.
            if (user.EmailVerificationCodeSentAt.HasValue)
            {
                var elapsed = DateTime.UtcNow - user.EmailVerificationCodeSentAt.Value;
                if (elapsed < VerificationResendCooldown)
                {
                    var waitSeconds = (int)Math.Ceiling((VerificationResendCooldown - elapsed).TotalSeconds);
                    throw new Exception($"Please wait {waitSeconds} seconds before requesting a new code");
                }
            }

            SetNewVerificationCode(user);
            await _unitOfWork.SaveChanges();
            await SendVerificationEmail(user);
        }

        private static void SetNewVerificationCode(AppUser user)
        {
            // Yeni kod üretildiği an eski kod otomatik geçersiz sayılır — VerifyEmail
            // her zaman user.EmailVerificationCode'daki GÜNCEL değerle karşılaştırıyor.
            user.EmailVerificationCode = Random.Shared.Next(100000, 999999).ToString();
            user.EmailVerificationCodeExpiresAt = DateTime.UtcNow.AddMinutes(15);
            user.EmailVerificationCodeSentAt = DateTime.UtcNow;
        }

        private Task SendVerificationEmail(AppUser user)
        {
            return _emailService.SendAsync(
                user.Email,
                "Sahnem hesabını doğrula",
                EmailTemplates.VerificationCode(user.FirstName, user.EmailVerificationCode!));
        }

        private static readonly TimeSpan PasswordResetCooldown = TimeSpan.FromSeconds(60);

        public async Task ForgotPassword(ForgotPasswordDto dto)
        {
            var validationResult = await _forgotPasswordValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await GetUserByEmailOrThrow(dto.Email);

            if (user.PasswordResetCodeSentAt.HasValue)
            {
                var elapsed = DateTime.UtcNow - user.PasswordResetCodeSentAt.Value;
                if (elapsed < PasswordResetCooldown)
                {
                    var waitSeconds = (int)Math.Ceiling((PasswordResetCooldown - elapsed).TotalSeconds);
                    throw new Exception($"Please wait {waitSeconds} seconds before requesting a new code");
                }
            }

            user.PasswordResetCode = Random.Shared.Next(100000, 999999).ToString();
            user.PasswordResetCodeExpiresAt = DateTime.UtcNow.AddMinutes(15);
            user.PasswordResetCodeSentAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();

            await _emailService.SendAsync(
                user.Email,
                "Şifre sıfırlama kodun",
                EmailTemplates.PasswordResetCode(user.FirstName, user.PasswordResetCode));
        }

        // Kod adım adım (önce doğrula, sonra yeni şifreyi gönder) girildiği için bu
        // metod kodu TÜKETMİYOR — sadece geçerli mi diye bakıyor. Asıl tüketme
        // (null'lanması) ResetPassword'de, gerçekten şifre değiştiğinde oluyor.
        public async Task VerifyResetCode(VerifyResetCodeDto dto)
        {
            var validationResult = await _verifyResetCodeValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await GetUserByEmailOrThrow(dto.Email);
            EnsureResetCodeIsValid(user, dto.Code);
        }

        public async Task ResetPassword(ResetPasswordDto dto)
        {
            var validationResult = await _resetPasswordValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await GetUserByEmailOrThrow(dto.Email);
            EnsureResetCodeIsValid(user, dto.Code);

            var isSameAsCurrentPassword = _passwordService.VerifyPassword(user, user.PasswordHash, dto.NewPassword);
            if (isSameAsCurrentPassword)
            {
                throw new Exception("New password must be different from your current password");
            }

            user.PasswordHash = _passwordService.HashPassword(user, dto.NewPassword);
            user.PasswordResetCode = null;
            user.PasswordResetCodeExpiresAt = null;
            user.PasswordResetCodeSentAt = null;

            // Şifre sıfırlandığında tüm cihazlardaki oturumlar geçersiz olsun —
            // hesaba başka biri erişmiş olsa bile eski refresh token'larla devam edemesin.
            var tokens = await _refreshTokenRepository.WhereAsync(t => t.AppUserId == user.Id);
            foreach (var token in tokens)
            {
                _refreshTokenRepository.Delete(token);
            }

            await _unitOfWork.SaveChanges();
        }

        private async Task<AppUser> GetUserByEmailOrThrow(string email)
        {
            var normalizedEmail = email.Trim().ToLower();
            var user = await _repository.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (user == null)
            {
                throw new Exception("No account found with this email");
            }
            return user;
        }

        private static void EnsureResetCodeIsValid(AppUser user, string code)
        {
            if (string.IsNullOrEmpty(user.PasswordResetCode)
                || user.PasswordResetCodeExpiresAt == null
                || user.PasswordResetCodeExpiresAt < DateTime.UtcNow)
            {
                throw new Exception("Reset code has expired, please request a new one");
            }
            if (user.PasswordResetCode != code.Trim())
            {
                throw new Exception("Invalid reset code");
            }
        }

        private Task<bool> EmailExists(string email)
        {
            var existing = _repository.AnyAsync(u => u.Email == email);

            return existing;
        }

        private Task<bool> PhoneNumberExists(string phoneNumber)
        {
            var existing = _repository.AnyAsync(u => u.PhoneNumber == phoneNumber);
            return existing;
        }


    }
}
