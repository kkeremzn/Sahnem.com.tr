using Sahnem.Core.Entities;
using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Advert
{
    public class AdvertCreateDto
    {
        public string Title {get; set;}
        public string Description {get; set;}
        public City City{get; set;}
        public string? District{get; set;}
        public string Address {get; set;}
        public bool EquipmentProvided { get; set; }
        public DateTime EventTime {get; set;}
        public decimal Budget {get; set;}
        public int? MinimumExperienceYears{get; set;}
        public DateTime ApplicationDeadline { get; set; }

    }    
}