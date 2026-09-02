using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Sahnem.Business.Interfaces;

namespace Sahnem.Business.Email
{
    // Zoho Mail'in SMTP sunucusu üzerinden gönderir. Kimlik bilgileri (SMTP
    // uygulama şifresi dahil) appsettings/user-secrets'ten `Zoho:*` ile okunuyor.
    // Host/kullanıcı adı ayarlanmamışsa gönderim sessizce atlanır ve uyarı
    // loglanır — bu sayede yerel geliştirmede Zoho hesabı olmadan da kayıt/
    // doğrulama akışı bozulmaz.
    public class ZohoEmailService : IEmailService
    {
        private readonly ZohoSmtpSettings _settings;
        private readonly ILogger<ZohoEmailService> _logger;

        public ZohoEmailService(IOptions<ZohoSmtpSettings> settings, ILogger<ZohoEmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task SendAsync(string toEmail, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(_settings.Host) || string.IsNullOrWhiteSpace(_settings.Username))
            {
                _logger.LogWarning(
                    "Zoho SMTP ayarlanmamış, '{Subject}' e-postası {ToEmail} adresine gönderilmedi.",
                    subject, toEmail);
                return;
            }

            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
                message.To.Add(MailboxAddress.Parse(toEmail));
                message.Subject = subject;
                message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_settings.Username, _settings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                // E-posta gönderiminin başarısız olması iş akışını (kayıt, teklif vb.) kesmemeli.
                _logger.LogError(ex, "Zoho SMTP e-posta gönderimi sırasında beklenmeyen hata.");
            }
        }
    }
}
