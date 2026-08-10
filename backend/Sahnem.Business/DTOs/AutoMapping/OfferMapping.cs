using AutoMapper;
using Sahnem.Business.DTOs.Offer;
using Sahnem.Core.Entities;

namespace Sahnem.Business.Dto.AutoMapping
{
    public class OfferMapping : Profile
    {
        public OfferMapping()
        {
            CreateMap<OfferCreateDto, Offer>();
            CreateMap<Offer, OfferResponseDto>();
        }
    }
}
