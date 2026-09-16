import { Container } from '@/components/ui/Container';
import { LegalHero } from '@/components/legal/LegalHero';
import { LegalProse } from '@/components/legal/LegalProse';

export function Privacy() {
  return (
    <div>
      <LegalHero title="Gizlilik Politikası" effectiveDate="16.09.2026" version="1.0" current="Gizlilik Politikası" />
      <Container className="max-w-3xl py-12">
        <LegalProse>
          <h2>1. Kapsam ve sorumlu işletmeci</h2>
          <p>
            Bu Politika, sahnem.com.tr üzerinden sunulan hizmetlerde kişisel verilerin kullanımını, görünürlüğünü ve
            kullanıcı tercihlerini açıklar. İşletmeci ve veri sorumlusu <strong>Sahnem</strong>, adresi{' '}
            <strong>İstanbul, Güngören</strong>, iletişim kanalı <strong>support@sahnem.com.tr</strong>'dir.
          </p>
          <p>
            İşleme amaçları, hukuki sebepler, alıcı grupları ve başvuru haklarının ayrıntıları KVKK Aydınlatma
            Metni'nde yer alır. Bu Politikanın okunması veya Platform'un kullanılması tek başına açık rıza oluşturmaz.
          </p>

          <h2>2. Hangi bilgiler kullanılır?</h2>
          <p>Hizmetin kullanılan bölümüne göre aşağıdaki bilgiler işlenir:</p>
          <ul>
            <li>Hesap açılışında ve yönetiminde: ad, soyadı, e-posta, telefon, hesap rolü, parola özeti, doğrulama bilgileri ve oturum kayıtları.</li>
            <li>Profilde: fotoğraf, açıklama, şehir, müzik türleri, enstrümanlar, deneyim, ücret beklentisi, çalışma tercihleri; mekân veya organizatörün adı ve faaliyet bilgileri; kullanıcının eklediği internet ve sosyal medya bağlantıları.</li>
            <li>İlan ve tekliflerde: etkinlik açıklaması, tarih, yer, bütçe, teklif tutarı, mesaj ve işlem durumu.</li>
            <li>İletişimde: Platform içi mesajlar, destek başvuruları, bildirimler ve bildirim tercihleri.</li>
            <li>Teknik kullanımda: hizmetin güvenliği ve çalışması için gereken IP adresi, istek zamanı, tarayıcı/cihaz bilgileri, oturum yenileme (refresh token) kaydı, hata ve erişim kayıtları.</li>
          </ul>
          <p>
            Gereksiz kimlik belgesi, sağlık bilgisi veya diğer hassas veriler profil ve mesaj alanlarına
            yüklenmemelidir.
          </p>

          <h2>3. Görünürlük ve mesajların gizliliği</h2>
          <p>
            Herkese açık olarak yayımladığınız profil ve ilan bilgileri, Platform'u ziyaret eden kişilerce görülebilir
            ve arama motorlarınca indekslenebilir. Kullanıcılar bu alanlara ev adresi veya üçüncü kişilere ait özel
            bilgiler gibi paylaşmak istemedikleri içerikleri eklememelidir. Kamuya açıklık, başkalarına sınırsız veri
            işleme hakkı vermez.
          </p>
          <p>
            Hesap e-postası, hesap telefonu, parola bilgisi ve oturum belirteçleri herkese açık profil alanları olarak
            yayımlanmaz. Kullanıcının bu bilgileri kendi isteğiyle açık metin alanına yazması ayrı bir paylaşım
            oluşturur.
          </p>
          <p>
            Platform içi mesajlar genel ziyaretçilere açık değildir. Bununla birlikte mesajlaşma hizmeti uçtan uca
            şifreli özel haberleşme hizmeti olarak sunulmamaktadır. Teknik destek, şikâyet incelemesi, güvenlik veya
            hukuki yükümlülük için gerekli hâllerde yetkilendirilmiş kişiler, amaçla sınırlı erişim sağlayabilir. Mesaj
            içerikleri bu amaçlar dışında keyfî olarak incelenmez.
          </p>

          <h2>4. Kullanım amaçları</h2>
          <p>
            Bilgiler; üyelik ve oturum yönetimi, profil ve ilan yayımlama, teklif ve iletişim süreçlerini yürütme,
            tercih edilen bildirimleri gönderme, destek sağlama, kötüye kullanımı önleme ve kanuni yükümlülükleri
            yerine getirme amacıyla kullanılır. Her bir faaliyetin hukuki dayanağı KVKK Aydınlatma Metni'nde
            açıklanır.
          </p>
          <p>
            Kullanıcıların bilgileri ilgisiz amaçlarla sınırsız kullanıma açılmaz. Yeni bir işleme amacı gündeme
            geldiğinde gerekli bilgilendirme yapılır ve gerekiyorsa ayrıca açık rıza alınır.
          </p>

          <h2>5. Çerezler ve benzeri teknolojiler</h2>
          <p>
            Oturumun sürdürülmesi ve hizmetin güvenli çalışması için gerekli çerezler veya benzeri tarayıcı depolama
            araçları kullanılır. Platformda şu anda analitik, reklam veya pazarlama amaçlı bir izleme aracı
            bulunmamaktadır; kullanılan tüm çerez ve depolama kayıtları hizmetin çalışması için zorunludur.
          </p>

          <h2>6. Hizmet sağlayıcılar ve yurt dışı işlemler</h2>
          <p>
            Sahnem; site ve uygulama barındırma, veritabanı, dosya depolama ve e-posta hizmetleri için hizmet
            sağlayıcılardan yararlanır (Vercel, Render, Cloudflare R2, Zoho Mail). Paylaşım, ilgili hizmet için
            gerekli veriyle sınırlandırılır.
          </p>
          <p>
            Bu sağlayıcıların bir kısmı yurt dışında depolama, işleme veya erişim içerir; bu durumda KVKK'nın yurt
            dışı aktarım hükümleri ayrıca uygulanır. Sağlayıcılar, veri kategorileri, ülkeler ve aktarım mekanizması
            KVKK Aydınlatma Metni'nin aktarım tablosunda belirtilir. Bu Politika, tek başına yurt dışına aktarım izni
            veya güvencesi oluşturmaz.
          </p>

          <h2>7. Saklama, hesap silme ve güvenlik</h2>
          <p>
            Veriler, toplandıkları amaç için gerekli süre boyunca tutulur; amaç sona erdiğinde silinir veya yok
            edilir. Saklama süreleri KVKK Aydınlatma Metni'nde yer alır.
          </p>
          <p>
            Hesabınızı sildiğinizde; profiliniz, ilanlarınız, tekliflerinizi, mesajlarınız, favorileriniz,
            bildirimleriniz, oturum kayıtlarınız ve profil fotoğrafınız veritabanından ve dosya deposundan kalıcı
            olarak silinir. Barındırma sağlayıcısının otomatik yedekleme döngüsü kapsamında tutulan kopyalar,
            sağlayıcının kendi teknik döngüsüne göre daha sonra temizlenir; bu döngü Sahnem'in doğrudan kontrolünde
            değildir. Bir hakkın korunması veya hukuki yükümlülük nedeniyle tutulması gereken kayıtlar varsa, bunlar
            ayrı amaçla ve sınırlı erişimle saklanır; pazarlama için kullanılmaz.
          </p>
          <p>
            Yetkisiz erişim ve hukuka aykırı işlemeyi önlemek için riskle orantılı teknik ve idari tedbirler alınır
            (ör. oturum belirteçlerinin yalnızca HttpOnly çerezlerde tutulması, böylece tarayıcıda çalışan bir
            komut dosyasının bu belirteçlere erişememesi). Hiçbir internet hizmeti için mutlak güvenlik garantisi
            verilemez. Parola ve doğrulama kodlarınızı paylaşmamanız, hesabınızın güvenliğine katkı sağlar.
          </p>

          <h2>8. Bildirim tercihleri ve dış bağlantılar</h2>
          <p>
            Hesap doğrulama, şifre kurtarma ve gerekli işlem bildirimleri (yeni mesaj, teklif, ilan durumu vb.)
            hizmetin yürütülmesi amacıyla e-posta ile gönderilir. Platformda şu an ayrı bir reklam/kampanya iletisi
            gönderilmemektedir; böyle bir süreç başlatılırsa gerekli izinler ve ret imkânı ayrıca sağlanır.
          </p>
          <p>
            Dış sosyal medya veya internet bağlantısına tıkladığınızda ilgili sağlayıcının koşulları uygulanır.
          </p>

          <h2>9. Haklar ve değişiklikler</h2>
          <p>
            Verilerinize ilişkin erişim, düzeltme, silme ve diğer taleplerinizi KVKK Aydınlatma Metni'nde açıklanan
            kanallardan iletebilirsiniz. Açık rızaya dayalı işlemler bakımından rızanızı ileriye etkili olarak geri
            alabilirsiniz.
          </p>
          <p>
            Bu Politika güncellendiğinde sürüm ve yürürlük tarihi değiştirilir. Önemli değişiklikler uygun kanallarla
            duyurulur. Yeni bir metin yayımlanması, daha önce verilmemiş açık rızanın verildiği anlamına gelmez.
          </p>
        </LegalProse>
      </Container>
    </div>
  );
}
