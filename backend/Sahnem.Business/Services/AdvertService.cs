using AutoMapper;
using FluentValidation;
using Sahnem.Business.DTOs.Advert;
using Sahnem.Business.Enums;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class AdvertService : IAdvertService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Advert> _advertRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<AdvertCreateDto> _advertCreateDtoValidator;
        private readonly IValidator<AdvertUpdateDto> _advertUpdateDtoValidator;
        private readonly ICurrentUserService _currentUserService;


        public AdvertService(IUnitOfWork unitOfWork, IGenericRepository<Advert> advertRepository, IMapper mapper, IValidator<AdvertCreateDto> advertCreateDtoValidator, IValidator<AdvertUpdateDto> advertUpdateDtoValidator, ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _advertRepository = advertRepository;
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
            advert.Status = Enums.AdvertStatus.Open;
            

            await _advertRepository.AddAsync(advert);
            await _unitOfWork.SaveChanges();
            return _mapper.Map<AdvertResponseDto>(advert);
            ;

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

            return _mapper.Map<AdvertResponseDto>(advert);

        }

        public async Task<IEnumerable<AdvertResponseDto>> GetAllAdvert()
        {
            var adverts = await _advertRepository.GetAllAsync();
            if (!adverts.Any())
            {
                return Enumerable.Empty<AdvertResponseDto>();
            }
            var dtos = _mapper.Map<IEnumerable<AdvertResponseDto>>(adverts);
            return dtos;
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
            return _mapper.Map<IEnumerable<AdvertResponseDto>>(adverts);

        }
    }
}