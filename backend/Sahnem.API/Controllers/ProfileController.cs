using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }
        [Authorize]
        [HttpPost("musician")]
        public async Task<IActionResult> CreateMusicianProfile([FromBody] MusicianProfileCreateDto dto)
        {
            var result = await _profileService.CreateMusicianProfile(dto);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("venue")]
        public async Task<IActionResult> CreateVenueProfile([FromBody] VenueProfileCreateDto dto)
        {
            var result = await _profileService.CreateVenueProfile(dto);
            return Ok(result);
            
        }

        [Authorize]
        [HttpPost("organizer")]
        public async Task<IActionResult> CreateOrganizerProfile([FromBody] OrganizerProfileCreateDto dto)
        {
            var result = await _profileService.CreateOrganizerProfile(dto);
            return Ok(result);
            
        }

        [Authorize]
        [HttpGet("getmyprofile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var result = await _profileService.GetMyProfile();
            return Ok(result);
        }


        
    }
}