namespace Sahnem.Business.Email
{
    public class ResendSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        // Resend'de doğrulanmış bir domain'e sahip olmadan sadece bu adresten
        // gönderim yapılabilir: onboarding@resend.dev. Kendi domain'ini
        // doğruladıktan sonra appsettings/user-secrets'ten değiştir.
        public string FromEmail { get; set; } = "Sahnem <onboarding@resend.dev>";
    }
}
