using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.Security;

namespace Sahnem.API.Controllers
{
    // Refresh token'ı HttpOnly cookie olarak set/temizleme mantığı burada tek
    // yerde toplanıyor (UserController ve ProfileController kullanıyor) — hem
    // kod tekrarını önlüyor hem de cookie güvenlik ayarlarının (HttpOnly, Secure,
    // SameSite) her yerde tutarlı olmasını garanti ediyor.
    //
    // Neden cookie, neden body değil: Refresh token JSON body'de dönüp frontend
    // tarafından localStorage'a yazılırsa, sitede çalışan herhangi bir XSS açığı
    // bu tokenı doğrudan çalabilir ve saldırgan süresiz oturum ele geçirir.
    // HttpOnly cookie, JavaScript'in bu değere HİÇBİR şekilde erişememesini
    // garanti eder — XSS olsa bile token çalınamaz.
    public abstract class ApiControllerBase : ControllerBase
    {
        protected const string RefreshTokenCookieName = "sahnem_refresh_token";

        protected void SetRefreshTokenCookie(TokenPairDto tokens)
        {
            Response.Cookies.Append(RefreshTokenCookieName, tokens.RefreshToken, BuildCookieOptions(tokens.RefreshTokenExpiresAt));
        }

        protected void ClearRefreshTokenCookie()
        {
            Response.Cookies.Delete(RefreshTokenCookieName, BuildCookieOptions(DateTimeOffset.UtcNow));
        }

        protected string? ReadRefreshTokenCookie()
        {
            return Request.Cookies.TryGetValue(RefreshTokenCookieName, out var value) ? value : null;
        }

        private CookieOptions BuildCookieOptions(DateTimeOffset expires)
        {
            return new CookieOptions
            {
                HttpOnly = true,
                // Prod'da mutlaka HTTPS üzerinden gitsin; yerelde http://localhost
                // ile test edilebilsin diye sadece Development'ta false.
                Secure = !HttpContext.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment(),
                // Bu cookie sadece frontend'in kendi fetch çağrılarıyla gönderilecek,
                // üçüncü bir sitenin tetiklediği cross-site bir istekle asla
                // taşınmamalı — CSRF'e karşı ana savunma satırı bu.
                SameSite = SameSiteMode.Strict,
                // Sadece refresh/logout uçlarına gitsin, gereksiz yere her istekte taşınmasın.
                Path = "/api/user",
                Expires = expires,
            };
        }
    }
}
