import { api, ApiError } from '@/lib/apiClient';
import { setAccessToken } from '@/lib/tokenStore';
import type { AppUser, AppUserLoginInput, AppUserRegisterInput, AppUserUpdateInput } from '@/types';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface AuthTokenResponse {
  accessToken: string;
  expiresAt: string;
}

// Register/login/refresh sadece access token döner (refresh token HttpOnly
// cookie olarak backend tarafından set edilir, JS bu değere hiç erişemez) —
// kullanıcı bilgisini almak için ayrıca getMe() çağrılır.

export async function register(input: AppUserRegisterInput): Promise<void> {
  const res = await api.post<AuthTokenResponse>('/user/register', input, { skipAuthRetry: true });
  setAccessToken(res.accessToken);
}

export async function login(input: AppUserLoginInput): Promise<void> {
  const res = await api.post<AuthTokenResponse>('/user/login', input, { skipAuthRetry: true });
  setAccessToken(res.accessToken);
}

export async function logout(): Promise<void> {
  try {
    await api.post('/user/logout', undefined, { skipAuthRetry: true });
  } finally {
    setAccessToken(null);
  }
}

export async function getMe(): Promise<AppUser> {
  return api.get<AppUser>('/user/me');
}

// Sayfa yenilendiğinde bellekteki access token kaybolur. HttpOnly cookie'deki
// refresh token hâlâ geçerliyse sessizce yeni bir access token alıp oturumu
// canlandırır; değilse null döner (kullanıcı çıkış yapmış demektir).
//
// 401 (refresh token gerçekten geçersiz/süresi dolmuş/iptal edilmiş) dışındaki
// her hata — ağ kopması, Render'ın ücretsiz plandaki soğuk başlangıç gecikmesi,
// rate limit, 5xx — önceden aynı şekilde "çıkış yapılmış" sayılıp oturumu
// sessizce siliyordu. Kullanıcı normal kullanırken (ör. bir 404 sayfasından
// geri dönerken tam sayfa yenilemesi tetiklendiğinde) hiçbir uyarı olmadan
// çıkışa zorlanıyordu. Artık yalnızca kesin bir 401 anında pes ediyor,
// diğer geçici hatalarda kısa bir gecikmeyle bir kez daha deniyor.
export async function tryRestoreSession(): Promise<AppUser | null> {
  const attempt = async (): Promise<AppUser | null | 'retry'> => {
    try {
      const res = await api.post<AuthTokenResponse>('/user/refresh', undefined, { skipAuthRetry: true });
      setAccessToken(res.accessToken);
      return await getMe();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setAccessToken(null);
        return null;
      }
      return 'retry';
    }
  };

  const first = await attempt();
  if (first !== 'retry') return first;

  await wait(1500);
  const second = await attempt();
  if (second !== 'retry') return second;

  // İki denemeden sonra da net bir "yetkisiz" cevabı alamadık (sürekli ağ/sunucu
  // hatası) — oturumu var sayıp kullanıcıyı yetkisiz bir ekranda bırakmaktansa,
  // en azından tutarlı biçimde çıkış yapmış say. Bu hâlâ ideal değil ama en
  // azından iki deneme şansı tanınmış oluyor.
  setAccessToken(null);
  return null;
}

export async function updateUser(input: AppUserUpdateInput): Promise<void> {
  await api.put('/user/update', input);
}

export async function updateNotificationPreferences(allowCityAdvertAlerts: boolean): Promise<void> {
  await api.put('/user/notification-preferences', { allowCityAdvertAlerts });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.put('/user/change-password', { currentPassword, newPassword });
}

export async function deleteAccount(): Promise<void> {
  await api.delete('/user/delete');
}

export async function verifyEmail(code: string): Promise<void> {
  await api.post('/user/verify-email', { code });
}

export async function resendVerificationEmail(): Promise<void> {
  await api.post('/user/resend-verification-email');
}

// Şifremi unuttum akışının üç adımı — kullanıcı henüz giriş yapmadığı için
// bu üçü de token gerektirmiyor (backend'de [Authorize] yok).
export async function forgotPassword(email: string): Promise<void> {
  await api.post('/user/forgot-password', { email }, { skipAuthRetry: true });
}

export async function verifyResetCode(email: string, code: string): Promise<void> {
  await api.post('/user/verify-reset-code', { email, code }, { skipAuthRetry: true });
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
  await api.post('/user/reset-password', { email, code, newPassword }, { skipAuthRetry: true });
}
