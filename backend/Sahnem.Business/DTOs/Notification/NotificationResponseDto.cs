namespace Sahnem.Business.DTOs.Notification
{
    public class NotificationResponseDto
    {
        public int Id {get; set;}
        public string Type {get; set;}
        public string Title {get; set;}
        public string Body {get; set;}
        public bool IsRead {get; set;}
        public string? LinkTo {get; set;}
        public DateTime CreatedDate {get; set;}
    }
}
