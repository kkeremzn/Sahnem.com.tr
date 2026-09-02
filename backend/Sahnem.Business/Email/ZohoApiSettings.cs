namespace Sahnem.Business.Email
{
    public class ZohoApiSettings
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public string AccountId { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = "Sahnem";
    }
}
