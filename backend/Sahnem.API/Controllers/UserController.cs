using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [Authorize]
        [HttpGet("getall")]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _userService.GetAllUsers(page, pageSize);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetUserById(id);
            return Ok(user);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUserMe()
        {
            var me = await _userService.GetMe();
            return Ok(me);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] AppUserRegisterDto userRegisterDto)
        {
            var result = await _userService.RegisterUser(userRegisterDto);
            return Ok(result);
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody]AppUserLoginDto appUserLoginDto)
        {
            var result = await _userService.LoginUser(appUserLoginDto);
            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto)
        {
            var result = await _userService.RefreshToken(dto.RefreshToken);
            return Ok(result);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto dto)
        {
            await _userService.Logout(dto.RefreshToken);
            return Ok();
        }

        [Authorize]
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequestDto dto)
        {
            await _userService.VerifyEmail(dto.Code);
            return Ok();
        }

        [Authorize]
        [HttpPost("resend-verification-email")]
        public async Task<IActionResult> ResendVerificationEmail()
        {
            await _userService.ResendVerificationEmail();
            return Ok();
        }


        [Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser()
        {

            await _userService.DeleteUser();
            return Ok();
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser(AppUserUpdateDto dto)
        {
            await _userService.UpdateUser(dto);
            return Ok();
        }
    }
}
