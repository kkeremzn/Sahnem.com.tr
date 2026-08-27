namespace Sahnem.Business.Security
{
    // Sadece servis katmanı <-> controller sınırında dolaşan iç (internal) taşıyıcı.
    // RefreshToken alanı hiçbir zaman doğrudan bir controller'dan JSON olarak
    // dönülmemeli — controller bunu HttpOnly cookie'ye yazıp bu tipi discard etmeli,
    // istemciye sadece AuthResponseDto'ya (AccessToken + ExpiresAt) çevrilmiş hali gider.
    public class TokenPairDto
    {
        public string AccessToken {get; set;} = string.Empty;
        public DateTime ExpiresAt {get; set;}
        public string RefreshToken {get; set;} = string.Empty;
        public DateTime RefreshTokenExpiresAt {get; set;}
    }
}
