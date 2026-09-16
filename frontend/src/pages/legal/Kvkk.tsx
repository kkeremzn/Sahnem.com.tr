import { Container } from '@/components/ui/Container';
import { LegalHero } from '@/components/legal/LegalHero';
import { LegalProse, LegalTable } from '@/components/legal/LegalProse';

export function Kvkk() {
  return (
    <div>
      <LegalHero title="KVKK Aydınlatma Metni" effectiveDate="16.09.2026" version="1.0" current="KVKK Aydınlatma Metni" />
      <Container className="max-w-3xl py-12">
        <LegalProse>
          <h2>1. Veri sorumlusu ve kapsam</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") uyarınca, sahnem.com.tr hizmetleri kapsamında
            kişisel verilerinizin işlenmesi hakkında sizi bilgilendiriyoruz.
          </p>
          <p>
            <strong>Veri sorumlusu:</strong> Sahnem
            <br />
            <strong>Adres:</strong> İstanbul, Güngören
            <br />
            <strong>Başvuru e-postası:</strong> support@sahnem.com.tr
          </p>
          <p>
            Bu metin; ziyaretçiler, üyeler, müzisyenler, mekân/organizatör temsilcileri ve destek kanallarını
            kullanan kişiler için geçerlidir.
          </p>

          <h2>2. Toplama yöntemi</h2>
          <p>
            Veriler; kayıt, giriş ve profil formları, ilan ve teklif ekranları, Platform mesajlaşması, hesap
            tercihleri, destek e-postaları ve internet sitesinin kullanımında oluşan teknik kayıtlar aracılığıyla
            elektronik ortamda otomatik veya kısmen otomatik yollarla toplanır.
          </p>
          <p>
            Diğer kullanıcılar, sizinle ilişkili bir teklif, mesaj veya şikâyet iletebilir. Bu yolla alınan veriler,
            yalnızca ilgili işlemin değerlendirilmesi için gerekli ölçüde kullanılır.
          </p>

          <h2>3. Amaç ve hukuki sebep eşleştirmesi</h2>
          <p>
            Aşağıdaki hukuki sebepler yalnızca ilgili amaç için gerekli veri ve faaliyet kapsamında uygulanır;
            birbirinin yerine kullanılabilecek genel izinler değildir.
          </p>
          <LegalTable
            head={['Süreç / veri kategorisi', 'İşleme amacı', 'Hukuki sebep']}
            rows={[
              ['Üyelik: ad-soyadı, hesap iletişim bilgileri, rol, parola özeti, doğrulama ve oturum bilgileri', 'Hesabı oluşturmak, erişimi doğrulamak, üyelik hizmetini sunmak', 'Sözleşmenin kurulması veya ifası için gereklilik (m.5/2-c)'],
              ['Profil: fotoğraf, açıklama, şehir, mesleki bilgiler, çalışma ve ücret tercihleri, seçilen bağlantılar', "Kullanıcının talep ettiği profil hizmetini ve seçtiği kamuya açık tanıtımı sağlamak", 'Hizmetin ifası için gerekli kapsamda m.5/2-c'],
              ['İlan/teklif: tarih, yer, bütçe, açıklama, fiyat, durum ve taraf bilgileri', 'İlanı yayımlamak, teklifleri iletmek ve kullanıcıların işlem sürecini yürütmek', 'm.5/2-c'],
              ['Mesaj, favori, bildirim ve tercih kayıtları', 'Talep edilen iletişim, kayıt ve bildirim işlevlerini sağlamak', 'Hizmet için gerekli kapsamda m.5/2-c'],
              ['IP, istek zamanı, oturum ve güvenlik/hata kayıtları', 'Yetkisiz erişimi ve kötüye kullanımı tespit etmek, hizmeti güvenli işletmek', 'Meşru menfaat (m.5/2-f)'],
              ['Destek ve şikâyet içeriği, ilgili hesap/işlem verileri', 'Üyelik hizmetindeki sorunları çözmek', 'Sözleşmeyle ilgili taleplerde m.5/2-c; üye olmayanların başvurularında m.5/2-f'],
              ['Uyuşmazlıkla ilgili yazışma ve işlem kayıtları', 'Hukuki talepleri değerlendirmek, bir hakkı tesis etmek, kullanmak veya korumak', 'Somut uyuşmazlıkla sınırlı m.5/2-e'],
              ['Başvuru kimliği, talep ve cevap kayıtları', 'Kanuni ilgili kişi başvurularını karşılamak ve yükümlülüğü ispatlamak', 'Hukuki yükümlülük için gereklilik (m.5/2-ç)'],
            ]}
          />
          <p>
            Hizmet için gerekli bilgilerin verilmemesi hâlinde ilgili işlev sunulamayabilir. Platform, özel nitelikli
            kişisel veri toplamayı amaçlayan bir hizmet değildir; serbest metin veya görsellerde bu tür verilerin
            paylaşılmaması istenir. Şu anda platformda pazarlama/bülten amaçlı bir işleme veya analitik/reklam
            tanımlayıcısı kullanılmamaktadır; böyle bir süreç başlatılırsa bu bölüm ayrı açık rıza alınarak
            güncellenir.
          </p>

          <h2>4. Alıcı grupları ve aktarım amaçları</h2>
          <LegalTable
            head={['Alıcı grubu', 'Paylaşılan veri kapsamı', 'Aktarım amacı']}
            rows={[
              ['Platform ziyaretçileri', 'Kullanıcının kamuya yayımladığı profil ve ilan alanları', 'Profil/ilanın görüntülenmesi ve talep edilen tanıtım'],
              ['İlgili teklif/mesaj tarafları', 'İlgili profil bilgileri, teklif ve karşılıklı mesajlar', 'Teklif değerlendirme ve kullanıcılar arası iletişim'],
              ['Site/uygulama ve veritabanı altyapı sağlayıcısı (Render)', 'Hizmetin barındırılması için gerekli kayıtlar ve teknik veriler', 'Hizmetin çalışması, depolama ve teknik işletim'],
              ['Ön yüz barındırma sağlayıcısı (Vercel)', 'Ziyaretçi IP adresi, istek ve erişim kayıtları', 'Web sitesinin sunulması'],
              ['Dosya depolama ve içerik dağıtım sağlayıcısı (Cloudflare R2)', 'Yüklenen profil görselleri ve gerekli erişim verileri', 'Görselleri saklamak ve sunmak'],
              ['E-posta sağlayıcısı (Zoho Mail)', 'Alıcı adresi, gerekli ad bilgisi, e-posta içeriği ve gönderim kayıtları', 'İşlemsel bildirimleri iletmek'],
              ['Yetkili hukuk danışmanları', 'Somut talep/uyuşmazlık için gerekli kayıtlar', 'Hukuki destek ve hakların korunması'],
              ['Yetkili kamu kurumları ve yargı mercileri', 'Hukuka uygun talebin gerektirdiği veriler', 'Kanuni yükümlülükleri yerine getirmek'],
            ]}
          />

          <h2>5. Yurt dışına veri aktarımı</h2>
          <p>
            Hizmet sağlayıcılarının bir kısmı yurt dışında yerleşiktir; bu sağlayıcıların sistemleri veya yurt
            dışından erişimleri üzerinden veri işlenmesi hâlinde Kanun'un 9. maddesindeki şartlar uygulanır. Aşağıdaki
            tablo, kullanılan altyapı sağlayıcılarını ve genel aktarım kapsamını gösterir.
          </p>
          <LegalTable
            head={['Sağlayıcı', 'Hizmet / veri kategorileri', 'İşleme ülkeleri', 'Aktarım mekanizması']}
            rows={[
              ['Vercel Inc.', 'Ön yüz (web arayüzü) barındırma; ziyaretçi IP adresi, tarayıcı/cihaz bilgisi, istek kayıtları', 'ABD merkezli sağlayıcı, küresel içerik dağıtım ağı', "Sağlayıcının kendi veri işleme sözleşmesi (DPA) kapsamında, KVKK m.9 çerçevesinde değerlendirilir"],
              ['Render Services, Inc.', 'API (backend) barındırma ve yönetilen PostgreSQL veritabanı; hesap, profil, ilan, teklif ve mesaj kayıtları', 'ABD merkezli sağlayıcı altyapısı', "Sağlayıcının kendi veri işleme sözleşmesi (DPA) kapsamında, KVKK m.9 çerçevesinde değerlendirilir"],
              ['Cloudflare, Inc. (R2)', 'Profil fotoğrafları ve yüklenen görseller', "Cloudflare'in küresel içerik dağıtım ağı", "Sağlayıcının kendi veri işleme sözleşmesi (DPA) kapsamında, KVKK m.9 çerçevesinde değerlendirilir"],
              ['Zoho Corporation (Zoho Mail, AB bölgesi)', 'Alıcı e-posta adresi, e-posta içeriği ve gönderim kayıtları', 'Avrupa Birliği (Zoho AB veri merkezi)', "Sağlayıcının kendi veri işleme sözleşmesi (DPA) kapsamında, KVKK m.9 çerçevesinde değerlendirilir"],
              ['Google LLC (Google Fonts)', 'Sayfa görüntülenirken yazı tipi dosyası talebiyle iletilen ziyaretçi IP adresi', 'ABD merkezli küresel altyapı', "Sağlayıcının kendi veri işleme sözleşmesi (DPA) kapsamında, KVKK m.9 çerçevesinde değerlendirilir"],
            ]}
          />
          <p>
            Bu tablo, kullanılan sağlayıcıları ve genel aktarım kapsamını gösterir; her sağlayıcı için somut sözleşme
            mekanizmasının (standart sözleşme, yeterlilik kararı vb.) ayrıntılı teyidi devam eden bir süreçtir. "AB
            veri merkezi" kullanılması tek başına Türkiye bakımından yurt dışı aktarım değerlendirmesini ortadan
            kaldırmaz.
          </p>

          <h2>6. Saklama ve imha</h2>
          <p>
            Veriler işleme amacıyla bağlantılı, sınırlı ve ölçülü süre boyunca tutulur. Amaç ve hukuki sebep ortadan
            kalktığında Kanun ve ilgili imha düzenlemeleri çerçevesinde işlem yapılır.
          </p>
          <LegalTable
            head={['Kayıt grubu', 'Süre / başlangıç olayı', 'İmha veya sınırlı saklama ölçütü']}
            rows={[
              ['Hesap ve profil', 'Üyelik süresince', 'Hesap silme talebinde tüm ilişkili kayıtlarla birlikte anında ve kalıcı olarak silinir'],
              ['İlan, teklif, mesaj, favori, bildirim', 'Hesap aktif olduğu sürece', 'Hesap silindiğinde birlikte kalıcı olarak silinir'],
              ['Oturum/doğrulama (refresh token) kayıtları', 'Giriş anından itibaren', 'Kullanıcı hesabında 30 gün, yönetici hesabında 14 gün geçerlilik; süre dolduğunda veya çıkış yapıldığında geçersizleşir'],
              ['Güvenlik ve erişim kayıtları', 'Barındırma sağlayıcısının standart log tutma süresi', 'Kötüye kullanım şüphesi varsa gerekli süre kadar ayrıca saklanabilir'],
              ['Destek, başvuru ve uyuşmazlık yazışmaları', 'Başvuru/talep tarihinden itibaren', 'Talebin sonuçlandırılması ve gerektiğinde ispat için makul süre boyunca saklanır'],
              ['Yedekler', "Barındırma sağlayıcısının (Render) otomatik yedekleme döngüsü", 'Döngü sonunda imha edilir; bu süreç Sahnem\'in doğrudan kontrolünde değildir'],
            ]}
          />

          <h2>7. Kanun kapsamındaki haklarınız</h2>
          <p>
            Kanun'un 11. maddesi uyarınca verilerinizin işlenip işlenmediğini öğrenebilir; işlenmişse bilgi
            isteyebilir; amacı ve amacına uygun kullanımı sorgulayabilirsiniz. Yurt içi/yurt dışı alıcıları öğrenme,
            eksik veya yanlış verileri düzelttirme, Kanun'un 7. maddesindeki şartlarla silme/yok etme ve bu
            işlemlerin alıcılara bildirilmesini isteme haklarınız vardır. Münhasıran otomatik analizle aleyhinize
            oluşan sonuca itiraz edebilir, hukuka aykırı işlemeden doğan zararınızın giderilmesini talep
            edebilirsiniz.
          </p>

          <h2>8. Başvuru yöntemi ve cevap</h2>
          <p>Başvurunuzu aşağıdaki yöntemlerle iletebilirsiniz:</p>
          <ul>
            <li>support@sahnem.com.tr adresine, daha önce Sahnem'e bildirdiğiniz ve sistemde kayıtlı bulunan e-posta adresinizden başvuru (önerilen ve birincil kanal).</li>
            <li>İstanbul, Güngören adresine yazılı başvuru.</li>
          </ul>
          <p>
            Başvuruda ad-soyadı, yazılı başvuruda imza, Türk vatandaşları için T.C. kimlik numarası; yabancılar için
            uyruğu ve pasaport numarası veya varsa kimlik numarası; tebligata esas yerleşim yeri/iş yeri adresi, varsa
            bildirim e-postası, telefon/faks ve talep konusu bulunmalıdır. Konuyla ilgili belgeler eklenebilir. Bu
            bilgiler güvenli başvuru kanalı üzerinden iletilmeli; herkese açık alanlara yazılmamalıdır. Standart
            olarak tam kimlik fotokopisi talep edilmez; ek doğrulama gerekiyorsa ölçülü bilgi istenir.
          </p>
          <p>
            Talepler, niteliğine göre mümkün olan en kısa sürede ve en geç otuz gün içinde cevaplandırılır. İşlem
            kural olarak ücretsizdir; ayrıca maliyet doğarsa Kurulun belirlediği tarifedeki ücret uygulanabilir. Veri
            sorumlusunun hatasından kaynaklanan başvuruda alınan ücret iade edilir. Kabul veya gerekçeli ret cevabı
            yazılı ya da elektronik olarak bildirilir.
          </p>
          <p>
            Başvurunun reddi, yetersiz cevap veya süresinde cevap verilmemesi hâlinde Kanun'un 14. maddesindeki şart
            ve sürelerle Kurula şikâyet hakkınız vardır. Süresinde cevap verilmişse cevabı öğrenmeden itibaren otuz
            günlük; cevap verilmemişse başvurudan itibaren altmış günlük şikâyet süresi gözetilir. Geç cevap, geçmiş
            şikâyet süresini yeniden başlatmaz. Diğer kanuni haklarınız saklıdır.
          </p>

          <h2>9. Aydınlatma ve açık rıza ayrımı</h2>
          <p>
            Bu metin bilgilendirme amacıyla hazırlanmıştır. Üyeliğin veya metnin onaylanması, bütün kişisel veri
            işlemlerine açık rıza verildiği anlamına gelmez. Açık rıza gereken belirli işlemler için amaç ve kapsam
            ayrı açıklanır; rıza özgür iradeyle ve diğer işlemlerden ayrıştırılarak alınır. Rızanın geri alınması,
            geri alma öncesindeki hukuka uygun işlemeyi geriye dönük etkilemez.
          </p>
        </LegalProse>
      </Container>
    </div>
  );
}
