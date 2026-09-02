using AutoMapper;
using Sahnem.Business.DTOs.Admin;
using Sahnem.Business.DTOs.User;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;

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
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService,
            INotificationService notificationService,
            IMapper mapper)
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
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
            _notificationService = notificationService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PendingVerificationDto>> GetPendingVerifications()
        {
            EnsureAdmin();

            var musicians = await _musicianProfileRepository.WhereAsync(m => m.VerificationStatus == VerificationStatus.Pending);
            var organizers = await _organizerProfileRepository.WhereAsync(o => o.VerificationStatus == VerificationStatus.Pending);
            var venues = await _venueProfileRepository.WhereAsync(v => v.VerificationStatus == VerificationStatus.Pending);

            var userIds = musicians.Select(m => m.AppUserId)
                .Concat(organizers.Select(o => o.AppUserId))
                .Concat(venues.Select(v => v.AppUserId))
                .Distinct()
                .ToList();
            var users = await _userRepository.WhereAsync(u => userIds.Contains(u.Id));

            var result = new List<PendingVerificationDto>();

            foreach (var m in musicians)
            {
                var user = users.FirstOrDefault(u => u.Id == m.AppUserId);
                result.Add(new PendingVerificationDto
                {
                    Kind = "Musician",
                    ProfileId = m.Id,
                    AppUserId = m.AppUserId,
                    Name = user == null ? "" : $"{user.FirstName} {user.LastName}",
                    Email = user?.Email ?? "",
                    CreatedDate = m.CreatedDate,
                });
            }
            foreach (var o in organizers)
            {
                var user = users.FirstOrDefault(u => u.Id == o.AppUserId);
                result.Add(new PendingVerificationDto
                {
                    Kind = "Organizer",
                    ProfileId = o.Id,
                    AppUserId = o.AppUserId,
                    Name = o.OrganizerName,
                    Email = user?.Email ?? "",
                    CreatedDate = o.CreatedDate,
                });
            }
            foreach (var v in venues)
            {
                var user = users.FirstOrDefault(u => u.Id == v.AppUserId);
                result.Add(new PendingVerificationDto
                {
                    Kind = "Venue",
                    ProfileId = v.Id,
                    AppUserId = v.AppUserId,
                    Name = v.VenueName,
                    Email = user?.Email ?? "",
                    CreatedDate = v.CreatedDate,
                });
            }

            return result.OrderBy(r => r.CreatedDate);
        }

        public async Task SetVerificationStatus(string kind, int profileId, VerificationStatus status)
        {
            EnsureAdmin();

            if (status != VerificationStatus.Approved && status != VerificationStatus.Rejected)
            {
                throw new Exception("Status must be Approved or Rejected");
            }

            int appUserId;
            switch (kind.Trim().ToLowerInvariant())
            {
                case "musician":
                    var musician = await _musicianProfileRepository.GetByIdAsync(profileId);
                    if (musician == null) throw new Exception("Musician profile not found");
                    musician.VerificationStatus = status;
                    appUserId = musician.AppUserId;
                    break;
                case "organizer":
                    var organizer = await _organizerProfileRepository.GetByIdAsync(profileId);
                    if (organizer == null) throw new Exception("Organizer profile not found");
                    organizer.VerificationStatus = status;
                    appUserId = organizer.AppUserId;
                    break;
                case "venue":
                    var venue = await _venueProfileRepository.GetByIdAsync(profileId);
                    if (venue == null) throw new Exception("Venue profile not found");
                    venue.VerificationStatus = status;
                    appUserId = venue.AppUserId;
                    break;
                default:
                    throw new Exception("Invalid profile kind, must be musician, organizer or venue");
            }

            await _unitOfWork.SaveChanges();

            var approved = status == VerificationStatus.Approved;
            await _notificationService.CreateNotification(
                appUserId,
                "verification",
                approved ? "Profilin doğrulandı" : "Profil doğrulama talebin reddedildi",
                approved
                    ? "Tebrikler, profilin doğrulandı ve artık \"Doğrulanmış\" rozetiyle görünüyor."
                    : "Profilin bu sefer doğrulanamadı. Bilgilerini gözden geçirip tekrar deneyebilirsin.",
                "/profile/edit");
        }

        public async Task<AdminStatsDto> GetStats()
        {
            EnsureAdmin();

            var users = (await _userRepository.GetAllAsync()).ToList();
            var adverts = (await _advertRepository.GetAllAsync()).ToList();
            var offers = (await _offerRepository.GetAllAsync()).ToList();
            var conversations = (await _conversationRepository.GetAllAsync()).ToList();
            var messages = (await _messageRepository.GetAllAsync()).ToList();

            var pendingVerificationCount =
                (await _musicianProfileRepository.WhereAsync(m => m.VerificationStatus == VerificationStatus.Pending)).Count() +
                (await _organizerProfileRepository.WhereAsync(o => o.VerificationStatus == VerificationStatus.Pending)).Count() +
                (await _venueProfileRepository.WhereAsync(v => v.VerificationStatus == VerificationStatus.Pending)).Count();

            var now = DateTime.UtcNow;

            return new AdminStatsDto
            {
                TotalUsers = users.Count,
                TotalMusicians = users.Count(u => u.Role == UserType.Musician),
                TotalOrganizers = users.Count(u => u.Role == UserType.Organizer),
                TotalVenues = users.Count(u => u.Role == UserType.Venue),
                UnverifiedEmailUsers = users.Count(u => !u.IsEmailConfirmed),
                SuspendedUsers = users.Count(u => !u.IsActive),
                PendingVerifications = pendingVerificationCount,
                NewUsersLast7Days = users.Count(u => u.CreatedDate >= now.AddDays(-7)),
                NewUsersLast30Days = users.Count(u => u.CreatedDate >= now.AddDays(-30)),

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

                RecentSignups = users
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
            EnsureAdmin();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User Not Found");

            var advertCount = (await _advertRepository.WhereAsync(a => a.CreatorId == userId)).Count();
            var offerCount = (await _offerRepository.WhereAsync(o => o.MusicianId == userId)).Count();
            var messageCount = (await _messageRepository.WhereAsync(m => m.SenderId == userId)).Count();
            var conversationCount = (await _conversationRepository.WhereAsync(c => c.UserAId == userId || c.UserBId == userId)).Count();
            var favoriteCount = (await _favoriteRepository.WhereAsync(f => f.OwnerUserId == userId || f.MusicianUserId == userId)).Count();

            string? profileSummary = null;
            VerificationStatus? verificationStatus = null;

            switch (user.Role)
            {
                case UserType.Musician:
                    var musician = await _musicianProfileRepository.FirstOrDefaultAsync(m => m.AppUserId == userId);
                    if (musician != null)
                    {
                        profileSummary = $"{musician.Branch} · {musician.City} · {musician.ExperienceYears} yıl deneyim";
                        verificationStatus = musician.VerificationStatus;
                    }
                    break;
                case UserType.Organizer:
                    var organizer = await _organizerProfileRepository.FirstOrDefaultAsync(o => o.AppUserId == userId);
                    if (organizer != null)
                    {
                        profileSummary = $"{organizer.OrganizerName} · {organizer.OrganizerType} · {organizer.City}";
                        verificationStatus = organizer.VerificationStatus;
                    }
                    break;
                case UserType.Venue:
                    var venue = await _venueProfileRepository.FirstOrDefaultAsync(v => v.AppUserId == userId);
                    if (venue != null)
                    {
                        profileSummary = $"{venue.VenueName} · {venue.City} · {venue.Capacity} kişi kapasite";
                        verificationStatus = venue.VerificationStatus;
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
                VerificationStatus = verificationStatus,
            };
        }

        private void EnsureAdmin()
        {
            if (_currentUserService.Role != nameof(UserType.Admin))
            {
                throw new Exception("You are not authorized to perform this action");
            }
        }
    }
}
