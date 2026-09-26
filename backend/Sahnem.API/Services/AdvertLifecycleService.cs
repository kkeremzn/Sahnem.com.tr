using Sahnem.Business.Email;
using Sahnem.Business.Interfaces;
using Sahnem.Core.Entities;
using Sahnem.Core.Enums;
using Sahnem.Core.Interfaces;

namespace Sahnem.API.Services
{
    // Hiçbir yer ilanın son başvuru tarihi geçince durumunu güncellemiyordu —
    // ilan veritabanında sonsuza dek "Open" kalıyor, kimseye haber gitmiyordu.
    // Bu iş periyodik olarak üç şeyi yapar: (1) süresi dolmuş "Open" ilanları
    // "Expired"a çevirip ilan sahibine ve bekleyen teklifi olan müzisyenlere
    // durumu mail ve bildirimle haber verir, (2) etkinlik tarihi geçmiş
    // "Closed" (teklifi kabul edilmiş) ilanları arşiv amaçlı "Completed"a
    // taşır, (3) "Expired" durumdayken (ilan sahibi hiç seçim yapmadan)
    // etkinlik tarihi de geçen ilanlardaki bekleyen teklifleri otomatik
    // reddeder — etkinlik geçtikten sonra bir teklifi "kabul etmek" artık
    // anlamsız. İlanın durumu bilinçli olarak "Expired" kalır, ayrı bir
    // kategori eklenmez; kullanıcı zaten "Süresi Doldu" sekmesinde görür,
    // teklifler de artık gerçek durumunu (Reddedildi) yansıtır.
    // RegistrationCleanupService ile aynı iskelet.
    public class AdvertLifecycleService : BackgroundService
    {
        private static readonly TimeSpan RunInterval = TimeSpan.FromMinutes(30);
        private static readonly TimeSpan InitialDelay = TimeSpan.FromMinutes(2);

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<AdvertLifecycleService> _logger;

        public AdvertLifecycleService(IServiceScopeFactory scopeFactory, ILogger<AdvertLifecycleService> logger)
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
                    await ExpireOverdueAdverts(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Süresi dolmuş ilanları işlerken beklenmeyen hata.");
                }

                try
                {
                    await CompletePastEvents(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Etkinliği geçmiş ilanları tamamlanmış olarak işaretlerken beklenmeyen hata.");
                }

                try
                {
                    await LapseUnresolvedExpiredOffers(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Etkinliği geçmiş 'Expired' ilanlardaki bekleyen teklifleri kapatırken beklenmeyen hata.");
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

        private async Task ExpireOverdueAdverts(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var advertRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<Advert>>();
            var offerRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<Offer>>();
            var userRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<AppUser>>();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            var now = DateTime.UtcNow;
            var overdue = await advertRepository.WhereAsync(a => a.Status == AdvertStatus.Open && a.ApplicationDeadline < now);
            var overdueList = overdue.ToList();
            if (overdueList.Count == 0) return;

            _logger.LogInformation("{Count} ilanın başvuru süresi doldu, 'Expired' olarak işaretlenecek.", overdueList.Count);

            foreach (var advert in overdueList)
            {
                if (ct.IsCancellationRequested) break;
                try
                {
                    advert.Status = AdvertStatus.Expired;
                    await unitOfWork.SaveChanges();

                    var pendingOffers = (await offerRepository.WhereAsync(
                        o => o.AdvertId == advert.Id && o.OfferStatus == OfferStatus.Pending)).ToList();

                    var owner = await userRepository.GetByIdAsync(advert.CreatorId);

                    if (pendingOffers.Count > 0)
                    {
                        if (owner != null)
                        {
                            await notificationService.CreateNotification(
                                owner.Id,
                                "advert",
                                "İlanının başvuru süresi doldu",
                                $"\"{advert.Title}\" ilanının son başvuru tarihi geçti. {pendingOffers.Count} teklif aldın, birini seçebilirsin.",
                                $"/my-adverts/{advert.Id}");
                            await emailService.SendAsync(
                                owner.Email,
                                "İlanının Başvuru Süresi Doldu — Teklif Aldın",
                                EmailTemplates.AdvertExpiredWithOffers(owner.FirstName, advert.Title, pendingOffers.Count, advert.Id));
                        }

                        foreach (var offer in pendingOffers)
                        {
                            var musician = await userRepository.GetByIdAsync(offer.MusicianId);
                            if (musician == null) continue;
                            await notificationService.CreateNotification(
                                musician.Id,
                                "advert",
                                "Başvuru süresi sona erdi",
                                $"Teklif verdiğin \"{advert.Title}\" ilanının son başvuru tarihi geçti, teklifin hâlâ değerlendiriliyor.",
                                $"/offers/{offer.Id}");
                            await emailService.SendAsync(
                                musician.Email,
                                "Başvuru Süresi Sona Erdi — Teklifin İnceleniyor",
                                EmailTemplates.AdvertExpiredOfferPending(musician.FirstName, advert.Title));
                        }
                    }
                    else if (owner != null)
                    {
                        await notificationService.CreateNotification(
                            owner.Id,
                            "advert",
                            "İlanının başvuru süresi doldu",
                            $"\"{advert.Title}\" ilanının son başvuru tarihi geçti, teklif alamadın.",
                            $"/my-adverts/{advert.Id}");
                        await emailService.SendAsync(
                            owner.Email,
                            "İlanının Başvuru Süresi Doldu",
                            EmailTemplates.AdvertExpiredNoOffers(owner.FirstName, advert.Title));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "İlan süresi dolma işlemi başarısız (AdvertId={AdvertId}).", advert.Id);
                }
            }
        }

        private async Task CompletePastEvents(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var advertRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<Advert>>();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

            var now = DateTime.UtcNow;
            var pastEvents = await advertRepository.WhereAsync(a => a.Status == AdvertStatus.Closed && a.EventTime < now);
            var pastEventsList = pastEvents.ToList();
            if (pastEventsList.Count == 0) return;

            _logger.LogInformation("{Count} ilanın etkinliği geçti, 'Completed' olarak işaretlenecek.", pastEventsList.Count);

            foreach (var advert in pastEventsList)
            {
                if (ct.IsCancellationRequested) break;
                advert.Status = AdvertStatus.Completed;
            }
            await unitOfWork.SaveChanges();
        }

        private async Task LapseUnresolvedExpiredOffers(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var advertRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<Advert>>();
            var offerRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<Offer>>();
            var userRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<AppUser>>();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            var now = DateTime.UtcNow;
            var lapsedAdverts = await advertRepository.WhereAsync(a => a.Status == AdvertStatus.Expired && a.EventTime < now);
            var lapsedAdvertsList = lapsedAdverts.ToList();
            if (lapsedAdvertsList.Count == 0) return;

            foreach (var advert in lapsedAdvertsList)
            {
                if (ct.IsCancellationRequested) break;
                try
                {
                    var pendingOffers = (await offerRepository.WhereAsync(
                        o => o.AdvertId == advert.Id && o.OfferStatus == OfferStatus.Pending)).ToList();
                    if (pendingOffers.Count == 0) continue;

                    _logger.LogInformation(
                        "{Count} bekleyen teklif, ilanın etkinlik tarihi geçtiği için otomatik reddediliyor (AdvertId={AdvertId}).",
                        pendingOffers.Count, advert.Id);

                    foreach (var offer in pendingOffers)
                    {
                        offer.OfferStatus = OfferStatus.Rejected;
                    }
                    await unitOfWork.SaveChanges();

                    foreach (var offer in pendingOffers)
                    {
                        var musician = await userRepository.GetByIdAsync(offer.MusicianId);
                        if (musician == null) continue;
                        await notificationService.CreateNotification(
                            musician.Id,
                            "offer",
                            "Etkinlik tarihi geçti",
                            $"\"{advert.Title}\" ilanında ilan sahibi bir seçim yapmadan etkinlik tarihi geçti, teklifin artık değerlendirilemiyor.",
                            $"/offers/{offer.Id}");
                        await emailService.SendAsync(
                            musician.Email,
                            "Teklifin Hakkında Bir Güncelleme Var",
                            EmailTemplates.OfferLapsed(musician.FirstName, advert.Title));
                    }

                    var owner = await userRepository.GetByIdAsync(advert.CreatorId);
                    if (owner != null)
                    {
                        await notificationService.CreateNotification(
                            owner.Id,
                            "advert",
                            "İlanın süreci kapandı",
                            $"\"{advert.Title}\" ilanının etkinlik tarihi geçti, bekleyen teklifler otomatik kapatıldı.",
                            $"/my-adverts/{advert.Id}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Süresi geçmiş ilanın bekleyen teklifleri kapatılamadı (AdvertId={AdvertId}).", advert.Id);
                }
            }
        }
    }
}
