using AutoMapper;
using FluentValidation;
using Sahnem.Business.DTOs.Offer;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class OfferService : IOfferService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Offer> _offerRepository;
        private readonly IGenericRepository<Advert> _advertRepository;
        private readonly IGenericRepository<MusicianProfile> _musicianProfileRepository;
        private readonly IGenericRepository<AppUser> _userRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<OfferCreateDto> _offerCreateDtoValidator;
        private readonly ICurrentUserService _currentUserService;

        public OfferService(
            IUnitOfWork unitOfWork,
            IGenericRepository<Offer> offerRepository,
            IGenericRepository<Advert> advertRepository,
            IGenericRepository<MusicianProfile> musicianProfileRepository,
            IGenericRepository<AppUser> userRepository,
            IMapper mapper,
            IValidator<OfferCreateDto> offerCreateDtoValidator,
            ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _offerRepository = offerRepository;
            _advertRepository = advertRepository;
            _musicianProfileRepository = musicianProfileRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _offerCreateDtoValidator = offerCreateDtoValidator;
            _currentUserService = currentUserService;
        }

        public async Task<OfferResponseDto> CreateOffer(OfferCreateDto dto)
        {
            var validationResult = await _offerCreateDtoValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            if (!_currentUserService.IsProfileCompleted)
            {
                throw new Exception("Please complete your profile");
            }
            if (_currentUserService.Role != "Musician")
            {
                throw new Exception("Only musicians can send offers");
            }

            var advert = await _advertRepository.GetByIdAsync(dto.AdvertId);
            if (advert == null || advert.Status == AdvertStatus.Cancelled)
            {
                throw new Exception("Advert not found");
            }
            if (advert.Status != AdvertStatus.Open)
            {
                throw new Exception("This advert is not accepting offers anymore");
            }

            var musicianId = _currentUserService.UserId;

            var alreadyApplied = await _offerRepository.AnyAsync(
                o => o.AdvertId == dto.AdvertId && o.MusicianId == musicianId);
            if (alreadyApplied)
            {
                throw new Exception("You have already sent an offer for this advert");
            }

            var offer = _mapper.Map<Offer>(dto);
            offer.MusicianId = musicianId;
            offer.OfferStatus = OfferStatus.Pending;

            await _offerRepository.AddAsync(offer);
            await _unitOfWork.SaveChanges();

            return await BuildResponse(offer, advert);
        }

        public async Task<OfferResponseDto> GetOfferById(int offerId)
        {
            var offer = await _offerRepository.GetByIdAsync(offerId);
            if (offer == null)
            {
                throw new Exception("Offer not found");
            }

            var advert = await _advertRepository.GetByIdAsync(offer.AdvertId);
            var userId = _currentUserService.UserId;
            if (offer.MusicianId != userId && (advert == null || advert.CreatorId != userId))
            {
                throw new Exception("You are not authorized to view this offer");
            }

            return await BuildResponse(offer, advert);
        }

        public async Task<IEnumerable<OfferResponseDto>> GetMyOffers()
        {
            var musicianId = _currentUserService.UserId;
            var offers = await _offerRepository.WhereAsync(o => o.MusicianId == musicianId);
            return await BuildResponses(offers);
        }

        public async Task<IEnumerable<OfferResponseDto>> GetOffersByAdvert(int advertId)
        {
            var advert = await _advertRepository.GetByIdAsync(advertId);
            if (advert == null)
            {
                throw new Exception("Advert not found");
            }
            if (advert.CreatorId != _currentUserService.UserId)
            {
                throw new Exception("You are not authorized to view offers for this advert");
            }

            var offers = await _offerRepository.WhereAsync(o => o.AdvertId == advertId);
            return await BuildResponses(offers);
        }

        public async Task UpdateOfferStatus(int offerId, OfferStatus status)
        {
            if (status != OfferStatus.Accepted && status != OfferStatus.Rejected)
            {
                throw new Exception("Invalid status");
            }

            var offer = await _offerRepository.GetByIdAsync(offerId);
            if (offer == null)
            {
                throw new Exception("Offer not found");
            }

            var advert = await _advertRepository.GetByIdAsync(offer.AdvertId);
            if (advert == null)
            {
                throw new Exception("Advert not found");
            }
            if (advert.CreatorId != _currentUserService.UserId)
            {
                throw new Exception("You are not authorized to respond to this offer");
            }
            if (offer.OfferStatus != OfferStatus.Pending)
            {
                throw new Exception("This offer has already been responded to");
            }

            offer.OfferStatus = status;

            // Teklif kabul edildiğinde ilan otomatik olarak kapanır — frontend'in
            // mock katmanındaki aynı iş kuralı burada da uygulanıyor.
            if (status == OfferStatus.Accepted)
            {
                advert.Status = AdvertStatus.Closed;
            }

            await _unitOfWork.SaveChanges();
        }

        private async Task<OfferResponseDto> BuildResponse(Offer offer, Advert? advert)
        {
            var dto = _mapper.Map<OfferResponseDto>(offer);
            dto.AdvertTitle = advert?.Title;

            var musician = await _musicianProfileRepository.FirstOrDefaultAsync(m => m.AppUserId == offer.MusicianId);
            var musicianUser = await _userRepository.GetByIdAsync(offer.MusicianId);
            dto.MusicianName = musicianUser == null ? null : $"{musicianUser.FirstName} {musicianUser.LastName}";
            dto.MusicianBranch = musician == null ? null : Enum.TryParse<MusicBranch>(musician.Branch, out var branch) ? branch : null;

            return dto;
        }

        private async Task<IEnumerable<OfferResponseDto>> BuildResponses(IEnumerable<Offer> offers)
        {
            var offerList = offers.ToList();
            if (offerList.Count == 0)
            {
                return Enumerable.Empty<OfferResponseDto>();
            }

            var advertIds = offerList.Select(o => o.AdvertId).Distinct().ToList();
            var musicianIds = offerList.Select(o => o.MusicianId).Distinct().ToList();

            var adverts = await _advertRepository.WhereAsync(a => advertIds.Contains(a.Id));
            var musicians = await _musicianProfileRepository.WhereAsync(m => musicianIds.Contains(m.AppUserId));
            var musicianUsers = await _userRepository.WhereAsync(u => musicianIds.Contains(u.Id));

            var dtos = _mapper.Map<List<OfferResponseDto>>(offerList);
            foreach (var dto in dtos)
            {
                dto.AdvertTitle = adverts.FirstOrDefault(a => a.Id == dto.AdvertId)?.Title;
                var musician = musicians.FirstOrDefault(m => m.AppUserId == dto.MusicianId);
                dto.MusicianBranch = musician != null && Enum.TryParse<MusicBranch>(musician.Branch, out var branch)
                    ? branch
                    : null;
                var musicianUser = musicianUsers.FirstOrDefault(u => u.Id == dto.MusicianId);
                dto.MusicianName = musicianUser == null ? null : $"{musicianUser.FirstName} {musicianUser.LastName}";
            }

            return dtos;
        }
    }
}
