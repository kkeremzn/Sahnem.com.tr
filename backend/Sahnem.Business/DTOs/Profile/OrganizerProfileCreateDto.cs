
using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs
{
    public class OrganizerProfileCreateDto
    {
        public string OrganizerName {get; set;}
        public OrganizerType organizerType {get; set;}
        public string Bio {get; set;}
        public City City {get; set;}
        public string? District {get; set;}
        public string Address {get; set;}
        public List<City> AdditionalCities {get; set;} = new();


        public string? WebsiteUrl {get; set;}
        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public string? SpotifyUrl {get; set;}
    }
}