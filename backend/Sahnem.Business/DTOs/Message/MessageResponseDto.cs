namespace Sahnem.Business.DTOs.Message
{
    public class MessageResponseDto
    {
        public int Id {get; set;}
        public int ConversationId {get; set;}
        public int SenderId {get; set;}
        public string Body {get; set;}
        public DateTime CreatedDate {get; set;}
    }
}
