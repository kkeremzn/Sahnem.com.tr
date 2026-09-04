using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Advert
{
    public class AdvertResponseDto
    {
        public int Id {get; set;}
        public int CreatorId {get; set;}
        public string? CreatorName {get; set;}
        public string? CreatorRole {get; set;}
        public string Title {get; set;}
        public string Description {get; set;}
        public City City{get; set;}
        public string? District{get; set;}
        public string Address {get; set;}
        public bool EquipmentProvided { get; set; }
        public string? EquipmentNote { get; set; }
        public DateTime EventTime {get; set;}
        public decimal Budget {get; set;}
        public int? MinimumExperienceYears{get; set;}
        public MusicBranch? TargetBranch {get; set;}
        public AdvertStatus Status {get; set;}
        public DateTime ApplicationDeadline { get; set; }
        public DateTime CreatedDate {get; set;}
        public int OfferCount {get; set;}
    }
}
