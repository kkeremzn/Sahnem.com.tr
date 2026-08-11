namespace Sahnem.Business.Email
{
    public static class EmailTemplates
    {
        public static string VerificationCode(string firstName, string code)
        {
            return $@"
                <div style=""font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color:#16151d;"">
                    <h2 style=""margin:0 0 16px;"">Merhaba {firstName},</h2>
                    <p style=""margin:0 0 24px; line-height:1.6;"">Sahnem hesabını doğrulamak için aşağıdaki kodu kullan. Kod 15 dakika boyunca geçerli.</p>
                    <div style=""font-size:32px; font-weight:700; letter-spacing:8px; background:#f4f2f8; padding:16px 24px; border-radius:12px; text-align:center; color:#8B1FE0;"">{code}</div>
                    <p style=""margin:24px 0 0; font-size:13px; color:#6b6777;"">Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
                </div>";
        }
    }
}
