using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sahnem.Business.Interfaces;

namespace Sahnem.Business.Email
{
    // Resend'in basit REST API'si üzerinden email gönderir (bkz. https://resend.com/docs/api-reference/emails/send-email).
    // API anahtarı appsettings/user-secrets'ten `Resend:ApiKey` ile okunuyor. Anahtar
    // ayarlanmamışsa gönderim sessizce atlanır ve uyarı loglanır — bu sayede Resend
    // hesabı/domain doğrulaması henüz yapılmamışken bile kayıt/doğrulama akışı bozulmaz.
    public class ResendEmailService : IEmailService
    {
        private const string ResendApiUrl = "https://api.resend.com/emails";

        private readonly HttpClient _httpClient;
        private readonly ResendSettings _settings;
        private readonly ILogger<ResendEmailService> _logger;

        public ResendEmailService(HttpClient httpClient, IOptions<ResendSettings> settings, ILogger<ResendEmailService> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task SendAsync(string toEmail, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(_settings.ApiKey))
            {
                _logger.LogWarning(
                    "Resend:ApiKey ayarlanmamış, '{Subject}' e-postası {ToEmail} adresine gönderilmedi. " +
                    "dotnet user-secrets set \"Resend:ApiKey\" \"re_...\" ile ayarlayın.",
                    subject, toEmail);
                return;
            }

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, ResendApiUrl)
                {
                    Content = JsonContent.Create(new
                    {
                        from = _settings.FromEmail,
                        to = new[] { toEmail },
                        subject,
                        html = htmlBody,
                    }),
                };
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);

                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Resend e-posta gönderimi başarısız ({Status}): {Body}", response.StatusCode, body);
                }
            }
            catch (Exception ex)
            {
                // E-posta gönteriminin başarısız olması iş akışını (kayıt, teklif vb.) kesmemeli.
                _logger.LogError(ex, "Resend e-posta gönderimi sırasında beklenmeyen hata.");
            }
        }
    }
}
