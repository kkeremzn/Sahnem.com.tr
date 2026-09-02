import { adminApi } from '@/lib/adminApiClient';
import { setAdminAccessToken } from '@/lib/adminTokenStore';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  lastLoginAt?: string;
  createdDate: string;
}

interface AdminAuthTokenResponse {
  accessToken: string;
  expiresAt: string;
}

export async function login(username: string, password: string): Promise<void> {
  const res = await adminApi.post<AdminAuthTokenResponse>('/admin-auth/login', { username, password }, { skipAuthRetry: true });
  setAdminAccessToken(res.accessToken);
}

export async function logout(): Promise<void> {
  try {
    await adminApi.post('/admin-auth/logout', undefined, { skipAuthRetry: true });
  } finally {
    setAdminAccessToken(null);
  }
}

export async function getMe(): Promise<AdminUser> {
  return adminApi.get<AdminUser>('/admin-auth/me');
}

export async function tryRestoreSession(): Promise<AdminUser | null> {
  try {
    const res = await adminApi.post<AdminAuthTokenResponse>('/admin-auth/refresh', undefined, { skipAuthRetry: true });
    setAdminAccessToken(res.accessToken);
    return await getMe();
  } catch {
    setAdminAccessToken(null);
    return null;
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await adminApi.put('/admin-auth/change-password', { currentPassword, newPassword });
}

export async function forgotPassword(username: string): Promise<void> {
  await adminApi.post('/admin-auth/forgot-password', { username }, { skipAuthRetry: true });
}

export async function verifyResetCode(username: string, code: string): Promise<void> {
  await adminApi.post('/admin-auth/verify-reset-code', { username, code }, { skipAuthRetry: true });
}

export async function resetPassword(username: string, code: string, newPassword: string): Promise<void> {
  await adminApi.post('/admin-auth/reset-password', { username, code, newPassword }, { skipAuthRetry: true });
}
