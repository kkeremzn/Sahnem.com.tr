import { api } from '@/lib/apiClient';
import { setAccessToken } from '@/lib/tokenStore';
import type { AppUser, AppUserLoginInput, AppUserRegisterInput, AppUserUpdateInput } from '@/types';

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
export async function tryRestoreSession(): Promise<AppUser | null> {
  try {
    const res = await api.post<AuthTokenResponse>('/user/refresh', undefined, { skipAuthRetry: true });
    setAccessToken(res.accessToken);
    return await getMe();
  } catch {
    setAccessToken(null);
    return null;
  }
}

export async function updateUser(input: AppUserUpdateInput): Promise<void> {
  await api.put('/user/update', input);
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
