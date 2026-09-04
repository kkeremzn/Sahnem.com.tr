namespace Sahnem.Business.DTOs.Admin
{
    // UserIds boş/null ise tüm aktif kullanıcılara gönderilir.
    public class AdminBroadcastNotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string? LinkTo { get; set; }
        public List<int>? UserIds { get; set; }
    }

    public class AdminSendEmailDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public List<int>? UserIds { get; set; }
    }

    public class AdminBroadcastResultDto
    {
        public int RecipientCount { get; set; }
    }
}
