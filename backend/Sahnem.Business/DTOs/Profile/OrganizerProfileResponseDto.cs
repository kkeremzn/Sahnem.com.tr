using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Profile
{
    public class OrganizerProfileResponseDto
    {
        public int Id {get; set;}
        public int AppUserId {get; set;}
        public string? AvatarUrl {get; set;}
        public string OrganizerName {get; set;}
        public OrganizerType organizerType {get; set;}
        public string Bio {get; set;}
        public City City {get; set;}
        public string? District {get; set;}
        public string Address {get; set;}

    
        public string? WebsiteUrl {get; set;}
        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public VerificationStatus VerificationStatus {get; set;}
    }
}