using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Security;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private static readonly Dictionary<string, string> AllowedContentTypes = new()
        {
            ["image/jpeg"] = ".jpg",
            ["image/png"] = ".png",
            ["image/webp"] = ".webp",
            ["image/gif"] = ".gif",
        };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

        private readonly IFileStorageService _fileStorageService;
        private readonly ICurrentUserService _currentUserService;

        public UploadController(IFileStorageService fileStorageService, ICurrentUserService currentUserService)
        {
            _fileStorageService = fileStorageService;
            _currentUserService = currentUserService;
        }

        // Profil fotoğrafı / logo yükleme. Dönen relatif URL, kullanıcı/profil
        // update uçlarındaki AvatarUrl alanına kaydedilmek üzere kullanılabilir.
        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new Exception("Please select a file");
            }
            if (file.Length > MaxFileSizeBytes)
            {
                throw new Exception("File must not exceed 5 MB");
            }
            // Content-Type header istemci tarafından bildiriliyor, güvenilir değil —
            // "evil.php" dosyasını Content-Type: image/jpeg diyerek göndermek trivial.
            // Bu yüzden hem bildirilen tipi hem dosyanın gerçek baytlarını (magic
            // number) doğruluyoruz, ve kaydedilen dosyanın uzantısını istemcinin
            // gönderdiği dosya adından DEĞİL, doğrulanmış içerik tipinden türetiyoruz —
            // aksi halde uzantı zehirlenerek wwwroot altına çalıştırılabilir bir
            // dosya (ör. .html, sunucu html olarak servis ettiği için XSS) bırakılabilir.
            if (!AllowedContentTypes.TryGetValue(file.ContentType, out var extension))
            {
                throw new Exception("Only JPEG, PNG, WEBP or GIF images are allowed");
            }

            await using var stream = file.OpenReadStream();
            if (!await LooksLikeImageAsync(stream, file.ContentType))
            {
                throw new Exception("File content does not match a valid image");
            }
            stream.Position = 0;

            // Kullanıcı bazlı alt klasör kasıtlı — AvatarUrl istemciden serbest
            // metin olarak kabul edildiği için (bkz. AppUserUpdateDto), bu yol
            // segmenti olmadan bir kullanıcı başka birinin (herkese açık profilde
            // zaten görünen) avatar URL'ini kendi AvatarUrl'i olarak gönderip,
            // sonra değiştirip UserService'teki "eski avatarı R2'den temizle"
            // mantığını kullanarak o kişinin gerçek dosyasını sildirebilirdi.
            var url = await _fileStorageService.SaveFileAsync(stream, $"avatar{extension}", $"avatars/{_currentUserService.UserId}");

            return Ok(new { url });
        }

        private static async Task<bool> LooksLikeImageAsync(Stream stream, string declaredContentType)
        {
            var header = new byte[12];
            var read = await stream.ReadAsync(header.AsMemory(0, header.Length));
            if (read < 4) return false;

            return declaredContentType switch
            {
                "image/jpeg" => header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF,
                "image/png" => header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47,
                "image/gif" => header[0] == 0x47 && header[1] == 0x49 && header[2] == 0x46,
                "image/webp" => read >= 12
                    && header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46
                    && header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50,
                _ => false,
            };
        }
    }
}
