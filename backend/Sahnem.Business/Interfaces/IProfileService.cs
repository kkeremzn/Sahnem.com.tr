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

        Task<MusicianProfileResponseDto> GetMusicianById(int id);
        Task<IEnumerable<MusicianProfileResponseDto>> GetMusicians(MusicianFilterDto? filter = null);
        Task<Object> GetEmployerByUserId(int userId);

        Task<MusicianProfileResponseDto> UpdateMusicianProfile(MusicianProfileCreateDto dto);
        Task<OrganizerProfileResponseDto> UpdateOrganizerProfile(OrganizerProfileCreateDto dto);
        Task<VenueProfileResponseDto> UpdateVenueProfile(VenueProfileCreateDto dto);

    }
}