using AutoMapper;
using FluentValidation;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Business.Validators;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IGenericRepository<MusicianProfile> _musicianProfileRepository;
        private readonly IGenericRepository<OrganizerProfile> _organizerProfileRepository;
        private readonly IGenericRepository<VenueProfile> _venueProfileRepository;
        private readonly IGenericRepository<AppUser> _userRepository;
        private readonly IValidator<MusicianProfileCreateDto> _validatorMusicianProfileCreate;
        private readonly IValidator<OrganizerProfileCreateDto> _validatorOrganizerProfileCreate;
        private readonly IValidator<VenueProfileCreateDto> _validatorVenueCreateProfile;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _cureentUserService;
        private readonly IJwtService _jwtService;
        


        public ProfileService(IGenericRepository<MusicianProfile> musicianProfileRepository, IGenericRepository<OrganizerProfile> organizerProfileRepository, IGenericRepository<VenueProfile> venueProfileRepository, IGenericRepository<AppUser> userRepository, IUnitOfWork unitOfWork, IMapper mapper, IValidator<MusicianProfileCreateDto> validatorMusicianProfileCreate,IValidator<OrganizerProfileCreateDto> validatorOrganizerProfileCreate,
        IValidator<VenueProfileCreateDto> validatorVenueCreateProfile, ICurrentUserService currentUserService,
        IJwtService jwtService)
        {
            _mapper = mapper;
            _musicianProfileRepository = musicianProfileRepository;
            _organizerProfileRepository = organizerProfileRepository;
            _venueProfileRepository = venueProfileRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _validatorMusicianProfileCreate = validatorMusicianProfileCreate;
            _validatorOrganizerProfileCreate = validatorOrganizerProfileCreate;
            _validatorVenueCreateProfile = validatorVenueCreateProfile;
            _cureentUserService = currentUserService;
            _jwtService = jwtService;

        }

        public async Task<AuthResponseDto> CreateMusicianProfile(MusicianProfileCreateDto dto)
        {
            var userId = _cureentUserService.UserId;

            var validationResult = await _validatorMusicianProfileCreate.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            if (user.IsProfileCompleted)
            {
                throw new Exception("Profile already exists");               
            }



            var musician = _mapper.Map<MusicianProfile>(dto);
            musician.AppUserId = userId;
            user.Role= UserType.Musician;
            user.IsProfileCompleted = true;
            await _musicianProfileRepository.AddAsync(musician);
            await _unitOfWork.SaveChanges();
            return _jwtService.GenerateToken(user);




        }

        public async Task<AuthResponseDto>  CreateOrganizerProfile(OrganizerProfileCreateDto dto)
        {

            var userId = _cureentUserService.UserId;
            var validationResult = await _validatorOrganizerProfileCreate.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }


            var user = await _userRepository.GetByIdAsync(userId);
            if(user == null)
            {
                throw new Exception("User not found");
            }
            if (user.IsProfileCompleted)
            {
                throw new Exception("Profile already exists");
            }

            var organizer = _mapper.Map<OrganizerProfile>(dto);
            organizer.AppUserId = user.Id;
            user.Role = UserType.Organizer;
            user.IsProfileCompleted = true;
            await _organizerProfileRepository.AddAsync(organizer);
            await _unitOfWork.SaveChanges();
            return _jwtService.GenerateToken(user);
        
        }

        public async Task<AuthResponseDto>  CreateVenueProfile(VenueProfileCreateDto dto)
        {
            var userId = _cureentUserService.UserId;
            var validationResult = await _validatorVenueCreateProfile.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if(user == null)
            {
                throw new Exception("User not found");
            }
            if (user.IsProfileCompleted)
            {
                throw new Exception("Profile already exists");
            }

            var venue = _mapper.Map<VenueProfile>(dto);
            venue.AppUserId = user.Id;
            user.Role = UserType.Venue;
            user.IsProfileCompleted = true;
            await _venueProfileRepository.AddAsync(venue);
            await _unitOfWork.SaveChanges();
            return _jwtService.GenerateToken(user);
        }

        public async Task<object> GetMyProfile()
        {
            var user = await _userRepository.GetByIdAsync(_cureentUserService.UserId);

            switch (user.Role)
            {
                case UserType.Musician:

                    var musician = await _musicianProfileRepository.FirstOrDefaultAsync(x=> x.AppUserId == user.Id);

                    if(musician == null)
                    {
                        throw new Exception("Musician profile not found");
                    }

                    return _mapper.Map<MusicianProfileResponseDto>(musician);
                case UserType.Organizer:
                    
                    var organizer = await _organizerProfileRepository.FirstOrDefaultAsync(x=> x.AppUserId == user.Id);

                    if(organizer == null)
                    {
                        throw new Exception("Organizer profile not found");
                    }

                    return _mapper.Map<OrganizerProfileResponseDto>(organizer);
                case UserType.Venue:
                    
                    var venue = await _venueProfileRepository.FirstOrDefaultAsync(x=> x.AppUserId == user.Id);

                    if(venue == null)
                    {
                        throw new Exception("Venue profile not found");
                    }

                    return _mapper.Map<VenueProfileResponseDto>(venue);
                default:
                    throw new Exception("Invalid user role");
            }
        }

        
    }
}