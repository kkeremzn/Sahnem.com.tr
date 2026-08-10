using AutoMapper;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Core.Entities;

namespace Sahnem.Business.AutoMapping
{
    public class MusicianProfileMapping : Profile
    {
        public MusicianProfileMapping()
        {
            CreateMap<MusicianProfileCreateDto, MusicianProfile>();
            CreateMap<MusicianProfile, MusicianProfileResponseDto>();
            
        }
    }
}