namespace Sahnem.Business.DTOs.Message
{
    // Oturum açan kullanıcının bakış açısına göre türetilmiş görünüm — "karşı taraf"
    // kim ise onun bilgileri döner (Conversation entity'si UserA/UserB tutuyor).
    public class ConversationResponseDto
    {
        public int Id {get; set;}
        public int ParticipantId {get; set;}
        public string ParticipantName {get; set;}
        public string ParticipantRole {get; set;}
        public string? LastMessage {get; set;}
        public DateTime LastMessageAt {get; set;}
        public int UnreadCount {get; set;}
    }
}
