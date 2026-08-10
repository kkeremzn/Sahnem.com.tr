using Sahnem.Business.Interfaces;

namespace Sahnem.API.Services
{
    // MVP için basit yerel disk depolama. İleride Azure Blob/S3'e geçilirse
    // sadece bu sınıfın yeni bir implementasyonu yazılıp Program.cs'te DI kaydı
    // değiştirilir — IFileStorageService kontratı sabit kalır.
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public LocalFileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFileAsync(Stream content, string fileName, string subFolder)
        {
            var webRoot = string.IsNullOrEmpty(_env.WebRootPath)
                ? Path.Combine(_env.ContentRootPath, "wwwroot")
                : _env.WebRootPath;

            var targetDirectory = Path.Combine(webRoot, "uploads", subFolder);
            Directory.CreateDirectory(targetDirectory);

            var uniqueFileName = $"{Guid.NewGuid():N}{Path.GetExtension(fileName)}";
            var fullPath = Path.Combine(targetDirectory, uniqueFileName);

            await using (var fileStream = new FileStream(fullPath, FileMode.Create))
            {
                await content.CopyToAsync(fileStream);
            }

            return $"/uploads/{subFolder}/{uniqueFileName}";
        }
    }
}
