using AutoMapper;
using Sahnem.Business.DTOs.Advert;
using Sahnem.Core.Entities;

namespace Sahnem.Business.Dto.AutoMapping
{
    public class AdvertMapping : Profile
    {
        public AdvertMapping()
        {
            CreateMap<AdvertCreateDto, Advert>();
            CreateMap<Advert, AdvertResponseDto>();
            CreateMap<AdvertUpdateDto, Advert>();
        }
    }
}