using AutoMapper;
using FluentValidation;
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
        private readonly IMapper _mapper;
        private readonly IValidator<AdvertCreateDto> _advertCreateDtoValidator;
        private readonly IValidator<AdvertUpdateDto> _advertUpdateDtoValidator;
        private readonly ICurrentUserService _currentUserService;


        public AdvertService(
            IUnitOfWork unitOfWork,
            IGenericRepository<Advert> advertRepository,
            IGenericRepository<Offer> offerRepository,
            IGenericRepository<AppUser> userRepository,
            IGenericRepository<OrganizerProfile> organizerProfileRepository,
            IGenericRepository<VenueProfile> venueProfileRepository,
            IMapper mapper,
            IValidator<AdvertCreateDto> advertCreateDtoValidator,
            IValidator<AdvertUpdateDto> advertUpdateDtoValidator,
            ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _advertRepository = advertRepository;
            _offerRepository = offerRepository;
            _userRepository = userRepository;
            _organizerProfileRepository = organizerProfileRepository;
            _venueProfileRepository = venueProfileRepository;
            _mapper = mapper;
            _advertCreateDtoValidator = advertCreateDtoValidator;
            _advertUpdateDtoValidator = advertUpdateDtoValidator;
            _currentUserService = currentUserService;
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
            return await BuildResponse(advert);

        }

        public async Task CancelAdvert(int advertId)
        {
            var advert = await _advertRepository.GetByIdAsync(advertId);
            if(advert == null)
            {
                throw new Exception("Advert not found");
            }
            if(advert.CreatorId != _currentUserService.UserId)
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



        public async Task<AdvertResponseDto> GetAdvertById(int advertId)
        {
            var advert = await _advertRepository.GetByIdAsync(advertId);
            if(advert == null || advert.Status == AdvertStatus.Cancelled)
            {
                throw new Exception("Advert not found");
            }

            return await BuildResponse(advert);

        }

        public async Task<IEnumerable<AdvertResponseDto>> GetAllAdvert(AdvertFilterDto? filter = null)
        {
            var adverts = await _advertRepository.GetAllAsync();

            var query = adverts.Where(a => a.Status != AdvertStatus.Cancelled);

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
            }

            var filtered = query.OrderByDescending(a => a.CreatedDate).ToList();
            if (filtered.Count == 0)
            {
                return Enumerable.Empty<AdvertResponseDto>();
            }
            return await BuildResponses(filtered);
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
