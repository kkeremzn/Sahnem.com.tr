namespace Sahnem.Core.Entities
{
    public class RefreshToken : BaseEntity
    {
        public string Token {get; set;}
        public int AppUserId {get; set;}
        public DateTime ExpiresAt {get; set;}
        public DateTime? RevokedAt {get; set;}

        public virtual AppUser AppUser {get; set;}

        public bool IsActive => RevokedAt == null && ExpiresAt > DateTime.UtcNow;
    }
}
