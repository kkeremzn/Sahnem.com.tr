using Sahnem.Core.Enums;

namespace Sahnem.Core.Entities
{
    public class MusicianProfile : BaseEntity
    {
        public int AppUserId {get; set;}
        public string Bio {get; set;}
        public string Branch {get; set;}
        public string Genres {get; set;}
        public int ExperienceYears {get; set;}
        public City City {get; set;}
        public string? District {get; set;}
        // Ana City alanı gibi virgülle ayrılmış City enum adları — hizmet
        // verdiği ek şehirler (ör. "Ankara,Bursa").
        public string? AdditionalCities {get; set;}
        public IsAvailableToTravel IsAvailableToTravel {get; set;}
        public bool HasOwnEquipment {get; set;}
        public WorkStatus WorkStatus {get; set;}

        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public string? SpotifyUrl {get; set;}
        public VerificationStatus VerificationStatus {get; set;} = VerificationStatus.Pending;


        public virtual AppUser AppUser {get; set;}


    }
}