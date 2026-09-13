using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Admin
{
    // UserIds verilmişse öncelikli olarak o kullanıcılara; yoksa Role verilmişse o
    // roldeki herkese; ikisi de boşsa tüm aktif kullanıcılara gönderilir.
    public class AdminBroadcastNotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string? LinkTo { get; set; }
        public List<int>? UserIds { get; set; }
        public UserType? Role { get; set; }
    }

    public class AdminSendEmailDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public List<int>? UserIds { get; set; }
        public UserType? Role { get; set; }
    }

    public class AdminBroadcastResultDto
    {
        public int RecipientCount { get; set; }
        public int FailedCount { get; set; }
    }
}
