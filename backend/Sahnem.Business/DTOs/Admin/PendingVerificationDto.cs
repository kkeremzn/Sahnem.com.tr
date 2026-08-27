namespace Sahnem.Business.DTOs.Admin
{
    public class PendingVerificationDto
    {
        public string Kind {get; set;} = string.Empty; // "Musician" | "Organizer" | "Venue"
        public int ProfileId {get; set;}
        public int AppUserId {get; set;}
        public string Name {get; set;} = string.Empty;
        public string Email {get; set;} = string.Empty;
        public DateTime CreatedDate {get; set;}
    }
}
