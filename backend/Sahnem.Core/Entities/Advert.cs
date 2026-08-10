using Sahnem.Business.Enums;
using Sahnem.Core.Enums;

namespace Sahnem.Core.Entities
{
    
    public class Advert : BaseEntity
    {
        public int CreatorId {get; set;}
        public string Title {get; set;}
        public string Description {get; set;}
        public City City{get; set;}
        public string? District{get; set;}
        public string Address {get; set;}
        public bool EquipmentProvided { get; set; }
        public DateTime EventTime {get; set;}
        public decimal Budget {get; set;}
        public int? MinimumExperienceYears{get; set;}
        public AdvertStatus Status {get; set;}
        public DateTime ApplicationDeadline { get; set; }

        public virtual AppUser Creator {get; set;}
        public virtual ICollection<Offer> Offers {get; set;} = new List<Offer>();

    }
}