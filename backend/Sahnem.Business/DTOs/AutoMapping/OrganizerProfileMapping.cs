using AutoMapper;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Business.Helpers;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;

namespace Sahnem.Business.AutoMapping
{
    public class OrganizerProfileMapping : Profile
    {
        public OrganizerProfileMapping()
        {
            CreateMap<OrganizerProfileCreateDto, OrganizerProfile>()
                .ForMember(dest => dest.AdditionalCities, opt => opt.MapFrom(src => MultiEnumField.Join(src.AdditionalCities)));

            CreateMap<OrganizerProfile, OrganizerProfileResponseDto>()
                .ForMember(dest => dest.AdditionalCities, opt => opt.MapFrom(src => MultiEnumField.Parse<City>(src.AdditionalCities)));

        }
    }
}
