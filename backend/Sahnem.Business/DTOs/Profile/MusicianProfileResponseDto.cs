
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
        public MusicBranch Branch {get; set;}
        public string Genres {get; set;}
        public int ExperienceYears {get; set;}
        public City City {get; set;}
        public string? District {get; set;}
        public IsAvailableToTravel IsAvailableToTravel {get; set;}
        public bool HasOwnEquipment {get; set;}
        public WorkStatus WorkStatus {get; set;}

        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public VerificationStatus VerificationStatus {get; set;}
    }
}
      
