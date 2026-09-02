using Sahnem.Business.Interfaces;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;

namespace Sahnem.API.Services
{
    // Kayıt olup e-posta doğrulamasını hiç bitirmeden terk edilen hesaplar (rol
    // yok, profil yok, kalıcı bir kimlik anlamı yok) veritabanında sonsuza kadar
    // birikmesin diye periyodik olarak temizleniyor. 48 saatlik bir bekleme
    // payı bırakılıyor — kodu almakta gecikip yarım bırakan gerçek bir
    // kullanıcının hesabı erken silinmesin diye.
    public class RegistrationCleanupService : BackgroundService
    {
        private static readonly TimeSpan GracePeriod = TimeSpan.FromHours(48);
        private static readonly TimeSpan RunInterval = TimeSpan.FromHours(6);
        private static readonly TimeSpan InitialDelay = TimeSpan.FromMinutes(5);

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<RegistrationCleanupService> _logger;

        public RegistrationCleanupService(IServiceScopeFactory scopeFactory, ILogger<RegistrationCleanupService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                await Task.Delay(InitialDelay, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                return;
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupAbandonedSignups(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Yarım kalan kayıt temizliği sırasında beklenmeyen hata.");
                }

                try
                {
                    await Task.Delay(RunInterval, stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    return;
                }
            }
        }

        private async Task CleanupAbandonedSignups(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var userRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<AppUser>>();
            var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

            var cutoff = DateTime.UtcNow - GracePeriod;
            // Profili tamamlanmış hesaplar ASLA silinmez, e-posta doğrulaması bu
            // özellik eklenmeden önce hesap açmış gerçek kullanıcılarda hâlâ
            // false olabilir — gerçek "terk edilmiş" bir kayıt hem doğrulanmamış
            // HEM profili hiç oluşturulmamış olmalı.
            var abandoned = await userRepository.WhereAsync(
                u => !u.IsEmailConfirmed && !u.IsProfileCompleted && u.CreatedDate < cutoff);
            var abandonedList = abandoned.ToList();

            if (abandonedList.Count == 0) return;

            _logger.LogInformation("{Count} adet yarım kalan kayıt temizlenecek.", abandonedList.Count);

            foreach (var user in abandonedList)
            {
                if (ct.IsCancellationRequested) break;
                try
                {
                    await userService.AdminDeleteUser(user.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Yarım kalan kayıt silinemedi (Id={UserId}, Email={Email}).", user.Id, user.Email);
                }
            }
        }
    }
}
