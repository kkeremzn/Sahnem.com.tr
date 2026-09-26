using System.Text;
using System.Xml.Linq;
using Sahnem.Core.Enums;
using Sahnem.DataAccess.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Sahnem.API.Services
{
    // Daha önce hiç sitemap.xml yoktu — Vercel'in SPA fallback rewrite'ı
    // /sitemap.xml isteğini index.html'e düşürüyordu (bkz. SEO denetimi
    // Bulgu 1). Bu servis, frontend'in vercel.json'daki rewrite kuralıyla
    // (https://sahnem.com.tr/sitemap.xml -> bu uç) gerçek, güncel bir
    // sitemap üretir.
    //
    // Kapsam bilinçli olarak sınırlı: sadece herkese açık, gerçek içeriği
    // olan sayfalar (bkz. router.tsx sınıflandırması). İptal edilmiş ilanlar
    // ve askıya alınmış kullanıcıların profilleri dışarıda bırakılıyor —
    // bunlar zaten frontend'de noindex/"bulunamadı" olarak işaretleniyor.
    //
    // lastmod için BaseEntity'de ayrı bir "UpdatedDate" alanı yok, en yakın
    // gerçek sinyal CreatedDate — bu, "hiç güncellenmemiş" ilan/profiller
    // için doğru, ama içerik sonradan düzenlendiğinde lastmod bunu
    // yansıtmıyor. Bu bilinen bir sınırlama; ayrı bir "son güncelleme"
    // alanı eklenirse burası da ona geçmeli.
    public static class SitemapService
    {
        private const string Origin = "https://sahnem.com.tr";
        private static readonly XNamespace Ns = "http://www.sitemaps.org/schemas/sitemap/0.9";

        // Sabit, herkese açık sayfalar — içerikleri değiştiğinde bu tarih elle
        // güncellenmeli (her istekte "bugün" yazmak lastmod'u anlamsızlaştırır).
        private static readonly DateTime StaticPagesLastMod = new(2026, 9, 26, 0, 0, 0, DateTimeKind.Utc);

        private static readonly (string Path, string ChangeFreq)[] StaticPages =
        {
            ("/", "weekly"),
            ("/jobs", "daily"),
            ("/explore", "daily"),
            ("/about", "monthly"),
            ("/help", "monthly"),
            ("/kullanim-kosullari", "yearly"),
            ("/gizlilik-politikasi", "yearly"),
            ("/kvkk-aydinlatma-metni", "yearly"),
        };

        public static async Task<string> GenerateAsync(SahnemDbContext db)
        {
            var urlset = new XElement(Ns + "urlset");

            foreach (var (path, changeFreq) in StaticPages)
            {
                urlset.Add(BuildUrl(path, StaticPagesLastMod, changeFreq));
            }

            // Askıya alınmış (AppUser.IsActive == false) kullanıcıların profilleri
            // sitemap'e hiç girmiyor — sayfa kendisi şu an teknik olarak hâlâ
            // erişilebilir (ayrı bir ürün/güvenlik kararı, SEO denetimi Bulgu 6),
            // ama en azından Google'a "bunu tara" demiyoruz.
            var musicians = await db.MusicianProfiles
                .Where(m => m.IsActive)
                .Join(db.Users.Where(u => u.IsActive), m => m.AppUserId, u => u.Id, (m, _) => new { m.AppUserId, m.CreatedDate })
                .ToListAsync();
            foreach (var m in musicians)
            {
                urlset.Add(BuildUrl($"/musicians/{m.AppUserId}", m.CreatedDate, "monthly"));
            }

            var organizers = await db.OrganizerProfiles
                .Where(o => o.IsActive)
                .Join(db.Users.Where(u => u.IsActive), o => o.AppUserId, u => u.Id, (o, _) => new { o.AppUserId, o.CreatedDate })
                .ToListAsync();
            foreach (var o in organizers)
            {
                urlset.Add(BuildUrl($"/organizers/{o.AppUserId}", o.CreatedDate, "monthly"));
            }

            var venues = await db.VenueProfiles
                .Where(v => v.IsActive)
                .Join(db.Users.Where(u => u.IsActive), v => v.AppUserId, u => u.Id, (v, _) => new { v.AppUserId, v.CreatedDate })
                .ToListAsync();
            foreach (var v in venues)
            {
                urlset.Add(BuildUrl($"/venues/{v.AppUserId}", v.CreatedDate, "monthly"));
            }

            // Cancelled ilanlar frontend'de zaten "bulunamadı" + noindex —
            // sitemap'e hiç girmiyor. Open/Expired/Closed/Completed hepsi
            // gerçek, dolu içerik olduğu için dahil.
            var adverts = await db.Adverts
                .Where(a => a.Status != AdvertStatus.Cancelled)
                .Select(a => new { a.Id, a.CreatedDate })
                .ToListAsync();
            foreach (var a in adverts)
            {
                urlset.Add(BuildUrl($"/jobs/{a.Id}", a.CreatedDate, "weekly"));
            }

            var doc = new XDocument(new XDeclaration("1.0", "UTF-8", null), urlset);
            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private static XElement BuildUrl(string path, DateTime lastMod, string changeFreq)
        {
            return new XElement(Ns + "url",
                new XElement(Ns + "loc", $"{Origin}{path}"),
                new XElement(Ns + "lastmod", lastMod.ToString("yyyy-MM-dd")),
                new XElement(Ns + "changefreq", changeFreq));
        }
    }
}
