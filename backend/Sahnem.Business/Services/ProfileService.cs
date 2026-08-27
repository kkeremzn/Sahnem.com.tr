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
        private readonly ITokenService _tokenService;



        public ProfileService(IGenericRepository<MusicianProfile> musicianProfileRepository, IGenericRepository<OrganizerProfile> organizerProfileRepository, IGenericRepository<VenueProfile> venueProfileRepository, IGenericRepository<AppUser> userRepository, IUnitOfWork unitOfWork, IMapper mapper, IValidator<MusicianProfileCreateDto> validatorMusicianProfileCreate,IValidator<OrganizerProfileCreateDto> validatorOrganizerProfileCreate,
        IValidator<VenueProfileCreateDto> validatorVenueCreateProfile, ICurrentUserService currentUserService,
        ITokenService tokenService)
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
            _tokenService = tokenService;

        }

        public async Task<TokenPairDto> CreateMusicianProfile(MusicianProfileCreateDto dto)
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
            return await _tokenService.IssueTokensAsync(user);




        }

        public async Task<TokenPairDto>  CreateOrganizerProfile(OrganizerProfileCreateDto dto)
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
            return await _tokenService.IssueTokensAsync(user);
        
        }

        public async Task<TokenPairDto>  CreateVenueProfile(VenueProfileCreateDto dto)
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
            return await _tokenService.IssueTokensAsync(user);
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

                    return await BuildMusicianResponse(musician);
                case UserType.Organizer:

                    var organizer = await _organizerProfileRepository.FirstOrDefaultAsync(x=> x.AppUserId == user.Id);

                    if(organizer == null)
                    {
                        throw new Exception("Organizer profile not found");
                    }

                    var organizerDto = _mapper.Map<OrganizerProfileResponseDto>(organizer);
                    organizerDto.AvatarUrl = user.AvatarUrl;
                    return organizerDto;
                case UserType.Venue:

                    var venue = await _venueProfileRepository.FirstOrDefaultAsync(x=> x.AppUserId == user.Id);

                    if(venue == null)
                    {
                        throw new Exception("Venue profile not found");
                    }

                    var venueDto = _mapper.Map<VenueProfileResponseDto>(venue);
                    venueDto.AvatarUrl = user.AvatarUrl;
                    return venueDto;
                default:
                    throw new Exception("Invalid user role");
            }
        }

        public async Task<MusicianProfileResponseDto> GetMusicianById(int id)
        {
            var musician = await _musicianProfileRepository.GetByIdAsync(id);
            if (musician == null)
            {
                throw new Exception("Musician profile not found");
            }

            return await BuildMusicianResponse(musician);
        }

        // Offer/Favorite gibi AppUserId taşıyan kayıtlardan müzisyenin herkese açık
        // profiline yönlendirmek için — GetMusicianById MusicianProfile.Id bekliyor,
        // bu ise AppUserId ile arıyor (bkz. GetEmployerByUserId'nin organizer/venue eşdeğeri).
        public async Task<MusicianProfileResponseDto> GetMusicianByUserId(int userId)
        {
            var musician = await _musicianProfileRepository.FirstOrDefaultAsync(m => m.AppUserId == userId);
            if (musician == null)
            {
                throw new Exception("Musician profile not found");
            }

            return await BuildMusicianResponse(musician);
        }

        public async Task<PagedResultDto<MusicianProfileResponseDto>> GetMusicians(MusicianFilterDto? filter = null)
        {
            var musicians = (await _musicianProfileRepository.GetAllAsync()).AsEnumerable();

            if (filter != null)
            {
                if (!string.IsNullOrWhiteSpace(filter.Search))
                {
                    var search = filter.Search.Trim().ToLowerInvariant();
                    musicians = musicians.Where(m =>
                        m.Genres.ToLowerInvariant().Contains(search) ||
                        m.Bio.ToLowerInvariant().Contains(search));
                }
                if (filter.Branch.HasValue)
                {
                    musicians = musicians.Where(m => m.Branch == filter.Branch.Value.ToString());
                }
                if (filter.City.HasValue)
                {
                    musicians = musicians.Where(m => m.City == filter.City.Value);
                }
                if (filter.TravelOnly == true)
                {
                    musicians = musicians.Where(m => m.IsAvailableToTravel == IsAvailableToTravel.Yes);
                }
            }

            var page = filter?.Page is > 0 ? filter.Page : 1;
            var pageSize = filter?.PageSize is > 0 and <= 100 ? filter.PageSize : 20;

            var list = musicians.ToList();
            var paged = list.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var userIds = paged.Select(m => m.AppUserId).Distinct().ToList();
            var users = await _userRepository.WhereAsync(u => userIds.Contains(u.Id));

            var dtos = _mapper.Map<List<MusicianProfileResponseDto>>(paged);
            foreach (var dto in dtos)
            {
                var user = users.FirstOrDefault(u => u.Id == dto.AppUserId);
                dto.FirstName = user?.FirstName;
                dto.LastName = user?.LastName;
                dto.AvatarUrl = user?.AvatarUrl;
            }

            return new PagedResultDto<MusicianProfileResponseDto>
            {
                Items = dtos,
                Page = page,
                PageSize = pageSize,
                TotalCount = list.Count,
            };
        }

        public async Task<object> GetEmployerByUserId(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            var organizer = await _organizerProfileRepository.FirstOrDefaultAsync(o => o.AppUserId == userId);
            if (organizer != null)
            {
                var organizerDto = _mapper.Map<OrganizerProfileResponseDto>(organizer);
                organizerDto.AvatarUrl = user?.AvatarUrl;
                return new { kind = "Organizer", profile = organizerDto };
            }

            var venue = await _venueProfileRepository.FirstOrDefaultAsync(v => v.AppUserId == userId);
            if (venue != null)
            {
                var venueDto = _mapper.Map<VenueProfileResponseDto>(venue);
                venueDto.AvatarUrl = user?.AvatarUrl;
                return new { kind = "Venue", profile = venueDto };
            }

            throw new Exception("Employer profile not found");
        }

        public async Task<MusicianProfileResponseDto> UpdateMusicianProfile(MusicianProfileCreateDto dto)
        {
            var validationResult = await _validatorMusicianProfileCreate.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var userId = _cureentUserService.UserId;
            var musician = await _musicianProfileRepository.FirstOrDefaultAsync(x => x.AppUserId == userId);
            if (musician == null)
            {
                throw new Exception("Musician profile not found");
            }

            _mapper.Map(dto, musician);
            await _unitOfWork.SaveChanges();
            return await BuildMusicianResponse(musician);
        }

        public async Task<OrganizerProfileResponseDto> UpdateOrganizerProfile(OrganizerProfileCreateDto dto)
        {
            var validationResult = await _validatorOrganizerProfileCreate.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var userId = _cureentUserService.UserId;
            var organizer = await _organizerProfileRepository.FirstOrDefaultAsync(x => x.AppUserId == userId);
            if (organizer == null)
            {
                throw new Exception("Organizer profile not found");
            }

            _mapper.Map(dto, organizer);
            await _unitOfWork.SaveChanges();
            var organizerDto = _mapper.Map<OrganizerProfileResponseDto>(organizer);
            organizerDto.AvatarUrl = (await _userRepository.GetByIdAsync(userId))?.AvatarUrl;
            return organizerDto;
        }

        public async Task<VenueProfileResponseDto> UpdateVenueProfile(VenueProfileCreateDto dto)
        {
            var validationResult = await _validatorVenueCreateProfile.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var userId = _cureentUserService.UserId;
            var venue = await _venueProfileRepository.FirstOrDefaultAsync(x => x.AppUserId == userId);
            if (venue == null)
            {
                throw new Exception("Venue profile not found");
            }

            _mapper.Map(dto, venue);
            await _unitOfWork.SaveChanges();
            var venueDto = _mapper.Map<VenueProfileResponseDto>(venue);
            venueDto.AvatarUrl = (await _userRepository.GetByIdAsync(userId))?.AvatarUrl;
            return venueDto;
        }

        private async Task<MusicianProfileResponseDto> BuildMusicianResponse(MusicianProfile musician)
        {
            var dto = _mapper.Map<MusicianProfileResponseDto>(musician);
            var user = await _userRepository.GetByIdAsync(musician.AppUserId);
            dto.FirstName = user?.FirstName;
            dto.LastName = user?.LastName;
            dto.AvatarUrl = user?.AvatarUrl;
            return dto;
        }
    }
}