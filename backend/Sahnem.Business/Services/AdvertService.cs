using AutoMapper;
using FluentValidation;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Advert;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class AdvertService : IAdvertService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Advert> _advertRepository;
        private readonly IGenericRepository<Offer> _offerRepository;
        private readonly IGenericRepository<AppUser> _userRepository;
        private readonly IGenericRepository<OrganizerProfile> _organizerProfileRepository;
        private readonly IGenericRepository<VenueProfile> _venueProfileRepository;
        private readonly IGenericRepository<MusicianProfile> _musicianProfileRepository;
        private readonly IGenericRepository<Notification> _notificationRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<AdvertCreateDto> _advertCreateDtoValidator;
        private readonly IValidator<AdvertUpdateDto> _advertUpdateDtoValidator;
        private readonly ICurrentUserService _currentUserService;
        private readonly IEmailService _emailService;


        public AdvertService(
            IUnitOfWork unitOfWork,
            IGenericRepository<Advert> advertRepository,
            IGenericRepository<Offer> offerRepository,
            IGenericRepository<AppUser> userRepository,
            IGenericRepository<OrganizerProfile> organizerProfileRepository,
            IGenericRepository<VenueProfile> venueProfileRepository,
            IGenericRepository<MusicianProfile> musicianProfileRepository,
            IGenericRepository<Notification> notificationRepository,
            IMapper mapper,
            IValidator<AdvertCreateDto> advertCreateDtoValidator,
            IValidator<AdvertUpdateDto> advertUpdateDtoValidator,
            ICurrentUserService currentUserService,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _advertRepository = advertRepository;
            _offerRepository = offerRepository;
            _userRepository = userRepository;
            _organizerProfileRepository = organizerProfileRepository;
            _venueProfileRepository = venueProfileRepository;
            _musicianProfileRepository = musicianProfileRepository;
            _notificationRepository = notificationRepository;
            _mapper = mapper;
            _advertCreateDtoValidator = advertCreateDtoValidator;
            _advertUpdateDtoValidator = advertUpdateDtoValidator;
            _currentUserService = currentUserService;
            _emailService = emailService;
        }



        public async Task<AdvertResponseDto> CreateAdvert(AdvertCreateDto dto)
        {
            var validationResult = await _advertCreateDtoValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            if(!_currentUserService.IsProfileCompleted)
            {
                throw new Exception("Please complete your profile");
            }
            if(_currentUserService.Role == "Musician")
            {
                throw new Exception("Musicians cannot create adverts");
            }

            var advert = _mapper.Map<Advert>(dto);
            advert.CreatorId = _currentUserService.UserId;
            advert.Status = AdvertStatus.Open;


            await _advertRepository.AddAsync(advert);
            await _unitOfWork.SaveChanges();

            await NotifyMatchingMusicians(advert);

            return await BuildResponse(advert);

        }

        // İletişim izni veren ve ilanın şehrinde olan müzisyenlere yeni ilan
        // bildirimi + e-postası gönderir. E-posta gönderimi tek tek Zoho API
        // çağrısı gerektirdiği için kullanıcı sayısı arttıkça bu akış bir kuyruğa
        // taşınmalı — şu ölçekte (birkaç düzine kullanıcı) senkron döngü yeterli.
        private async Task NotifyMatchingMusicians(Advert advert)
        {
            var matchingProfiles = await _musicianProfileRepository.WhereAsync(m => m.City == advert.City);
            if (!matchingProfiles.Any()) return;

            var musicianUserIds = matchingProfiles.Select(m => m.AppUserId).ToList();
            var eligibleUsers = await _userRepository.WhereAsync(
                u => musicianUserIds.Contains(u.Id) && u.AllowCityAdvertAlerts);

            foreach (var user in eligibleUsers)
            {
                await _notificationRepository.AddAsync(new Notification
                {
                    UserId = user.Id,
                    Type = "advert",
                    Title = "Şehrinde yeni bir ilan var",
                    Body = $"\"{advert.Title}\" ilanı {advert.City} için yayınlandı.",
                    LinkTo = $"/jobs/{advert.Id}",
                });

                await _emailService.SendAsync(
                    user.Email,
                    "Şehrinde yeni bir ilan var — Sahnem",
                    $"<p>Merhaba {user.FirstName},</p>" +
                    $"<p><strong>{advert.City}</strong> için yeni bir ilan yayınlandı: <strong>{advert.Title}</strong></p>" +
                    $"<p><a href=\"https://sahnem.com.tr/jobs/{advert.Id}\">İlanı görüntüle</a></p>" +
                    "<p style=\"color:#888;font-size:12px\">Bu bildirimleri profil ayarlarından kapatabilirsin.</p>");
            }

            await _unitOfWork.SaveChanges();
        }

        public async Task CancelAdvert(int advertId, bool asAdmin = false)
        {
            var advert = await _advertRepository.GetByIdAsync(advertId);
            if(advert == null)
            {
                throw new Exception("Advert not found");
            }
            // asAdmin sadece AdminController'dan (SystemAdmin policy'siyle korunan)
            // true geçiriliyor — admin artık ayrı bir kimlik doğrulama şeması
            // kullandığı için burada ICurrentUserService üzerinden tekrar rol
            // kontrolü yapmak mümkün değil.
            if(advert.CreatorId != _currentUserService.UserId && !asAdmin)
            {
                throw new Exception("You are not authorized to cancel this advert");
            }

            if(advert.Status == AdvertStatus.Completed)
            {
                throw new Exception("Completed adverts cannot be cancelled");
            }
            if(advert.Status == AdvertStatus.Cancelled)
            {
                throw new Exception("Advert already cancelled");
            }
            if(advert.Status == AdvertStatus.Closed)
            {
                throw new Exception("Advert already closed");
            }

            advert.Status = AdvertStatus.Cancelled;
            await _unitOfWork.SaveChanges();
        }



        public async Task<AdvertResponseDto> GetAdvertById(int advertId, bool asAdmin = false)
        {
            var advert = await _advertRepository.GetByIdAsync(advertId);
            if(advert == null || (advert.Status == AdvertStatus.Cancelled && !asAdmin))
            {
                throw new Exception("Advert not found");
            }

            return await BuildResponse(advert);

        }

        public async Task<PagedResultDto<AdvertResponseDto>> GetAllAdvert(AdvertFilterDto? filter = null, bool includeCancelled = false)
        {
            var adverts = await _advertRepository.GetAllAsync();

            var query = includeCancelled
                ? adverts.AsEnumerable()
                : adverts.Where(a => a.Status != AdvertStatus.Cancelled);

            if (filter != null)
            {
                if (!string.IsNullOrWhiteSpace(filter.Search))
                {
                    var search = filter.Search.Trim().ToLowerInvariant();
                    query = query.Where(a =>
                        a.Title.ToLowerInvariant().Contains(search) ||
                        a.Description.ToLowerInvariant().Contains(search));
                }
                if (filter.City.HasValue)
                {
                    query = query.Where(a => a.City == filter.City.Value);
                }
                if (filter.Branch.HasValue)
                {
                    query = query.Where(a => a.TargetBranch == filter.Branch.Value);
                }
                if (filter.Status.HasValue)
                {
                    query = query.Where(a => a.Status == filter.Status.Value);
                }
                if (filter.MinBudget.HasValue)
                {
                    query = query.Where(a => a.Budget >= filter.MinBudget.Value);
                }
                if (filter.CreatorId.HasValue)
                {
                    query = query.Where(a => a.CreatorId == filter.CreatorId.Value);
                }
            }

            var page = filter?.Page is > 0 ? filter.Page : 1;
            var pageSize = filter?.PageSize is > 0 and <= 100 ? filter.PageSize : 20;

            var filtered = query.OrderByDescending(a => a.CreatedDate).ToList();
            var paged = filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PagedResultDto<AdvertResponseDto>
            {
                Items = paged.Count == 0 ? Enumerable.Empty<AdvertResponseDto>() : await BuildResponses(paged),
                Page = page,
                PageSize = pageSize,
                TotalCount = filtered.Count,
            };
        }

        public async Task UpdateAdvert(int advertId, AdvertUpdateDto dto)
        {
            var validationResult = await _advertUpdateDtoValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
            var advert = await _advertRepository.GetByIdAsync(advertId);
            if(advert == null || advert.Status == AdvertStatus.Cancelled)
            {
                throw new Exception("Advert not found");
            }
            if(advert.CreatorId != _currentUserService.UserId)
            {
                throw new Exception("You are not authorized to update this advert");
            }

            _mapper.Map(dto, advert);
            await _unitOfWork.SaveChanges();
        }

        public async Task<IEnumerable<AdvertResponseDto>> GetMyAdverts()
        {
            var creatorId = _currentUserService.UserId;
            var adverts = await _advertRepository.WhereAsync(a=> a.CreatorId == creatorId && a.Status != AdvertStatus.Cancelled);
            if (!adverts.Any())
            {
                return Enumerable.Empty<AdvertResponseDto>();
            }
            return await BuildResponses(adverts);

        }

        private async Task<AdvertResponseDto> BuildResponse(Advert advert)
        {
            var results = await BuildResponses(new[] { advert });
            return results.First();
        }

        // Advert entity'si organizatör/mekan adını ya da teklif sayısını doğrudan
        // tutmuyor (Offers navigation'ı generic repository ile lazy-load edilmiyor).
        // Bu yüzden hem tekil hem listeleme uçlarında aynı toplu (N+1 olmayan)
        // zenginleştirme mantığı kullanılıyor.
        private async Task<IEnumerable<AdvertResponseDto>> BuildResponses(IEnumerable<Advert> adverts)
        {
            var advertList = adverts.ToList();
            var dtos = _mapper.Map<List<AdvertResponseDto>>(advertList);

            var creatorIds = dtos.Select(d => d.CreatorId).Distinct().ToList();
            var advertIds = dtos.Select(d => d.Id).Distinct().ToList();

            var creators = await _userRepository.WhereAsync(u => creatorIds.Contains(u.Id));
            var organizers = await _organizerProfileRepository.WhereAsync(o => creatorIds.Contains(o.AppUserId));
            var venues = await _venueProfileRepository.WhereAsync(v => creatorIds.Contains(v.AppUserId));
            var offers = await _offerRepository.WhereAsync(o => advertIds.Contains(o.AdvertId));
            var offerCounts = offers.GroupBy(o => o.AdvertId).ToDictionary(g => g.Key, g => g.Count());

            foreach (var dto in dtos)
            {
                var creator = creators.FirstOrDefault(u => u.Id == dto.CreatorId);
                dto.CreatorRole = creator?.Role.ToString();
                dto.CreatorName = creator?.Role switch
                {
                    UserType.Organizer => organizers.FirstOrDefault(o => o.AppUserId == dto.CreatorId)?.OrganizerName,
                    UserType.Venue => venues.FirstOrDefault(v => v.AppUserId == dto.CreatorId)?.VenueName,
                    _ => null,
                };
                dto.OfferCount = offerCounts.TryGetValue(dto.Id, out var count) ? count : 0;
            }

            return dtos;
        }
    }
}
