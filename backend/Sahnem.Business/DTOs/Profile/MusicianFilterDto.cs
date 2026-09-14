namespace Sahnem.Business.DTOs.Profile
{
    // Tüm alanlar opsiyonel — boş bırakılan filtre uygulanmaz. Branches/Cities
    // virgülle ayrılmış enum adları olarak geliyor (MultiEnumField ile aynı
    // kural) — birden fazla branş/şehir aynı anda seçilebilsin diye.
    public class MusicianFilterDto
    {
        public string? Search {get; set;}
        public string? Branches {get; set;}
        public string? Cities {get; set;}
        public bool? TravelOnly {get; set;}
        public int Page {get; set;} = 1;
        public int PageSize {get; set;} = 20;
    }
}
