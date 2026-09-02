using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.User;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ApiControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("{id:int}")]
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

        [EnableRateLimiting("auth")]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] AppUserRegisterDto userRegisterDto)
        {
            var tokens = await _userService.RegisterUser(userRegisterDto);
            SetRefreshTokenCookie(tokens);
            return Ok(new AuthResponseDto { AccessToken = tokens.AccessToken, ExpiresAt = tokens.ExpiresAt });
        }


        [EnableRateLimiting("auth")]
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] AppUserLoginDto appUserLoginDto)
        {
            var tokens = await _userService.LoginUser(appUserLoginDto);
            SetRefreshTokenCookie(tokens);
            return Ok(new AuthResponseDto { AccessToken = tokens.AccessToken, ExpiresAt = tokens.ExpiresAt });
        }

        // Refresh token body'den DEĞİL, sadece HttpOnly cookie'den okunuyor —
        // JS'in bu değere hiçbir şekilde erişimi/kontrolü yok.
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = ReadRefreshTokenCookie();
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "No refresh token", errors = (object?)null });
            }

            var tokens = await _userService.RefreshToken(refreshToken);
            SetRefreshTokenCookie(tokens);
            return Ok(new AuthResponseDto { AccessToken = tokens.AccessToken, ExpiresAt = tokens.ExpiresAt });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = ReadRefreshTokenCookie();
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _userService.Logout(refreshToken);
            }
            ClearRefreshTokenCookie();
            return Ok();
        }

        // 6 haneli kodu deneme-yanılma ile bulmaya çalışmayı (1 milyon ihtimal)
        // pratik olarak imkansız hale getirmek için rate limit — daha önce burada hiç yoktu.
        [Authorize]
        [EnableRateLimiting("auth")]
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequestDto dto)
        {
            await _userService.VerifyEmail(dto.Code);
            return Ok();
        }

        [Authorize]
        [EnableRateLimiting("auth")]
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

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            await _userService.ChangePassword(dto);
            return Ok();
        }
    }
}
