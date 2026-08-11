namespace Sahnem.Core.Entities
{
    public class Message : BaseEntity
    {
        public int ConversationId {get; set;}
        public int SenderId {get; set;}
        public string Body {get; set;}

        public virtual Conversation Conversation {get; set;}
        public virtual AppUser Sender {get; set;}
    }
}
