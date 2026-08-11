using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Organizer,Venue")]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleFavorite([FromQuery] int musicianUserId)
        {
            var isFavorite = await _favoriteService.ToggleFavorite(musicianUserId);
            return Ok(new { isFavorite });
        }

        [HttpGet("mine")]
        public async Task<IActionResult> GetMyFavorites()
        {
            var result = await _favoriteService.GetMyFavorites();
            return Ok(result);
        }

        [HttpGet("mine/ids")]
        public async Task<IActionResult> GetMyFavoriteIds()
        {
            var result = await _favoriteService.GetMyFavoriteMusicianIds();
            return Ok(result);
        }
    }
}
