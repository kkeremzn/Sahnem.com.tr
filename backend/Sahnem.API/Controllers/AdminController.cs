using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sahnem.Business.DTOs.Admin;
using Sahnem.Business.DTOs.Advert;
using Sahnem.Business.Interfaces;
using Sahnem.Core.Enums;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "SystemAdmin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IUserService _userService;
        private readonly IAdvertService _advertService;
        private readonly IOfferService _offerService;

        public AdminController(IAdminService adminService, IUserService userService, IAdvertService advertService, IOfferService offerService)
        {
            _adminService = adminService;
            _userService = userService;
            _advertService = advertService;
            _offerService = offerService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _adminService.GetStats();
            return Ok(result);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null,
            [FromQuery] UserType? role = null, [FromQuery] bool? isActive = null, [FromQuery] bool? isEmailConfirmed = null)
        {
            var result = await _userService.GetAllUsers(page, pageSize, search, role, isActive, isEmailConfirmed);
            return Ok(result);
        }

        [HttpGet("users/{id:int}")]
        public async Task<IActionResult> GetUserDetail(int id)
        {
            var result = await _adminService.GetUserDetail(id);
            return Ok(result);
        }

        [HttpPut("users/{id:int}/suspend")]
        public async Task<IActionResult> SuspendUser(int id, [FromQuery] string? reason = null)
        {
            await _userService.SuspendUser(id, reason);
            return Ok();
        }

        [HttpPut("users/{id:int}/reactivate")]
        public async Task<IActionResult> ReactivateUser(int id)
        {
            await _userService.ReactivateUser(id);
            return Ok();
        }

        [HttpDelete("users/{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.AdminDeleteUser(id);
            return Ok();
        }

        [HttpGet("adverts")]
        public async Task<IActionResult> GetAllAdverts([FromQuery] AdvertFilterDto filter)
        {
            var result = await _advertService.GetAllAdvert(filter, includeCancelled: true);
            return Ok(result);
        }

        [HttpGet("adverts/{id:int}")]
        public async Task<IActionResult> GetAdvertDetail(int id)
        {
            var result = await _advertService.GetAdvertById(id, asAdmin: true);
            return Ok(result);
        }

        [HttpGet("adverts/{id:int}/offers")]
        public async Task<IActionResult> GetAdvertOffers(int id)
        {
            var result = await _offerService.GetOffersByAdvert(id, asAdmin: true);
            return Ok(result);
        }

        [HttpPut("adverts/{id:int}/cancel")]
        public async Task<IActionResult> CancelAdvert(int id)
        {
            await _advertService.CancelAdvert(id, asAdmin: true);
            return Ok();
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
        {
            var result = await _adminService.GetConversations(page, pageSize, search);
            return Ok(result);
        }

        [HttpGet("conversations/{id:int}/messages")]
        public async Task<IActionResult> GetConversationMessages(int id)
        {
            var result = await _adminService.GetConversationMessages(id);
            return Ok(result);
        }

        [HttpDelete("messages/{id:int}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            await _adminService.DeleteMessage(id);
            return Ok();
        }

        [HttpPost("notifications/broadcast")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> BroadcastNotification([FromBody] AdminBroadcastNotificationDto dto)
        {
            var result = await _adminService.BroadcastNotification(dto);
            return Ok(result);
        }

        [HttpPost("emails/send")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> SendBulkEmail([FromBody] AdminSendEmailDto dto)
        {
            var result = await _adminService.SendBulkEmail(dto);
            return Ok(result);
        }

        [HttpPost("users/{id:int}/send-verification-code")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> SendVerificationCodeToUser(int id)
        {
            await _adminService.SendVerificationCodeToUser(id);
            return Ok();
        }

        [HttpPost("users/{id:int}/send-reset-code")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> SendPasswordResetCodeToUser(int id)
        {
            await _adminService.SendPasswordResetCodeToUser(id);
            return Ok();
        }

        [HttpPut("users/{id:int}/reset-password")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> ResetUserPassword(int id, [FromBody] AdminResetPasswordDto dto)
        {
            await _adminService.ResetUserPasswordDirectly(id, dto.NewPassword);
            return Ok();
        }
    }
}
