namespace Sahnem.Core.Entities
{
    public class AdminRefreshToken : BaseEntity
    {
        public string Token {get; set;}
        public int AdminId {get; set;}
        public DateTime ExpiresAt {get; set;}
        public DateTime? RevokedAt {get; set;}

        public virtual Admin Admin {get; set;}

        public bool IsActive => RevokedAt == null && ExpiresAt > DateTime.UtcNow;
    }
}
