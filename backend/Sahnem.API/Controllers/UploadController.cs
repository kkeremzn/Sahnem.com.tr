using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahnem.Business.Interfaces;

namespace Sahnem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private static readonly HashSet<string> AllowedContentTypes = new()
        {
            "image/jpeg", "image/png", "image/webp", "image/gif"
        };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

        private readonly IFileStorageService _fileStorageService;

        public UploadController(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
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
            if (!AllowedContentTypes.Contains(file.ContentType))
            {
                throw new Exception("Only JPEG, PNG, WEBP or GIF images are allowed");
            }

            await using var stream = file.OpenReadStream();
            var url = await _fileStorageService.SaveFileAsync(stream, file.FileName, "avatars");

            return Ok(new { url });
        }
    }
}
