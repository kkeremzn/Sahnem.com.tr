namespace Sahnem.Business.DTOs
{
    public class AuthResponseDto
    {
        public string AccessToken{get; set;} = string.Empty;
        public DateTime ExpiresAt{get; set;}
        public string RefreshToken{get; set;} = string.Empty;
        public DateTime RefreshTokenExpiresAt{get; set;}
    }
}
