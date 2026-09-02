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
        Task<PagedResultDto<AdvertResponseDto>> GetAllAdvert(AdvertFilterDto? filter = null, bool includeCancelled = false);
        Task<IEnumerable<AdvertResponseDto>> GetMyAdverts();
    }
}