// Veritabanı/API geçici olarak kapatıldığında (ör. ücretsiz Postgres süresi
// dolduğunda) bu değeri true yapıp deploy etmek, her sayfanın tek tek kırık
// istek/boş yükleniyor ekranı göstermesi yerine tüm siteyi tek bir "bakımda"
// ekranına düşürür — geri açmak için tekrar false yapıp deploy etmek yeterli.
export const MAINTENANCE_MODE = true;
