using AutoMapper;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Business.Helpers;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;

namespace Sahnem.Business.AutoMapping
{
    public class MusicianProfileMapping : Profile
    {
        public MusicianProfileMapping()
        {
            // Branch/Genres/AdditionalCities entity'de hâlâ düz string sütunlar
            // (virgülle ayrılmış enum adları) — DTO tarafında liste olarak
            // görünmeleri için AutoMapper'a elle dönüşüm tanımlanıyor.
            CreateMap<MusicianProfileCreateDto, MusicianProfile>()
                .ForMember(dest => dest.Branch, opt => opt.MapFrom(src => MultiEnumField.Join(src.Branch)))
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => MultiEnumField.Join(src.Genres)))
                .ForMember(dest => dest.AdditionalCities, opt => opt.MapFrom(src => MultiEnumField.Join(src.AdditionalCities)));

            CreateMap<MusicianProfile, MusicianProfileResponseDto>()
                .ForMember(dest => dest.Branch, opt => opt.MapFrom(src => MultiEnumField.Parse<MusicBranch>(src.Branch)))
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => MultiEnumField.Parse<MusicGenre>(src.Genres)))
                .ForMember(dest => dest.AdditionalCities, opt => opt.MapFrom(src => MultiEnumField.Parse<City>(src.AdditionalCities)));

        }
    }
}
