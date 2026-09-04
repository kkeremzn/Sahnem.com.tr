using Sahnem.Core.Enums;

namespace Sahnem.Core.Entities
{
    public class OrganizerProfile: BaseEntity
    {
        public int AppUserId {get; set;}

        public string OrganizerName {get; set;}
        public OrganizerType OrganizerType {get; set;}
        public string Bio {get; set;}
        public City City {get; set;}
        public string? District{get; set;}
        public string Address {get; set;}
        // Ana City gibi virgülle ayrılmış City enum adları — hizmet verdiği ek şehirler.
        public string? AdditionalCities {get; set;}

        public VerificationStatus VerificationStatus {get; set;} = VerificationStatus.Pending;

        public string? WebsiteUrl {get; set;}
        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public string? SpotifyUrl {get; set;}

        public virtual AppUser AppUser {get; set;}



    }
    
}
