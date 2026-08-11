using AutoMapper;
using Sahnem.Business.DTOs.Profile;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.Business.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IGenericRepository<Favorite> _favoriteRepository;
        private readonly IGenericRepository<MusicianProfile> _musicianProfileRepository;
        private readonly IGenericRepository<AppUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public FavoriteService(
            IGenericRepository<Favorite> favoriteRepository,
            IGenericRepository<MusicianProfile> musicianProfileRepository,
            IGenericRepository<AppUser> userRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICurrentUserService currentUserService)
        {
            _favoriteRepository = favoriteRepository;
            _musicianProfileRepository = musicianProfileRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<bool> ToggleFavorite(int musicianUserId)
        {
            var ownerId = _currentUserService.UserId;

            var musicianUser = await _userRepository.GetByIdAsync(musicianUserId);
            if (musicianUser == null || musicianUser.Role != UserType.Musician)
            {
                throw new Exception("Musician not found");
            }

            var existing = await _favoriteRepository.FirstOrDefaultAsync(
                f => f.OwnerUserId == ownerId && f.MusicianUserId == musicianUserId);

            if (existing != null)
            {
                _favoriteRepository.Delete(existing);
                await _unitOfWork.SaveChanges();
                return false;
            }

            await _favoriteRepository.AddAsync(new Favorite { OwnerUserId = ownerId, MusicianUserId = musicianUserId });
            await _unitOfWork.SaveChanges();
            return true;
        }

        public async Task<IEnumerable<int>> GetMyFavoriteMusicianIds()
        {
            var ownerId = _currentUserService.UserId;
            var favorites = await _favoriteRepository.WhereAsync(f => f.OwnerUserId == ownerId);
            return favorites.Select(f => f.MusicianUserId);
        }

        public async Task<IEnumerable<MusicianProfileResponseDto>> GetMyFavorites()
        {
            var musicianUserIds = (await GetMyFavoriteMusicianIds()).ToList();
            if (musicianUserIds.Count == 0)
            {
                return Enumerable.Empty<MusicianProfileResponseDto>();
            }

            var musicians = await _musicianProfileRepository.WhereAsync(m => musicianUserIds.Contains(m.AppUserId));
            var users = await _userRepository.WhereAsync(u => musicianUserIds.Contains(u.Id));

            var dtos = _mapper.Map<List<MusicianProfileResponseDto>>(musicians);
            foreach (var dto in dtos)
            {
                var user = users.FirstOrDefault(u => u.Id == dto.AppUserId);
                dto.FirstName = user?.FirstName;
                dto.LastName = user?.LastName;
                dto.AvatarUrl = user?.AvatarUrl;
            }
            return dtos;
        }
    }
}
