using Sahnem.Core.Enums;

namespace Sahnem.Core.Entities
{
    
    public class Offer : BaseEntity
    {
        public int MusicianId{get; set;}
        public int AdvertId{get; set;}
        public string Message{get; set;}
        public decimal ProposedPrice{get; set;}
        public OfferStatus OfferStatus{get; set;} = OfferStatus.Pending;

        public virtual Advert Advert {get; set;}
        public virtual AppUser Musician {get; set;}


    }
}