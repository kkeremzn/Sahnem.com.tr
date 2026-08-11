using Sahnem.Business.DTOs.Profile;

namespace Sahnem.Business.Interfaces
{
    public interface IFavoriteService
    {
        Task<bool> ToggleFavorite(int musicianUserId);
        Task<IEnumerable<MusicianProfileResponseDto>> GetMyFavorites();
        Task<IEnumerable<int>> GetMyFavoriteMusicianIds();
    }
}
