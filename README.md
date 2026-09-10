# SAHNEM

Türkiye’de müzisyenleri, mekanları ve organizatörleri bir araya getiren profesyonel müzik marketplace’i.

Sahnem; müzisyenlerin yeni sahne ve iş fırsatlarına ulaşmasını, mekan ve organizatörlerin ise ihtiyaç duydukları müzisyenleri keşfetmesini, değerlendirmesini ve iletişim kurmasını sağlar.

https://sahnem.com.tr

---

## Sahnem Nedir?

Sahnem, müzik sektöründeki profesyonellerin gerçek iş fırsatları etrafında buluşmasını sağlayan bir platformdur.

Platform üç ana kullanıcı tipi üzerine kuruludur:

* Müzisyen
* Mekan
* Organizatör

Sahnem bir müzik dinleme uygulaması, bilet satış sistemi veya sosyal medya platformu değildir.

Temel amaç; müzisyenlerle sahne, etkinlik ve iş fırsatları arasında profesyonel bir bağlantı kurmaktır.

---

## Temel Ürün Akışı

```text
İlan
  ↓
Keşif
  ↓
Teklif
  ↓
Değerlendirme
  ↓
Kabul
  ↓
Mesajlaşma
  ↓
Sahne
```

Sahnem’in tüm kullanıcı deneyimi bu akışın hızlı, anlaşılır ve güvenli ilerlemesi üzerine kuruludur.

---

## Müzisyenler İçin

Müzisyenler Sahnem üzerinden:

* Profesyonel profil oluşturabilir
* Branş ve deneyim bilgilerini paylaşabilir
* Portfolyolarını sergileyebilir
* Şehir ve branşlarına uygun ilanları keşfedebilir
* İlanlara teklif gönderebilir
* Teklif süreçlerini takip edebilir
* Mekan ve organizatörlerle mesajlaşabilir
* Yeni sahne ve iş fırsatlarına ulaşabilir

---

## Mekanlar İçin

Mekanlar Sahnem üzerinden:

* Mekan profili oluşturabilir
* Etkinlikleri için müzisyen ilanı yayınlayabilir
* Branş, konum, tarih, bütçe ve deneyim kriterleri belirleyebilir
* Gelen teklifleri inceleyebilir
* Müzisyen profillerini karşılaştırabilir
* Teklifleri kabul veya reddedebilir
* Müzisyenlerle iletişim kurabilir
* Uygun adayları favorilere ekleyebilir

---

## Organizatörler İçin

Organizatörler Sahnem üzerinden:

* Profesyonel profil oluşturabilir
* Etkinlikleri için ilan yayınlayabilir
* Müzisyen keşfedebilir
* Gelen teklifleri değerlendirebilir
* Uygun adayları karşılaştırabilir
* Teklif süreçlerini yönetebilir
* Müzisyenlerle doğrudan iletişim kurabilir

---

## Temel Özellikler

### Keşfet

Müzisyenlerin, mekanların ve organizatörlerin filtrelenebilir şekilde keşfedildiği alan.

Kullanıcılar branş, şehir ve ilgili profesyonel kriterler üzerinden arama yapabilir.

### İlanlar

Mekan ve organizatörlerin müzisyen ihtiyaçlarını yayınladığı marketplace alanı.

İlanlarda şu bilgiler yer alabilir:

* İlan başlığı
* Açıklama
* Aranan branş
* Şehir ve konum
* Etkinlik tarihi
* Son başvuru tarihi
* Minimum deneyim
* Bütçe
* Ekipman bilgileri

### Profesyonel Profiller

Müzisyen profilleri; kullanıcının deneyimini, branşını, portfolyosunu ve çalışma tercihlerini profesyonel şekilde sunar.

Profil yapısının temel amacı, mekan veya organizatörün şu soruya kısa sürede cevap verebilmesidir:

> Bu müzisyen benim etkinliğim için uygun mu?

### Teklif Sistemi

Müzisyenler ilanlara mesaj ve önerilen fiyat içeren teklifler gönderebilir.

Mekan ve organizatörler gelen teklifleri müzisyen profilleriyle birlikte değerlendirerek kabul veya reddedebilir.

### Mesajlaşma

Sahnem içindeki mesajlaşmalar ilgili ilan ve teklif bağlamını korur.

Konuşma içerisinde şu bilgiler takip edilebilir:

* İlgili ilan
* Etkinlik tarihi
* Teklif durumu
* Teklif sahibi
* Karşı taraf

### Favoriler

Mekan ve organizatörler ilgilendikleri müzisyenleri kaydedebilir ve daha sonra değerlendirmek üzere kısa liste oluşturabilir.

### Bildirimler

Platform içerisindeki önemli hareketler bildirim sistemi üzerinden kullanıcıya iletilir.

Örneğin:

* Yeni teklif
* Teklif kabulü
* Teklif reddi
* Yeni mesaj
* İlan durumu değişikliği
* Platform bildirimleri

---

## Sayfa Yapısı

```text
/
├── /explore
├── /jobs
│   └── /jobs/:id
├── /musicians/:id
├── /venues/:id
├── /organizers/:id
│
├── /register
├── /profile-setup
│
├── /dashboard
├── /profile/edit
│
├── /offers
│   └── /offers/:id
│
├── /post-advert
├── /my-adverts
│   └── /my-adverts/:id
│
├── /messages
│   └── /messages/:conversationId
│
├── /favorites
├── /notifications
└── /settings
```

---

## Tasarım Yaklaşımı

Sahnem koyu tema öncelikli bir tasarım sistemine sahiptir.

Genel tasarım dili:

* Premium
* Modern
* Editoryal
* Minimal
* Müzik kültürüne ait
* Güven veren
* Fonksiyonel

Public sayfalarda daha güçlü ve karakterli bir marka dili kullanılır.

Uygulama içi ekranlarda ise içerik ve görevler ön plana çıkarılır.

Arayüzün amacı yalnızca estetik olmak değil; kullanıcıların daha hızlı karar vermesini ve süreci daha kolay tamamlamasını sağlamaktır.

---

## Marka Renkleri

```css
--arka-plan: #080808;
--derin-yuzey: #0F0F14;
--kart: #16151D;
--kart-hover: #1C1A24;
--kenarlik: #28262F;

--ana-mor: #B14EFF;
--koyu-mor: #8B1FE0;
--acik-mor: #D9A6FF;

--ikincil-vurgu: #5CC8DB;

--ana-metin: #EFEDF4;
--ikincil-metin: #A6A2B3;
```

### Tipografi

* Başlıklar: Syne
* Gövde ve arayüz metinleri: Inter

---

## Tasarım Hedefleri

Sahnem’de her tasarım ve ürün kararı üç temel soruya göre değerlendirilir:

> Müzisyen daha hızlı sahne bulabiliyor mu?

> Mekan daha hızlı doğru müzisyeni bulabiliyor mu?

> Organizatör daha güvenli ve profesyonel karar verebiliyor mu?

Eğer bir tasarım kararı bu sorulara katkı sağlamıyorsa, öncelikli değildir.

---

## Responsive Yapı

Ana tasarım hedefi masaüstü web deneyimidir.

Desteklenen temel ekran genişlikleri:

```text
1440px  → Ana masaüstü
1280px  → Masaüstü
1024px  → Küçük masaüstü / tablet
768px   → Tablet
390px   → Mobil web
```

---

## Proje Durumu

Sahnem aktif olarak geliştirilen ve production ortamında kullanılan bir üründür.

Ürün, kullanıcı deneyimi ve marketplace akışları sürekli olarak iyileştirilmektedir.

---

## Lisans

Bu proje özel mülkiyettir.

Kaynak kodların, tasarım sisteminin, bileşenlerin veya ürün materyallerinin izinsiz kullanılması, dağıtılması veya yeniden yayınlanması yasaktır.

© SAHNEM. Tüm hakları saklıdır.
