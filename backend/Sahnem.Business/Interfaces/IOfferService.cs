using Sahnem.Business.DTOs.Offer;

namespace Sahnem.Business.Interfaces
{
    public interface IOfferService
    {
        Task<OfferResponseDto> CreateOffer(OfferCreateDto dto);
        Task<OfferResponseDto> GetOfferById(int offerId);
        Task<IEnumerable<OfferResponseDto>> GetMyOffers();
        Task<IEnumerable<OfferResponseDto>> GetOffersByAdvert(int advertId);
        Task UpdateOfferStatus(int offerId, Core.Enums.OfferStatus status);
    }
}
