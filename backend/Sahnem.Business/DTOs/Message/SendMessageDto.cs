namespace Sahnem.Business.DTOs.Message
{
    public class SendMessageDto
    {
        // İkisinden biri gönderilmeli: mevcut bir sohbete devam ediliyorsa ConversationId,
        // ilk mesajsa RecipientUserId (sohbet yoksa otomatik oluşturulur).
        public int? ConversationId {get; set;}
        public int? RecipientUserId {get; set;}
        public string Body {get; set;}
    }
}
