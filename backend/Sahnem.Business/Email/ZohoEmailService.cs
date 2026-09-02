using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sahnem.Business.Interfaces;

namespace Sahnem.Business.Email
{
    // Zoho Mail'in HTTPS REST API'si üzerinden gönderir (SMTP DEĞİL — Render'ın
    // container'ından SMTP portlarına (465/587) çıkış tamamen engelli olduğu
    // canlıda doğrulandı: HTTPS/443 anında bağlanırken tüm SMTP portları 8
    // saniyede zaman aşımına uğruyordu). OAuth2 refresh token appsettings/
    // user-secrets'ten `Zoho:*` ile okunuyor; erişim tokenı (1 saatlik) burada
    // bellekte cache'lenip süresi dolunca otomatik yenileniyor.
    public class ZohoEmailService : IEmailService
    {
        private const string AccountsDomain = "https://accounts.zoho.eu";
        private const string ApiDomain = "https://mail.zoho.eu";

        private readonly ZohoApiSettings _settings;
        private readonly HttpClient _httpClient;
        private readonly ILogger<ZohoEmailService> _logger;

        private static string? _cachedAccessToken;
        private static DateTime _cachedAccessTokenExpiresAt = DateTime.MinValue;
        private static readonly SemaphoreSlim TokenLock = new(1, 1);

        public ZohoEmailService(IOptions<ZohoApiSettings> settings, HttpClient httpClient, ILogger<ZohoEmailService> logger)
        {
            _settings = settings.Value;
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task SendAsync(string toEmail, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(_settings.RefreshToken) || string.IsNullOrWhiteSpace(_settings.ClientId))
            {
                _logger.LogWarning(
                    "Zoho API ayarlanmamış, '{Subject}' e-postası {ToEmail} adresine gönderilmedi.",
                    subject, toEmail);
                return;
            }

            try
            {
                var accessToken = await GetAccessTokenAsync();

                var request = new HttpRequestMessage(HttpMethod.Post, $"{ApiDomain}/api/accounts/{_settings.AccountId}/messages")
                {
                    Content = JsonContent.Create(new
                    {
                        fromAddress = _settings.FromEmail,
                        toAddress = toEmail,
                        subject,
                        content = htmlBody,
                        askReceipt = "no",
                    }),
                };
                request.Headers.Authorization = new AuthenticationHeaderValue("Zoho-oauthtoken", accessToken);

                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Zoho Mail API gönderimi başarısız ({Status}): {Body}", response.StatusCode, body);
                }
            }
            catch (Exception ex)
            {
                // E-posta gönderiminin başarısız olması iş akışını (kayıt, teklif vb.) kesmemeli.
                _logger.LogError(ex, "Zoho Mail API gönderimi sırasında beklenmeyen hata.");
            }
        }

        private async Task<string> GetAccessTokenAsync()
        {
            await TokenLock.WaitAsync();
            try
            {
                if (_cachedAccessToken != null && DateTime.UtcNow < _cachedAccessTokenExpiresAt)
                {
                    return _cachedAccessToken;
                }

                var query = $"?refresh_token={Uri.EscapeDataString(_settings.RefreshToken)}" +
                            $"&client_id={Uri.EscapeDataString(_settings.ClientId)}" +
                            $"&client_secret={Uri.EscapeDataString(_settings.ClientSecret)}" +
                            "&grant_type=refresh_token";

                var response = await _httpClient.PostAsync($"{AccountsDomain}/oauth/v2/token{query}", content: null);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadFromJsonAsync<JsonElement>();
                var accessToken = json.GetProperty("access_token").GetString()!;
                var expiresInSeconds = json.GetProperty("expires_in").GetInt32();

                _cachedAccessToken = accessToken;
                // Tam sınırda süresi dolmuş bir token'la isteğe çıkmamak için erken yenileme payı.
                _cachedAccessTokenExpiresAt = DateTime.UtcNow.AddSeconds(expiresInSeconds - 60);

                return accessToken;
            }
            finally
            {
                TokenLock.Release();
            }
        }
    }
}
