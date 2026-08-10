using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs.Advert;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdvertController : ControllerBase
    {
        private readonly IAdvertService _advertService;

        public AdvertController(IAdvertService advertService)
        {
            _advertService = advertService;
        }
        

        [HttpGet("getall")]
        public async Task<IActionResult> GetAllAdverts()
        {
            var result = await _advertService.GetAllAdvert();
            return Ok(result);
        }

        [HttpGet("getbyid")]
        public async Task<IActionResult> GetAdvertById([FromQuery] int advertId)
        {
            var result = await _advertService.GetAdvertById(advertId);
            return Ok(result);
        }

        [HttpGet("getmyadverts")]
        public async Task<IActionResult> GetMyAdverts()
        {
            var result = await _advertService.GetMyAdverts();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAdvert([FromBody] AdvertCreateDto advertCreateDto)
        {
            var result = await _advertService.CreateAdvert(advertCreateDto);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAdvert([FromQuery] int advertId,[FromBody] AdvertUpdateDto advertUpdateDto)
        {
            await _advertService.UpdateAdvert(advertId,advertUpdateDto);
            return Ok();
        }

        [HttpPut("cancel")]
        public async Task<IActionResult> CancelAdvert([FromQuery] int advertId)
        {
            await _advertService.CancelAdvert(advertId);
            return Ok();
        }




    }
}