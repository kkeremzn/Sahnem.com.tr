namespace Sahnem.Business.DTOs
{
    // İstemciye (JSON body) dönen, sadece access token içeren dış yüz. Refresh token
    // buraya asla konmaz — HttpOnly cookie olarak set edilir (bkz. TokenPairDto,
    // ApiControllerBase). Böylece tarayıcıda çalışan JS koduna (dolayısıyla bir XSS
    // açığına) refresh token hiçbir zaman erişilebilir olmaz.
    public class AuthResponseDto
    {
        public string AccessToken{get; set;} = string.Empty;
        public DateTime ExpiresAt{get; set;}
    }
}
