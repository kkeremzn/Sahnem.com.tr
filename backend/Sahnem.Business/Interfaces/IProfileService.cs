using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Business.Security;

namespace Sahnem.Business.Interfaces
{
    public interface IProfileService
    {
        Task<TokenPairDto> CreateMusicianProfile( MusicianProfileCreateDto dto);
        Task<TokenPairDto> CreateVenueProfile( VenueProfileCreateDto dto);
        Task<TokenPairDto> CreateOrganizerProfile( OrganizerProfileCreateDto dto);
        Task<Object> GetMyProfile();

        Task<MusicianProfileResponseDto> GetMusicianById(int id);
        Task<MusicianProfileResponseDto> GetMusicianByUserId(int userId);
        Task<PagedResultDto<MusicianProfileResponseDto>> GetMusicians(MusicianFilterDto? filter = null);
        Task<Object> GetEmployerByUserId(int userId);
        Task<PagedResultDto<EmployerSummaryDto>> GetEmployers(EmployerFilterDto? filter = null);

        Task<MusicianProfileResponseDto> UpdateMusicianProfile(MusicianProfileCreateDto dto);
        Task<OrganizerProfileResponseDto> UpdateOrganizerProfile(OrganizerProfileCreateDto dto);
        Task<VenueProfileResponseDto> UpdateVenueProfile(VenueProfileCreateDto dto);

    }
}