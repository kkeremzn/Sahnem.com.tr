namespace Sahnem.Business.Interfaces
{
    // Framework'ten bağımsız tutmak için IFormFile yerine Stream kullanılıyor —
    // içerik tipi/boyut doğrulaması (HTTP'ye özgü kısım) API katmanındaki
    // controller'da yapılıyor, bu servis sadece diske yazmaktan sorumlu.
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(Stream content, string fileName, string subFolder);
        Task DeleteFileAsync(string publicUrl);
        // R2'nin herkese açık pub-xxxx.r2.dev adresi reklam engelleyiciler/Chrome
        // Safe Browsing tarafından tutarsız şekilde engelleniyor (bkz. UploadController
        // GetFile) — bu yüzden dosyalar artık API üzerinden okunup istemciye
        // aktarılıyor (proxy). null dönerse dosya bulunamamış demektir.
        Task<(Stream Content, string ContentType)?> GetFileAsync(string key);
    }
}
