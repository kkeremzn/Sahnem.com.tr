namespace Sahnem.Business.Security
{
    // Normal kullanıcı JwtSettings'ten kasıtlı olarak ayrı — farklı bir imzalama
    // anahtarı kullanır, biri ele geçirilse diğeri etkilenmez.
    public class AdminJwtSettings
    {
        public string Key { get; set; } = null!;
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;
        public int ExpireMinutes { get; set; } = 30;
        public int RefreshTokenExpireDays { get; set; } = 14;
    }
}
