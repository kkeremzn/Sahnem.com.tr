using Sahnem.Business.DTOs;
using Sahnem.Business.DTOs.Advert;

namespace Sahnem.Business.Interfaces
{
    public interface IAdvertService
    {
        Task<AdvertResponseDto> CreateAdvert(AdvertCreateDto dto);
        Task UpdateAdvert(int advertId, AdvertUpdateDto dto);
        Task CancelAdvert(int advertId);
        Task<AdvertResponseDto> GetAdvertById(int advertId);
        Task<IEnumerable<AdvertResponseDto>> GetAllAdvert();
        Task<IEnumerable<AdvertResponseDto>> GetMyAdverts();
    }
}