using Sahnem.Core.Enums;

namespace Sahnem.Core.Entities
{
    public class AppUser : BaseEntity
    {
        public string FirstName {get; set;}
        public string LastName {get; set; }
        public string Email {get; set;}
        public string PasswordHash {get; set;}
        public string PhoneNumber {get; set;}
        public string? AvatarUrl {get; set;}
        public UserType Role {get; set;}
        public bool IsEmailConfirmed {get; set;} = false;
        public bool IsPhoneNumberConfirmed {get; set;} = false;
        public bool IsProfileCompleted {get; set;} = false;

        public virtual MusicianProfile MusicianProfile {get; set;}
        public virtual OrganizerProfile OrganizerProfile {get; set;}
        public virtual VenueProfile VenueProfile {get; set;}

        public virtual ICollection<Offer> Offers {get; set;} = new List<Offer>();
        public virtual ICollection<Advert> Adverts {get; set;} = new List<Advert>(); 
        
    }
}