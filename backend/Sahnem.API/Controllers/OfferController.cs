using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs.Offer;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OfferController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OfferController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        [Authorize(Roles = "Musician")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateOffer([FromBody] OfferCreateDto dto)
        {
            var result = await _offerService.CreateOffer(dto);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("getbyid")]
        public async Task<IActionResult> GetOfferById([FromQuery] int offerId)
        {
            var result = await _offerService.GetOfferById(offerId);
            return Ok(result);
        }

        [Authorize(Roles = "Musician")]
        [HttpGet("getmyoffers")]
        public async Task<IActionResult> GetMyOffers()
        {
            var result = await _offerService.GetMyOffers();
            return Ok(result);
        }

        [Authorize(Roles = "Organizer,Venue")]
        [HttpGet("getbyadvert")]
        public async Task<IActionResult> GetOffersByAdvert([FromQuery] int advertId)
        {
            var result = await _offerService.GetOffersByAdvert(advertId);
            return Ok(result);
        }

        [Authorize(Roles = "Organizer,Venue")]
        [HttpPut("updatestatus")]
        public async Task<IActionResult> UpdateOfferStatus([FromQuery] int offerId, [FromBody] OfferStatusUpdateDto dto)
        {
            await _offerService.UpdateOfferStatus(offerId, dto.Status);
            return Ok();
        }
    }
}
