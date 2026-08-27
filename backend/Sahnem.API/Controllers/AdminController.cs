using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs.Admin;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IUserService _userService;

        public AdminController(IAdminService adminService, IUserService userService)
        {
            _adminService = adminService;
            _userService = userService;
        }

        [HttpGet("verifications/pending")]
        public async Task<IActionResult> GetPendingVerifications()
        {
            var result = await _adminService.GetPendingVerifications();
            return Ok(result);
        }

        [HttpPut("verifications/{kind}/{profileId:int}")]
        public async Task<IActionResult> SetVerificationStatus(string kind, int profileId, [FromBody] VerificationDecisionDto dto)
        {
            await _adminService.SetVerificationStatus(kind, profileId, dto.Status);
            return Ok();
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _userService.GetAllUsers(page, pageSize);
            return Ok(result);
        }
    }
}
