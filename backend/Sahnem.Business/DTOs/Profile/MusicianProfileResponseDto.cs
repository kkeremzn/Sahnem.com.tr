using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Profile
{
    public class MusicianProfileResponseDto
    {
        public int Id {get; set;}
        public int AppUserId {get; set;}
        public string? FirstName {get; set;}
        public string? LastName {get; set;}
        public string? AvatarUrl {get; set;}
        public string Bio {get; set;}
        public List<MusicBranch> Branch {get; set;} = new();
        public List<MusicGenre> Genres {get; set;} = new();
        public int ExperienceYears {get; set;}
        public City City {get; set;}
        public string? District {get; set;}
        public List<City> AdditionalCities {get; set;} = new();
        public IsAvailableToTravel IsAvailableToTravel {get; set;}
        public bool HasOwnEquipment {get; set;}
        public string? EquipmentNote {get; set;}
        public WorkStatus WorkStatus {get; set;}

        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public string? SpotifyUrl {get; set;}
        public VerificationStatus VerificationStatus {get; set;}
    }
}
