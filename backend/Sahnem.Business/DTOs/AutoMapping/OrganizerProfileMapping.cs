using AutoMapper;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Core.Entities;

namespace Sahnem.Business.AutoMapping
{
    public class OrganizerProfileMapping : Profile
    {
        public OrganizerProfileMapping()
        {
            CreateMap<OrganizerProfileCreateDto, OrganizerProfile>();
            CreateMap<OrganizerProfile, OrganizerProfileResponseDto>();
            
        }
    }
}