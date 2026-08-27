// Access token BİLEREK sadece bellekte (bir modül değişkeninde) tutuluyor —
// localStorage/sessionStorage'a asla yazılmıyor. Sayfa yenilendiğinde kaybolur,
// bu yüzden uygulama açılışında AuthContext sessizce /user/refresh çağırıp
// (HttpOnly cookie'deki refresh token ile) yeni bir access token alır.
//
// Neden: localStorage'daki her şey sayfadaki herhangi bir JavaScript tarafından
// okunabilir. Bir XSS açığı (ör. bağımlılıklardan biri, kullanıcı içeriği render
// eden bir bileşen) olursa, orada duran bir token anında çalınabilir. Bellekte
// tutulan bir değer ise sadece o an çalışan kod tarafından erişilebilir ve sayfa
// yenilendiğinde zaten geçersiz kalır — çalınabilecek kalıcı bir sır yok.
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
