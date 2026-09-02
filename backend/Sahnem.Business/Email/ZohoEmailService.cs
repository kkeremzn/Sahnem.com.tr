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

                // MailKit'in varsayılan timeout'u 100 saniye — SMTP bağlantısı
                // tıkanırsa kayıt/doğrulama isteği kullanıcı için askıda kalıyordu.
                // Kısa bir timeout ile hızlı başarısız olup akışı bloklamıyoruz.
                // 587/STARTTLS Render'ın ağında takıldığı için doğrudan TLS (465/SSL)
                // kullanıyoruz — STARTTLS'in "düz metinden TLS'e yükseltme" adımına
                // müdahale eden ağ ekipmanlarına karşı daha güvenilir.
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                using var client = new SmtpClient();

                _logger.LogInformation("Zoho SMTP: {Host}:{Port} adresine bağlanılıyor...", _settings.Host, _settings.Port);
                await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.SslOnConnect, cts.Token);

                _logger.LogInformation("Zoho SMTP: bağlanıldı, kimlik doğrulanıyor...");
                await client.AuthenticateAsync(_settings.Username, _settings.Password, cts.Token);

                _logger.LogInformation("Zoho SMTP: kimlik doğrulandı, '{Subject}' {ToEmail} adresine gönderiliyor...", subject, toEmail);
                await client.SendAsync(message, cts.Token);

                await client.DisconnectAsync(true, cts.Token);
                _logger.LogInformation("Zoho SMTP: gönderim tamamlandı ({ToEmail}).", toEmail);
            }
            catch (OperationCanceledException)
            {
                _logger.LogError(
                    "Zoho SMTP bağlantısı zaman aşımına uğradı ({ToEmail} adresine '{Subject}' gönderilemedi).",
                    toEmail, subject);
            }
            catch (Exception ex)
            {
                // E-posta gönderiminin başarısız olması iş akışını (kayıt, teklif vb.) kesmemeli.
                _logger.LogError(ex, "Zoho SMTP e-posta gönderimi sırasında beklenmeyen hata.");
            }
        }
    }
}
