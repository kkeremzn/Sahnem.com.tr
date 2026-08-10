namespace Sahnem.Business.Interfaces
{
    // Framework'ten bağımsız tutmak için IFormFile yerine Stream kullanılıyor —
    // içerik tipi/boyut doğrulaması (HTTP'ye özgü kısım) API katmanındaki
    // controller'da yapılıyor, bu servis sadece diske yazmaktan sorumlu.
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(Stream content, string fileName, string subFolder);
    }
}
