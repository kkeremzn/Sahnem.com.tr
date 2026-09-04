using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ApiControllerBase
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
            var tokens = await _profileService.CreateMusicianProfile(dto);
            SetRefreshTokenCookie(tokens);
            return Ok(new AuthResponseDto { AccessToken = tokens.AccessToken, ExpiresAt = tokens.ExpiresAt });
        }

        [Authorize]
        [HttpPost("venue")]
        public async Task<IActionResult> CreateVenueProfile([FromBody] VenueProfileCreateDto dto)
        {
            var tokens = await _profileService.CreateVenueProfile(dto);
            SetRefreshTokenCookie(tokens);
            return Ok(new AuthResponseDto { AccessToken = tokens.AccessToken, ExpiresAt = tokens.ExpiresAt });
        }

        [Authorize]
        [HttpPost("organizer")]
        public async Task<IActionResult> CreateOrganizerProfile([FromBody] OrganizerProfileCreateDto dto)
        {
            var tokens = await _profileService.CreateOrganizerProfile(dto);
            SetRefreshTokenCookie(tokens);
            return Ok(new AuthResponseDto { AccessToken = tokens.AccessToken, ExpiresAt = tokens.ExpiresAt });
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

        [HttpGet("musician/by-user/{userId:int}")]
        public async Task<IActionResult> GetMusicianByUserId(int userId)
        {
            var result = await _profileService.GetMusicianByUserId(userId);
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

        [HttpGet("employers")]
        public async Task<IActionResult> GetEmployers([FromQuery] EmployerFilterDto filter)
        {
            var result = await _profileService.GetEmployers(filter);
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