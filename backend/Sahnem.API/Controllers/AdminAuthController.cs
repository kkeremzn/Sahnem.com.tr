using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sahnem.Business.DTOs.AdminAuth;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;

namespace Sahnem.API.Controllers
{
    // Normal /api/user auth'undan tamamen ayrı bir kimlik doğrulama akışı —
    // ayrı tablo, ayrı JWT şeması ("AdminScheme"), ayrı imzalama anahtarı.
    [ApiController]
    [Route("api/admin-auth")]
    public class AdminAuthController : ControllerBase
    {
        private const string RefreshCookieName = "sahnem_admin_refresh_token";

        private readonly IAdminAuthService _adminAuthService;

        public AdminAuthController(IAdminAuthService adminAuthService)
        {
            _adminAuthService = adminAuthService;
        }

        [EnableRateLimiting("auth")]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
        {
            var ip = Request.Headers["CF-Connecting-IP"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString();
            var tokens = await _adminAuthService.Login(dto, ip);
            SetAdminRefreshCookie(tokens.RefreshToken, tokens.RefreshTokenExpiresAt);
            return Ok(new { accessToken = tokens.AccessToken, expiresAt = tokens.ExpiresAt });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies[RefreshCookieName];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "No refresh token", errors = (object?)null });
            }

            var tokens = await _adminAuthService.RefreshToken(refreshToken);
            SetAdminRefreshCookie(tokens.RefreshToken, tokens.RefreshTokenExpiresAt);
            return Ok(new { accessToken = tokens.AccessToken, expiresAt = tokens.ExpiresAt });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies[RefreshCookieName];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _adminAuthService.Logout(refreshToken);
            }
            Response.Cookies.Delete(RefreshCookieName, new CookieOptions { Path = "/api/admin-auth" });
            return Ok();
        }

        [Authorize(Policy = "SystemAdmin")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            return Ok(await _adminAuthService.GetMe());
        }

        [EnableRateLimiting("auth")]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] AdminForgotPasswordDto dto)
        {
            await _adminAuthService.ForgotPassword(dto);
            return Ok();
        }

        [EnableRateLimiting("auth")]
        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] AdminVerifyResetCodeDto dto)
        {
            await _adminAuthService.VerifyResetCode(dto);
            return Ok();
        }

        [EnableRateLimiting("auth")]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] AdminResetPasswordDto dto)
        {
            await _adminAuthService.ResetPassword(dto);
            return Ok();
        }

        [Authorize(Policy = "SystemAdmin")]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] AdminChangePasswordDto dto)
        {
            await _adminAuthService.ChangePassword(dto);
            return Ok();
        }

        private void SetAdminRefreshCookie(string token, DateTimeOffset expires)
        {
            Response.Cookies.Append(RefreshCookieName, token, new CookieOptions
            {
                HttpOnly = true,
                Secure = !HttpContext.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment(),
                SameSite = SameSiteMode.Lax,
                Path = "/api/admin-auth",
                Expires = expires,
            });
        }
    }
}
