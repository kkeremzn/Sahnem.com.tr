using AutoMapper;
using FluentValidation;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Business.Validators;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<AppUser> _repository;
        private readonly IValidator<AppUserRegisterDto> _appUserRegisterValidator;
        private readonly IValidator<AppUserLoginDto> _appUserLoginValidator;
        private readonly IValidator<AppUserUpdateDto> _appUserUpdateValidator;
        private readonly IPasswordService _passwordService;
        private readonly IJwtService _jwtService;
        private readonly ICurrentUserService _currentUserService;
        
        
        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IGenericRepository<AppUser> repository, IValidator<AppUserRegisterDto> appUserRegiserValidator, IValidator<AppUserLoginDto> appUserLoginValidator, IValidator<AppUserUpdateDto> appUserUpdateValidator, IPasswordService passwordService, IJwtService jwtService, ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repository = repository;
            _appUserRegisterValidator = appUserRegiserValidator;
            _appUserLoginValidator = appUserLoginValidator;
            _appUserUpdateValidator = appUserUpdateValidator;
            _passwordService = passwordService;
            _jwtService = jwtService;
            _currentUserService = currentUserService;
        }

        

        public async Task<IEnumerable<AppUserResponseDto>> GetAllUsers()
        {
            var users = await _repository.GetAllAsync();
            if(!users.Any())
            {
                return Enumerable.Empty<AppUserResponseDto>();
            }
            var dtos = _mapper.Map<IEnumerable<AppUserResponseDto>>(users);
            return dtos;
        }

        public async Task<AppUserResponseDto> GetUserById(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if(user == null)
            {
                throw new Exception("User Not Found");   
            }
            var dto = _mapper.Map<AppUserResponseDto>(user);
            return dto;
            

        }

        public async Task<AppUserResponseDto> RegisterUser(AppUserRegisterDto userRegisterDto)
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
            
            await _repository.AddAsync(user);
            await _unitOfWork.SaveChanges();
            var response = _mapper.Map<AppUserResponseDto>(user);
            return response;
        }

        

        public async Task DeleteUser()
        {
            var userId = _currentUserService.UserId;
            var user = await _repository.GetByIdAsync(userId);
            if(user == null)
            {
                throw new Exception("User Not Found");

            }
            _repository.Delete(user);
            await _unitOfWork.SaveChanges();
        }

        public async Task<AuthResponseDto> LoginUser(AppUserLoginDto userLoginDto)
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
            
            
            
            return _jwtService.GenerateToken(user);

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