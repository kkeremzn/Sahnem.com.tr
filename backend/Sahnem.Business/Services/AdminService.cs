using AutoMapper;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Admin;
using Sahnem.Business.DTOs.User;
using Sahnem.Business.Email;
using Sahnem.Business.Helpers;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    // Bu servisin tüm metodlarına yalnızca AdminController üzerinden erişilir —
    // o controller [Authorize(Policy="SystemAdmin")] ile korunuyor (ayrı bir kimlik
    // doğrulama şeması, normal kullanıcı sisteminden bağımsız) — burada tekrar
    // rol kontrolü yapmak mümkün/gerekli değil.
    public class AdminService : IAdminService
    {
        private readonly IGenericRepository<MusicianProfile> _musicianProfileRepository;
        private readonly IGenericRepository<OrganizerProfile> _organizerProfileRepository;
        private readonly IGenericRepository<VenueProfile> _venueProfileRepository;
        private readonly IGenericRepository<AppUser> _userRepository;
        private readonly IGenericRepository<Advert> _advertRepository;
        private readonly IGenericRepository<Offer> _offerRepository;
        private readonly IGenericRepository<Message> _messageRepository;
        private readonly IGenericRepository<Conversation> _conversationRepository;
        private readonly IGenericRepository<Favorite> _favoriteRepository;
        private readonly IGenericRepository<Notification> _notificationRepository;
        private readonly IGenericRepository<RefreshToken> _refreshTokenRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IPasswordService _passwordService;

        public AdminService(
            IGenericRepository<MusicianProfile> musicianProfileRepository,
            IGenericRepository<OrganizerProfile> organizerProfileRepository,
            IGenericRepository<VenueProfile> venueProfileRepository,
            IGenericRepository<AppUser> userRepository,
            IGenericRepository<Advert> advertRepository,
            IGenericRepository<Offer> offerRepository,
            IGenericRepository<Message> messageRepository,
            IGenericRepository<Conversation> conversationRepository,
            IGenericRepository<Favorite> favoriteRepository,
            IGenericRepository<Notification> notificationRepository,
            IGenericRepository<RefreshToken> refreshTokenRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IEmailService emailService,
            IPasswordService passwordService)
        {
            _musicianProfileRepository = musicianProfileRepository;
            _organizerProfileRepository = organizerProfileRepository;
            _venueProfileRepository = venueProfileRepository;
            _userRepository = userRepository;
            _advertRepository = advertRepository;
            _offerRepository = offerRepository;
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _favoriteRepository = favoriteRepository;
            _notificationRepository = notificationRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
            _passwordService = passwordService;
        }

        public async Task<AdminStatsDto> GetStats()
        {
            var users = (await _userRepository.GetAllAsync()).ToList();
            var adverts = (await _advertRepository.GetAllAsync()).ToList();
            var offers = (await _offerRepository.GetAllAsync()).ToList();
            var conversations = (await _conversationRepository.GetAllAsync()).ToList();
            var messages = (await _messageRepository.GetAllAsync()).ToList();

            var now = DateTime.UtcNow;

            // Kaydolup e-posta doğrulamasını hiç bitirmeden VE profilini hiç
            // oluşturmadan yarım bırakılan hesaplar "gerçek" bir kullanıcı
            // sayılmamalı (RegistrationCleanupService bunları ayrıca periyodik
            // temizliyor). Sadece e-posta doğrulanmamış ama profili tamamlanmış
            // hesaplar (bu özellik eklenmeden önce kayıt olmuş gerçek kullanıcılar)
            // hâlâ gerçek kullanıcı sayılır.
            var realUsers = users.Where(u => u.IsEmailConfirmed || u.IsProfileCompleted).ToList();
            var abandonedSignups = users.Count - realUsers.Count;

            return new AdminStatsDto
            {
                TotalUsers = realUsers.Count,
                TotalMusicians = realUsers.Count(u => u.Role == UserType.Musician),
                TotalOrganizers = realUsers.Count(u => u.Role == UserType.Organizer),
                TotalVenues = realUsers.Count(u => u.Role == UserType.Venue),
                AbandonedSignups = abandonedSignups,
                SuspendedUsers = realUsers.Count(u => !u.IsActive),
                NewUsersLast7Days = realUsers.Count(u => u.CreatedDate >= now.AddDays(-7)),
                NewUsersLast30Days = realUsers.Count(u => u.CreatedDate >= now.AddDays(-30)),

                TotalAdverts = adverts.Count,
                OpenAdverts = adverts.Count(a => a.Status == AdvertStatus.Open),
                ClosedAdverts = adverts.Count(a => a.Status == AdvertStatus.Closed),
                CancelledAdverts = adverts.Count(a => a.Status == AdvertStatus.Cancelled),

                TotalOffers = offers.Count,
                PendingOffers = offers.Count(o => o.OfferStatus == OfferStatus.Pending),
                AcceptedOffers = offers.Count(o => o.OfferStatus == OfferStatus.Accepted),
                RejectedOffers = offers.Count(o => o.OfferStatus == OfferStatus.Rejected),

                TotalConversations = conversations.Count,
                TotalMessages = messages.Count,

                RecentSignups = realUsers
                    .OrderByDescending(u => u.CreatedDate)
                    .Take(8)
                    .Select(u => new AdminRecentUserDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Role = u.Role.ToString(),
                        CreatedDate = u.CreatedDate,
                    })
                    .ToList(),

                RecentAdverts = adverts
                    .OrderByDescending(a => a.CreatedDate)
                    .Take(8)
                    .Select(a => new AdminRecentAdvertDto
                    {
                        Id = a.Id,
                        Title = a.Title,
                        Status = a.Status.ToString(),
                        CreatedDate = a.CreatedDate,
                    })
                    .ToList(),
            };
        }

        public async Task<AdminUserDetailDto> GetUserDetail(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User Not Found");

            var advertCount = (await _advertRepository.WhereAsync(a => a.CreatorId == userId)).Count();
            var offerCount = (await _offerRepository.WhereAsync(o => o.MusicianId == userId)).Count();
            var messageCount = (await _messageRepository.WhereAsync(m => m.SenderId == userId)).Count();
            var conversationCount = (await _conversationRepository.WhereAsync(c => c.UserAId == userId || c.UserBId == userId)).Count();
            var favoriteCount = (await _favoriteRepository.WhereAsync(f => f.OwnerUserId == userId || f.MusicianUserId == userId)).Count();

            string? profileSummary = null;

            switch (user.Role)
            {
                case UserType.Musician:
                    var musician = await _musicianProfileRepository.FirstOrDefaultAsync(m => m.AppUserId == userId);
                    if (musician != null)
                    {
                        var branches = string.Join(", ", MultiEnumField.Parse<MusicBranch>(musician.Branch));
                        profileSummary = $"{branches} · {musician.City} · {musician.ExperienceYears} yıl deneyim";
                    }
                    break;
                case UserType.Organizer:
                    var organizer = await _organizerProfileRepository.FirstOrDefaultAsync(o => o.AppUserId == userId);
                    if (organizer != null)
                    {
                        profileSummary = $"{organizer.OrganizerName} · {organizer.OrganizerType} · {organizer.City}";
                    }
                    break;
                case UserType.Venue:
                    var venue = await _venueProfileRepository.FirstOrDefaultAsync(v => v.AppUserId == userId);
                    if (venue != null)
                    {
                        profileSummary = $"{venue.VenueName} · {venue.City} · {venue.Capacity} kişi kapasite";
                    }
                    break;
            }

            return new AdminUserDetailDto
            {
                User = _mapper.Map<AppUserResponseDto>(user),
                AdvertCount = advertCount,
                OfferCount = offerCount,
                MessageCount = messageCount,
                ConversationCount = conversationCount,
                FavoriteCount = favoriteCount,
                ProfileSummary = profileSummary,
            };
        }

        public async Task<PagedResultDto<AdminConversationDto>> GetConversations(int page = 1, int pageSize = 20, string? search = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var conversations = (await _conversationRepository.GetAllAsync()).ToList();
            var userIds = conversations.Select(c => c.UserAId).Concat(conversations.Select(c => c.UserBId)).Distinct().ToList();
            var users = await _userRepository.WhereAsync(u => userIds.Contains(u.Id));
            var messageCounts = (await _messageRepository.GetAllAsync())
                .GroupBy(m => m.ConversationId)
                .ToDictionary(g => g.Key, g => g.Count());

            var dtos = conversations.Select(c =>
            {
                var userA = users.FirstOrDefault(u => u.Id == c.UserAId);
                var userB = users.FirstOrDefault(u => u.Id == c.UserBId);
                return new AdminConversationDto
                {
                    Id = c.Id,
                    UserAId = c.UserAId,
                    UserAName = userA == null ? "" : $"{userA.FirstName} {userA.LastName}",
                    UserBId = c.UserBId,
                    UserBName = userB == null ? "" : $"{userB.FirstName} {userB.LastName}",
                    LastMessage = c.LastMessage,
                    LastMessageAt = c.LastMessageAt,
                    MessageCount = messageCounts.TryGetValue(c.Id, out var count) ? count : 0,
                    CreatedDate = c.CreatedDate,
                };
            });

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLowerInvariant();
                dtos = dtos.Where(d => d.UserAName.ToLowerInvariant().Contains(term) || d.UserBName.ToLowerInvariant().Contains(term));
            }

            var filtered = dtos.OrderByDescending(d => d.LastMessageAt).ToList();
            var paged = filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PagedResultDto<AdminConversationDto>
            {
                Items = paged,
                Page = page,
                PageSize = pageSize,
                TotalCount = filtered.Count,
            };
        }

        public async Task<IEnumerable<AdminMessageDto>> GetConversationMessages(int conversationId)
        {
            var messages = await _messageRepository.WhereAsync(m => m.ConversationId == conversationId);
            var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
            var senders = await _userRepository.WhereAsync(u => senderIds.Contains(u.Id));

            return messages.OrderBy(m => m.CreatedDate).Select(m =>
            {
                var sender = senders.FirstOrDefault(u => u.Id == m.SenderId);
                return new AdminMessageDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    SenderName = sender == null ? "" : $"{sender.FirstName} {sender.LastName}",
                    Body = m.Body,
                    CreatedDate = m.CreatedDate,
                };
            });
        }

        public async Task DeleteMessage(int messageId)
        {
            var message = await _messageRepository.GetByIdAsync(messageId);
            if (message == null) throw new Exception("Message not found");

            var conversationId = message.ConversationId;
            _messageRepository.Delete(message);
            await _unitOfWork.SaveChanges();

            // Silinen mesaj sohbetin son mesajıysa, Conversation.LastMessage/
            // LastMessageAt eski (artık var olmayan) mesajı göstermeye devam
            // ederdi — kalan en son mesaja göre yeniden hesaplanıyor.
            var conversation = await _conversationRepository.GetByIdAsync(conversationId);
            if (conversation != null)
            {
                var remaining = await _messageRepository.WhereAsync(m => m.ConversationId == conversationId);
                var newest = remaining.OrderByDescending(m => m.CreatedDate).FirstOrDefault();
                conversation.LastMessage = newest?.Body ?? "";
                conversation.LastMessageAt = newest?.CreatedDate ?? conversation.CreatedDate;
                await _unitOfWork.SaveChanges();
            }
        }

        private async Task<List<AppUser>> ResolveTargets(List<int>? userIds, UserType? role = null)
        {
            if (userIds is { Count: > 0 })
            {
                var idSet = userIds.ToHashSet();
                return (await _userRepository.WhereAsync(u => idSet.Contains(u.Id) && u.IsActive)).ToList();
            }
            if (role.HasValue)
            {
                return (await _userRepository.WhereAsync(u => u.Role == role.Value && u.IsActive)).ToList();
            }
            return (await _userRepository.WhereAsync(u => u.IsActive)).ToList();
        }

        public async Task<AdminBroadcastResultDto> BroadcastNotification(AdminBroadcastNotificationDto dto)
        {
            var targets = await ResolveTargets(dto.UserIds, dto.Role);
            foreach (var user in targets)
            {
                await _notificationRepository.AddAsync(new Notification
                {
                    UserId = user.Id,
                    Type = "system",
                    Title = dto.Title,
                    Body = dto.Body,
                    LinkTo = dto.LinkTo,
                });
            }
            await _unitOfWork.SaveChanges();
            return new AdminBroadcastResultDto { RecipientCount = targets.Count };
        }

        public async Task<AdminBroadcastResultDto> SendBulkEmail(AdminSendEmailDto dto)
        {
            var targets = await ResolveTargets(dto.UserIds, dto.Role);
            var delivered = 0;
            foreach (var user in targets)
            {
                if (await _emailService.SendAsync(user.Email, dto.Subject, dto.Body))
                {
                    delivered++;
                }
            }
            // RecipientCount artık "kaç kişiye göndermeye çalıştık" değil, "kaçına
            // gerçekten teslim edildi" anlamına geliyor — önceden hedef sayısı
            // döndürülüyordu, tek bir Zoho hatası bile sessizce yutulup admin'e
            // her şey başarılıymış gibi görünüyordu.
            return new AdminBroadcastResultDto { RecipientCount = delivered, FailedCount = targets.Count - delivered };
        }

        // Destek amaçlı: kullanıcı "kodu alamadım" derse admin buradan tekrar
        // gönderebilsin diye — normal ResendVerificationEmail sadece giriş yapmış
        // kullanıcının kendisi için çalışıyor, bu burada keyfi bir userId alıyor.
        public async Task SendVerificationCodeToUser(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            if (user.IsEmailConfirmed) throw new Exception("This user's email is already verified");

            user.EmailVerificationCode = SecureCodeGenerator.SixDigitCode();
            user.EmailVerificationCodeExpiresAt = DateTime.UtcNow.AddMinutes(15);
            user.EmailVerificationCodeSentAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();

            await _emailService.SendAsync(
                user.Email, "Sahnem hesabını doğrula", EmailTemplates.VerificationCode(user.FirstName, user.EmailVerificationCode));
        }

        public async Task SendPasswordResetCodeToUser(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.PasswordResetCode = SecureCodeGenerator.SixDigitCode();
            user.PasswordResetCodeExpiresAt = DateTime.UtcNow.AddMinutes(15);
            user.PasswordResetCodeSentAt = DateTime.UtcNow;
            await _unitOfWork.SaveChanges();

            await _emailService.SendAsync(
                user.Email, "Şifre sıfırlama kodu — Sahnem", EmailTemplates.PasswordResetCode(user.FirstName, user.PasswordResetCode));
        }

        // Kullanıcı destek hattından ulaşıp "hesabıma giremiyorum, kodu da
        // alamıyorum" derse admin'in şifreyi doğrudan değiştirebilmesi için. Tüm
        // cihazlardaki oturumlar iptal edilir — normal şifre sıfırlama/değiştirmeyle
        // aynı güvenlik kuralı.
        public async Task ResetUserPasswordDirectly(int userId, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
            {
                throw new Exception("Password must be at least 6 characters long");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.PasswordHash = _passwordService.HashPassword(user, newPassword);

            var tokens = await _refreshTokenRepository.WhereAsync(t => t.AppUserId == userId);
            foreach (var token in tokens)
            {
                _refreshTokenRepository.Delete(token);
            }

            await _unitOfWork.SaveChanges();
        }
    }
}
