using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Advert
{
    // Tüm alanlar opsiyonel — boş bırakılan filtre uygulanmaz.
    public class AdvertFilterDto
    {
        public string? Search {get; set;}
        public City? City {get; set;}
        public MusicBranch? Branch {get; set;}
        public AdvertStatus? Status {get; set;}
        public decimal? MinBudget {get; set;}
        public int Page {get; set;} = 1;
        public int PageSize {get; set;} = 20;
    }
}
