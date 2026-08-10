using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;

namespace Sahnem.Business.Interfaces
{
    public interface IProfileService
    {
        Task<AuthResponseDto> CreateMusicianProfile( MusicianProfileCreateDto dto);
        Task<AuthResponseDto> CreateVenueProfile( VenueProfileCreateDto dto);
        Task<AuthResponseDto> CreateOrganizerProfile( OrganizerProfileCreateDto dto);
        Task<Object> GetMyProfile();
        
    }
}