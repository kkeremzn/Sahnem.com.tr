namespace Sahnem.Business.Email
{
    public class ZohoSmtpSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; } = 465;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = "Sahnem";
    }
}
