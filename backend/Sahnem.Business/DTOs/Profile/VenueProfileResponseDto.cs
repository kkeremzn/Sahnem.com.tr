using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Profile
{
    public class VenueProfileResponseDto
    {
        public int Id {get; set;}
        public int AppUserId {get; set;}
        public string? AvatarUrl {get; set;}
        public string VenueName {get; set;}
        public VenueType VenueType {get; set;}
        public string Bio {get; set;}
        public City City {get; set;}
        public string? District {get; set;}
        public int Capacity {get; set;}
        public string Address {get; set;}
        public bool HasSoundSystem { get; set; }
    
        public string? WebsiteUrl {get; set;}
        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public string? SpotifyUrl {get; set;}
        public VerificationStatus VerificationStatus {get; set;}
    }
}