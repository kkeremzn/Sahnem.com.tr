using AutoMapper;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;
using Sahnem.Core.Entities;

namespace Sahnem.Business.AutoMapping
{
    public class AppUserProfileMapping : Profile
    {
        public AppUserProfileMapping()
        {
            CreateMap<AppUser, AppUserResponseDto>();
            CreateMap<AppUserRegisterDto, AppUser>();
            CreateMap<AppUserUpdateDto,AppUser>();
            CreateMap<AppUserLoginDto, AppUser>();

        }
    }
    
}