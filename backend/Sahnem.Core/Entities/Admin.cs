namespace Sahnem.Core.Entities
{
    // Bilinçli olarak AppUser'dan tamamen ayrı — normal kullanıcı auth sistemiyle
    // hiçbir ortak yanı yok (ayrı tablo, ayrı şifre hash'i, ayrı JWT imzalama
    // anahtarı). Ana kullanıcı token imzalama anahtarı ele geçirilse bile admin
    // token'ı sahtelenemez, ve tam tersi.
    public class Admin : BaseEntity
    {
        public string Username {get; set;}
        public string Email {get; set;}
        public string PasswordHash {get; set;}
        public DateTime? LastLoginAt {get; set;}
        public string? LastLoginIp {get; set;}

        public string? PasswordResetCode {get; set;}
        public DateTime? PasswordResetCodeExpiresAt {get; set;}
        public DateTime? PasswordResetCodeSentAt {get; set;}

        public virtual ICollection<AdminRefreshToken> RefreshTokens {get; set;} = new List<AdminRefreshToken>();
    }
}
