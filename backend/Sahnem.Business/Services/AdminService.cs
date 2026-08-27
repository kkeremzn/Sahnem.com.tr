using Sahnem.Business.DTOs.Admin;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;
        private readonly INotificationService _notificationService;

        public AdminService(
            IGenericRepository<MusicianProfile> musicianProfileRepository,
            IGenericRepository<OrganizerProfile> organizerProfileRepository,
            IGenericRepository<VenueProfile> venueProfileRepository,
            IGenericRepository<AppUser> userRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService,
            INotificationService notificationService)
        {
            _musicianProfileRepository = musicianProfileRepository;
            _organizerProfileRepository = organizerProfileRepository;
            _venueProfileRepository = venueProfileRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
            _notificationService = notificationService;
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

        private void EnsureAdmin()
        {
            if (_currentUserService.Role != nameof(UserType.Admin))
            {
                throw new Exception("You are not authorized to perform this action");
            }
        }
    }
}
