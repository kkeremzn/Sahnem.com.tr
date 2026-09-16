import { Container } from '@/components/ui/Container';
import { LegalHero } from '@/components/legal/LegalHero';
import { LegalProse } from '@/components/legal/LegalProse';

export function Terms() {
  return (
    <div>
      <LegalHero title="Kullanım Koşulları" effectiveDate="16.09.2026" version="1.0" current="Kullanım Koşulları" />
      <Container className="max-w-3xl py-12">
        <LegalProse>
          <h2>1. İşletmeci ve kapsam</h2>
          <p>
            Bu Kullanım Koşulları, sahnem.com.tr internet sitesi ve bu site üzerinden sunulan hizmetlerden
            yararlanılmasına ilişkin esasları düzenler.
          </p>
          <p>
            <strong>Platform işletmecisi:</strong> Sahnem
            <br />
            <strong>Tebligat/iş adresi:</strong> İstanbul, Güngören
            <br />
            <strong>İletişim:</strong> support@sahnem.com.tr
          </p>
          <p>
            Bu metinde işletmeci "Sahnem", hizmetlerin sunulduğu internet sitesi "Platform", Platform'u ziyaret eden
            veya üye olarak kullanan kişi "Kullanıcı", üyelik hesabı oluşturan kişi "Üye" olarak anılır. Bir işletme
            adına işlem yapan kişi, ilgili işletmeyi temsil yetkisine sahip olmalıdır.
          </p>
          <p>
            Koşullar, üyelik oluşturulmadan önce erişilebilir şekilde sunulur ve üyelik sözleşmesi kullanıcının kabul
            işlemiyle kurulur. Ziyaretçiler bakımından uygulanabilir kullanım kuralları ve kanuni yükümlülükler
            geçerlidir. Gizlilik Politikası ve KVKK Aydınlatma Metni ayrı bilgilendirme belgeleridir; bu Koşulların
            kabulü, kişisel veri işlemeye veya ticari ileti almaya genel açık rıza anlamına gelmez.
          </p>

          <h2>2. Hizmetin niteliği</h2>
          <p>
            Sahnem; müzisyenlerin, mekânların ve organizatörlerin profil oluşturmasına, ilan yayımlamasına, ilanları
            incelemesine, teklif iletmesine ve iletişim kurmasına teknik ortam sağlar.
          </p>
          <p>
            Sahnem'in açıkça kendi adına taraf olduğu işlemler dışında, performans veya etkinlik hizmetine ilişkin
            anlaşmalar ilgili kullanıcılar arasında kurulur. Platformdaki bir ilan ya da teklif, tek başına Sahnem'in
            o etkinliğin düzenleyicisi, işvereni, sanatçı temsilcisi veya ödeme garantörü olduğu anlamına gelmez.
            İlişkinin hukuki niteliği, tarafların fiilî faaliyetleri ve emredici mevzuata göre belirlenir.
          </p>
          <p>
            İnternet sitesindeki ilanlar; belirli bir iş, gelir, teklif sayısı, performans kalitesi veya etkinliğin
            gerçekleşeceğine ilişkin Sahnem garantisi oluşturmaz. Sahnem'in kendi hizmetinden ve kanundan doğan
            sorumlulukları saklıdır.
          </p>

          <h2>3. Üyelik ve hesap güvenliği</h2>
          <p>
            Üyelik, 18 yaşını doldurmuş ve sözleşme yapma ehliyetine sahip kişiler içindir. Kurumsal hesaplar, yetkili
            temsilci tarafından yönetilir. Kullanıcı; hesap ve profil bilgilerinin doğru, güncel ve kullanmaya yetkili
            olduğu bilgilerden oluşmasını sağlar.
          </p>
          <p>
            E-posta doğrulaması, ilgili e-posta adresine erişimi doğrulamaya yöneliktir; kişinin kimliğinin, mesleki
            yeterliliğinin, vergi durumunun veya temsil yetkisinin onaylandığı anlamına gelmez. Başka bir doğrulama
            işareti sunulursa kapsamı ayrıca açıklanır.
          </p>
          <p>
            Üye, şifresini ve doğrulama kodlarını üçüncü kişilerle paylaşmamalı; yetkisiz erişim şüphesini
            gecikmeden support@sahnem.com.tr adresine bildirmelidir. Kullanıcı, hesabından gerçekleşen her işlemden
            kusurundan bağımsız ve sınırsız biçimde sorumlu tutulmaz; sorumluluk somut olay ve mevzuata göre
            belirlenir.
          </p>
          <p>
            Başkasını taklit eden hesaplar, yanıltıcı kimlik bilgileri ve uygulanan kısıtlamaları aşmak amacıyla
            oluşturulan hesaplar yasaktır.
          </p>

          <h2>4. Profiller, ilanlar ve teklifler</h2>
          <p>
            Üye; profil açıklaması, görseller, sosyal medya bağlantıları, mesleki bilgiler ve ilan içeriklerinin
            hukuka uygunluğundan ve bunları paylaşma yetkisinden sorumludur. Başkasına ait kişisel bilgileri,
            görselleri veya iletişim bilgilerini hukuki dayanak olmadan yayımlayamaz.
          </p>
          <p>
            İlan sahibi; etkinliğin tarihini, yerini, beklenen hizmeti, bütçesini ve diğer önemli koşullarını gerçeğe
            uygun şekilde açıklar. Müzisyen; yetkinliğini, müsaitliğini ve teklif koşullarını yanıltıcı olmadan
            belirtir. Önemli değişiklikler karşı tarafa zamanında bildirilir.
          </p>
          <p>
            Teklifin Platform'da kabul edilmesinin hukuki sonucu; teklifin içeriği, tarafların iradeleri ve
            uygulanabilir hukuk çerçevesinde değerlendirilir. Tarafların, işe başlamadan önce en azından ücret, ödeme
            zamanı, performans süresi, ekipman, ulaşım, iptal ve erteleme koşullarını yazılı olarak netleştirmeleri
            önerilir. Platformdaki kabul işlemi, ödemenin yapıldığı veya hizmetin tamamlandığı anlamına gelmez.
          </p>
          <p>
            Gerekli etkinlik izinleri, eser kullanım izinleri, mesleki yükümlülükler, vergi ve sosyal güvenlik
            işlemleri ilgili mevzuatın yükümlü tuttuğu tarafça yerine getirilir. Taraflar, aralarındaki sözleşmeyle
            üçüncü kişilerin veya kamu kurumlarının haklarını ortadan kaldıramaz.
          </p>

          <h2>5. Ücret, ödeme, iptal ve iade</h2>
          <p>
            Mevcut hizmet modelinde, kullanıcılar arasındaki performans/etkinlik hizmet bedeli Platform tarafından
            tahsil edilmez; ödeme taraflar arasında doğrudan düzenlenir. Sahnem, bu ödemeler için emanet hesap veya
            ödeme güvencesi sağlamaz. Kullanıcılar, banka ve kart bilgilerini herkese açık alanlarda paylaşmamalıdır.
          </p>
          <p>
            Sahnem'in kendi hizmeti için ücret uygulanması hâlinde kapsam, toplam fiyat, vergiler, yenileme, iptal ve
            varsa iade koşulları işlemden önce ayrıca açıklanır. Kullanıcının ayrıca onaylamadığı bir ücretli hizmet
            veya otomatik yenileme yükümlülüğü yalnızca bu metne dayanılarak başlatılmaz.
          </p>
          <p>
            Etkinlik iptali, erteleme, eksik ifa ve kullanıcılar arasındaki bedel iadesi, tarafların anlaşması ve
            uygulanabilir mevzuat kapsamında ele alınır. Tüketici sıfatını taşıyan kullanıcıların emredici hakları
            saklıdır; bu metin her durumda iade yapılamayacağı veya cayma hakkı bulunmadığı anlamına gelmez.
          </p>

          <h2>6. Yasak kullanımlar</h2>
          <p>Aşağıdaki eylemlere izin verilmez:</p>
          <ul>
            <li>Dolandırıcılık, sahte ilan veya teklif, yanıltıcı temsil, hukuka aykırı ayrımcılık, tehdit, taciz veya hak ihlali.</li>
            <li>İstenmeyen toplu mesajlar, kimlik avı bağlantıları ve kullanıcıları yanıltarak para ya da doğrulama kodu istemek.</li>
            <li>Başkasının hesabına, özel mesajına veya dosyasına izinsiz erişmek; yetki kontrollerini aşmak; verileri değiştirmek veya silmek.</li>
            <li>Hizmeti aksatacak trafik, zararlı dosya veya otomasyon üretmek; teknik sınırları dolanmak.</li>
            <li>Kullanıcı verilerini izinsiz toplu toplamak, satmak veya kullanıcıların makul beklentileri dışında pazarlama amacıyla kullanmak.</li>
            <li>Telif hakkı, marka, kişilik hakkı veya özel hayatı ihlal eden içerikler paylaşmak.</li>
          </ul>
          <p>
            Güvenlik açığı bildirimleri support@sahnem.com.tr adresine iletilebilir. Bu hüküm, üçüncü kişi verilerine
            erişme veya canlı sistemde zarar verici test yapma izni değildir.
          </p>

          <h2>7. İçerik hakları ve kullanım izni</h2>
          <p>
            Kullanıcıların yüklediği içerikler üzerindeki haklar kullanıcıda veya ilgili hak sahibinde kalır.
            Kullanıcı, Platform'a yüklediği içeriğin hizmetin sunulması amacıyla saklanması, teknik olarak
            biçimlendirilmesi ve seçtiği görünürlük kapsamında gösterilmesi için Sahnem'e münhasır olmayan ve bu
            amaçla sınırlı kullanım izni verir. Altyapı sağlayıcılarının teknik işlemleri de yalnızca bu kapsamda
            yürütülür.
          </p>
          <p>
            Bu izin, kullanıcının fotoğrafının veya performans kaydının Sahnem'in sosyal medya reklamlarında sınırsız
            kullanılmasını kapsamaz. Hizmetin sunulması dışında tanıtım kullanımı için gerekli izinler ayrıca alınır.
          </p>
          <p>
            İçerik silindiğinde veya hesap kapatıldığında kamuya gösterim sonlandırılır. Hukuki yükümlülük, hakların
            korunması ve teknik yedeklerin yönetimi kapsamında gerekli sınırlı saklama, kişisel veri belgelerinde
            açıklanan esaslara tabidir.
          </p>
          <p>
            Sahnem'in marka, yazılım ve tasarım hakları ilgili hak sahiplerine aittir. Bu Koşullar kullanıcıya
            Platform'u amacına uygun kullanma dışında mülkiyet veya genel çoğaltma hakkı vermez.
          </p>

          <h2>8. Bildirim, inceleme ve hesap kısıtlaması</h2>
          <p>
            Hukuka aykırı veya bu Koşulları ihlal ettiği düşünülen içerikler; ilgili bağlantı, olayın açıklaması ve
            varsa destekleyici belgelerle support@sahnem.com.tr adresine bildirilebilir. Gereksiz üçüncü kişi
            verileri paylaşılmamalıdır.
          </p>
          <p>
            Sahnem, ihlalin niteliği ve ağırlığına göre içerik kaldırma, belirli işlevleri geçici sınırlandırma,
            hesabı askıya alma veya üyeliği sona erdirme tedbirlerini ölçülü şekilde uygulayabilir. Acil güvenlik
            riski, hukuki zorunluluk veya devam eden incelemenin korunması gereken hâller dışında kullanıcıya gerekçe
            ve başvuru yolu bildirilir.
          </p>
          <p>
            Kullanıcı aynı adres üzerinden itiraz edebilir. İtiraz, mevcut bilgi ve belgelerle yeniden değerlendirilir.
            Haklı neden olmaksızın keyfî kısıtlama veya kullanıcıların kanuni başvuru haklarından vazgeçmesi
            öngörülmez.
          </p>

          <h2>9. Hizmetin sürekliliği ve sorumluluk</h2>
          <p>
            Bakım, teknik arıza, üçüncü taraf altyapı sorunları ve kontrol dışındaki olaylar geçici kesintilere neden
            olabilir. Sahnem, kendi yükümlülükleri kapsamında makul teknik ve organizasyonel özeni göstermek ve
            tespit edilen sorunları gidermek için çalışır; mutlak kesintisizlik taahhüdü vermez.
          </p>
          <p>
            Kullanıcı beyanlarının doğruluğu ve kullanıcılar arasındaki hizmetin ifası, somut olaydaki tarafların
            sorumluluğundadır. Bununla birlikte Sahnem'in kastı, ağır kusuru, kendi yükümlülüklerinin ihlali veya
            kanunen sınırlandırılamayan sorumluluğu bu metinle kaldırılmaz. Kullanıcının ödediği bedelin sıfır olması,
            Sahnem'in bütün sorumluluklarının sıfır olduğu anlamına gelmez.
          </p>
          <p>
            Dış bağlantılar ilgili üçüncü tarafın hizmetine yönlendirir. Bu hizmetler kendi koşullarına tabidir;
            Sahnem'in kanundan doğan yükümlülükleri saklıdır.
          </p>

          <h2>10. Üyeliğin sona ermesi</h2>
          <p>
            Üye, hesap ayarları üzerinden veya support@sahnem.com.tr adresine başvurarak hesabının kapatılmasını talep
            edebilir. Kimliğin doğrulanması için taleple ölçülü ek bilgi istenebilir.
          </p>
          <p>
            Hesabın kapatılması, daha önce kurulmuş kullanıcılar arası anlaşmaları veya doğmuş hak ve borçları
            kendiliğinden ortadan kaldırmaz. Kullanıcı, ihtiyaç duyduğu kendi işlem bilgilerini hesap kapanmadan önce
            kaydetmelidir. Bu hüküm, kişisel veri haklarının kullanılmasını sınırlandırmaz.
          </p>
          <p>
            Hesap ve içeriklerin silinmesi ile gerekli kayıtların sınırlı saklanması, Gizlilik Politikası ve KVKK
            Aydınlatma Metni çerçevesinde yürütülür.
          </p>

          <h2>11. Değişiklikler ve uyuşmazlıklar</h2>
          <p>
            Koşulların güncel sürümü yürürlük tarihiyle yayımlanır. Kullanıcının haklarını veya yükümlülüklerini
            esaslı biçimde etkileyen değişiklikler uygun bir kanalla önceden bildirilir; hukuken gerekli hâllerde
            ayrıca kabul alınır. Değişiklikler, doğmuş hakları geriye dönük kaldırmaz. Acil güvenlik veya hukuki
            zorunluluk gerektiren değişiklikler, gerekçesiyle mümkün olan en kısa sürede açıklanır.
          </p>
          <p>
            Bu Koşullara Türk hukuku uygulanır. Kanunen görevli ve yetkili mahkemeler ile diğer başvuru mercileri
            yetkilidir. Tüketicilerin şartları oluştuğunda tüketici hakem heyetlerine ve tüketici mahkemelerine
            başvurma hakları ile zorunlu arabuluculuğa ilişkin hükümler saklıdır. Destek kanalına başvuru, kanuni dava
            veya şikâyet haklarının kullanılmasının ön koşulu değildir.
          </p>
        </LegalProse>
      </Container>
    </div>
  );
}
