using Sahnem.Core.Enums;

namespace Sahnem.Business.DTOs.Offer
{
    public class OfferResponseDto
    {
        public int Id {get; set;}
        public int MusicianId {get; set;}
        public string? MusicianName {get; set;}
        public MusicBranch? MusicianBranch {get; set;}
        public int AdvertId {get; set;}
        public string? AdvertTitle {get; set;}
        public string Message {get; set;}
        public decimal ProposedPrice {get; set;}
        public OfferStatus OfferStatus {get; set;}
        public DateTime CreatedDate {get; set;}
    }
}
