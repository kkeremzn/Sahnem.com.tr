using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using Sahnem.Business.Interfaces;
using Sahnem.Business.Storage;

namespace Sahnem.API.Services
{
    // Render'daki container diski ephemeral — her deploy'da sıfırlanıyor (canlıda
    // doğrulandı: önceki yüklenen avatarlar bir deploy sonrası 404 döndü). Bu
    // yüzden dosyalar artık Cloudflare R2'de (S3 uyumlu, kalıcı) tutuluyor.
    // IFileStorageService kontratı sabit kaldığı için controller'da değişiklik
    // gerekmedi.
    public class R2FileStorageService : IFileStorageService
    {
        private static readonly Dictionary<string, string> ContentTypesByExtension = new()
        {
            [".jpg"] = "image/jpeg",
            [".png"] = "image/png",
            [".webp"] = "image/webp",
            [".gif"] = "image/gif",
        };

        private readonly R2Settings _settings;
        private readonly AmazonS3Client _client;

        // AmazonS3Client her istekte YENİDEN oluşturuluyordu — bu pahalı bir işlem
        // (HTTP handler/credential/endpoint kurulumu) ve yüklemelerin gereksiz yere
        // yavaş hissettirmesinin asıl sebebiydi. Client artık DI ile tek seferlik
        // (singleton) kayıtlı, tüm yüklemeler aynı örneği paylaşıyor.
        public R2FileStorageService(IOptions<R2Settings> options)
        {
            _settings = options.Value;
            _client = new AmazonS3Client(_settings.AccessKey, _settings.SecretKey, new AmazonS3Config
            {
                ServiceURL = $"https://{_settings.AccountId}.r2.cloudflarestorage.com",
                ForcePathStyle = true,
                AuthenticationRegion = "auto",
                // AWS SDK v4, R2'nin desteklemediği bir trailing checksum'ı varsayılan
                // olarak her istekte gönderiyor — bu R2'ye giden PutObject'leri
                // sessizce başarısız ediyor, bu yüzden explicit olarak kapatıyoruz.
                RequestChecksumCalculation = RequestChecksumCalculation.WHEN_REQUIRED,
                ResponseChecksumValidation = ResponseChecksumValidation.WHEN_REQUIRED,
            });
        }

        public async Task<string> SaveFileAsync(Stream content, string fileName, string subFolder)
        {
            var extension = Path.GetExtension(fileName);
            var key = $"{subFolder}/{Guid.NewGuid():N}{extension}";

            var request = new PutObjectRequest
            {
                BucketName = _settings.Bucket,
                Key = key,
                InputStream = content,
                ContentType = ContentTypesByExtension.GetValueOrDefault(extension, "application/octet-stream"),
                AutoCloseStream = false,
                // AWS SDK'nın varsayılan streaming (chunked) SigV4 imzalamasını R2
                // desteklemiyor — "STREAMING-AWS4-HMAC-SHA256-PAYLOAD not implemented"
                // hatasıyla reddediyor. HTTPS üzerinden gittiğimiz için payload
                // imzalamayı kapatmak güvenli, standart tek-parça imzalamaya düşüyor.
                DisablePayloadSigning = true,
            };
            await _client.PutObjectAsync(request);

            return $"{_settings.PublicUrlBase.TrimEnd('/')}/{key}";
        }
    }
}
