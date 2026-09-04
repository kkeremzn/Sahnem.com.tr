using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs
{
    public class MusicianProfileCreateDto
    {
        public string Bio {get; set;}
        public List<MusicBranch> Branch {get; set;} = new();
        public List<MusicGenre> Genres {get; set;} = new();
        public int ExperienceYears {get; set;}
        public City City {get; set;}
        public string? District {get; set;}
        // Ana şehir + ayrıca hizmet verdiği diğer şehirler — arama/keşfet
        // sonuçlarında bu şehirlerden herhangi biri için de bulunabilir.
        public List<City> AdditionalCities {get; set;} = new();
        public IsAvailableToTravel IsAvailableToTravel {get; set;}
        public bool HasOwnEquipment {get; set;}
        public WorkStatus WorkStatus {get; set;}

        public string? InstagramUrl {get; set;}
        public string? YoutubeUrl {get; set;}
        public string? LinkedinUrl {get; set;}
        public string? SpotifyUrl {get; set;}
    }
}
