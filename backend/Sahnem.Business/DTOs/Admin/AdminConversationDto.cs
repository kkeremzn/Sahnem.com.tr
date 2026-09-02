namespace Sahnem.Business.DTOs.Admin
{
    // Tüketici tarafındaki ConversationResponseDto "karşı taraf" bakış açısıyla
    // (tek kullanıcı) çalışıyor — admin'in HER İKİ tarafı da görmesi gerektiği
    // için ayrı bir DTO.
    public class AdminConversationDto
    {
        public int Id {get; set;}
        public int UserAId {get; set;}
        public string UserAName {get; set;} = string.Empty;
        public int UserBId {get; set;}
        public string UserBName {get; set;} = string.Empty;
        public string? LastMessage {get; set;}
        public DateTime LastMessageAt {get; set;}
        public int MessageCount {get; set;}
        public DateTime CreatedDate {get; set;}
    }

    public class AdminMessageDto
    {
        public int Id {get; set;}
        public int SenderId {get; set;}
        public string SenderName {get; set;} = string.Empty;
        public string Body {get; set;} = string.Empty;
        public DateTime CreatedDate {get; set;}
    }
}
