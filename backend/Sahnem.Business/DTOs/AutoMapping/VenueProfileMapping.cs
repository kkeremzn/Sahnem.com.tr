using AutoMapper;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Core.Entities;

namespace Sahnem.Business.AutoMapping
{
    public class VenueProfileMapping : Profile
    {
        public VenueProfileMapping()
        {
            CreateMap<VenueProfileCreateDto, VenueProfile>();
            CreateMap<VenueProfile, VenueProfileResponseDto>();

            
        }
    }
}