namespace Sahnem.Core.Entities
{
    public class Conversation : BaseEntity
    {
        public int UserAId {get; set;}
        public int UserBId {get; set;}
        public string? LastMessage {get; set;}
        public DateTime LastMessageAt {get; set;}
        public int UnreadCountA {get; set;} = 0;
        public int UnreadCountB {get; set;} = 0;

        public virtual AppUser UserA {get; set;}
        public virtual AppUser UserB {get; set;}
        public virtual ICollection<Message> Messages {get; set;} = new List<Message>();
    }
}
