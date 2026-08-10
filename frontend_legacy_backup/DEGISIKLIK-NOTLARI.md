# Sahnem — Marka Kimliği Uygulama Notları

## Ne değişti
Tüm site (28 sayfa) tek bir merkezi token sisteminden (`css/global.css`) yönetildiği
için renk geçişi tek noktadan yapıldı ve otomatik olarak her sayfaya yayıldı.

### Renkler (css/global.css → :root)
| Token | Önce | Şimdi |
|---|---|---|
| --gold (ana vurgu) | #C8A84B (altın) | #B14EFF (elektrik mor — logo rengi) |
| --gold-dim | #8C7433 | #8B1FE0 |
| --accent (ikincil vurgu) | #7B5CFA (mor) | #5CC8DB (cam göbeği — gold ile karışmaması için) |
| --black (zemin) | #0A0A0F | #080808 (logo zemini ile birebir) |

Tüm `var(--gold)`, `var(--accent)`, `.badge-gold`, `.btn-primary` vb. bu token'ları
kullandığı için: butonlar, linkler, etiketler, ilerleme çubukları, fiyatlar,
rozetler, hover efektleri — hepsi otomatik olarak mor temaya geçti.

### Logo entegrasyonu
- `js/components.js` içine `logoMark()` fonksiyonu eklendi (inline SVG, ekolayzır ikonu)
- Navbar logosu: artık ikon + "SAHNEM" yazısı (önceden sadece yazı)
- Footer logosu: aynı ikon + yazı
- İkon `currentColor` kullanıyor, yani CSS rengini otomatik takip ediyor

### Favicon
- `assets/brand/` klasörüne logo dosyaları eklendi (SVG + PNG, çoklu boyut)
- Tüm 24 HTML sayfasına `<link rel="icon">` ve `<link rel="apple-touch-icon">` eklendi

### Diğer düzeltmeler
- Hardcoded eski renk kodları (`#C8A84B`, `#8C7433`, `rgba(200,168,75,...)`)
  tüm CSS/HTML/JS dosyalarında tarandı ve mor karşılıklarıyla değiştirildi
- Bazı kullanıcı avatarlarındaki çeşitli renkler (mor, mavi, yeşil, kırmızı)
  kasıtlı olarak korundu — bu marka rengi değil, kullanıcı ayrımı için dekoratif

## Nasıl çalıştırılır
```bash
cd sahnem-final
python3 -m http.server 5500
```
Tarayıcıda: http://localhost:5500

## Notlar
- `assets/brand/` klasöründeki SVG dosyaları gelecekte logo güncellenirse
  buradan değiştirilip `components.js`'teki `logoMark()` fonksiyonu güncellenebilir.
- Tüm tasarım sistemi tek dosyada (`css/global.css`) olduğu için ileride
  renk/tema değişikliği gerekirse sadece `:root` bloğu düzenlenmesi yeterli.
