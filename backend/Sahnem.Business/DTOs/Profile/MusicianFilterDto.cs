using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Profile
{
    // Tüm alanlar opsiyonel — boş bırakılan filtre uygulanmaz.
    public class MusicianFilterDto
    {
        public string? Search {get; set;}
        public MusicBranch? Branch {get; set;}
        public City? City {get; set;}
        public bool? TravelOnly {get; set;}
    }
}
