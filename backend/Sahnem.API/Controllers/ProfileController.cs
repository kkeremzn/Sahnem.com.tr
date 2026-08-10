using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
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

        [HttpGet("musician/{id:int}")]
        public async Task<IActionResult> GetMusicianById(int id)
        {
            var result = await _profileService.GetMusicianById(id);
            return Ok(result);
        }

        [HttpGet("musicians")]
        public async Task<IActionResult> GetMusicians([FromQuery] MusicianFilterDto filter)
        {
            var result = await _profileService.GetMusicians(filter);
            return Ok(result);
        }

        [HttpGet("employer/{userId:int}")]
        public async Task<IActionResult> GetEmployerByUserId(int userId)
        {
            var result = await _profileService.GetEmployerByUserId(userId);
            return Ok(result);
        }

        [Authorize(Roles = "Musician")]
        [HttpPut("musician")]
        public async Task<IActionResult> UpdateMusicianProfile([FromBody] MusicianProfileCreateDto dto)
        {
            var result = await _profileService.UpdateMusicianProfile(dto);
            return Ok(result);
        }

        [Authorize(Roles = "Organizer")]
        [HttpPut("organizer")]
        public async Task<IActionResult> UpdateOrganizerProfile([FromBody] OrganizerProfileCreateDto dto)
        {
            var result = await _profileService.UpdateOrganizerProfile(dto);
            return Ok(result);
        }

        [Authorize(Roles = "Venue")]
        [HttpPut("venue")]
        public async Task<IActionResult> UpdateVenueProfile([FromBody] VenueProfileCreateDto dto)
        {
            var result = await _profileService.UpdateVenueProfile(dto);
            return Ok(result);
        }

    }
}