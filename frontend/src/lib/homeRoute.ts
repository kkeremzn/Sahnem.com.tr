import type { AppUser } from '@/types';

// Girişten sonra rol bazlı bir panele gider — hızlı istatistikler ve öne
// çıkan içerikle birlikte ilanlara/keşfete/mesajlara tek tıkla erişim sağlar.
export function getHomeRoute(user: Pick<AppUser, 'role' | 'isProfileCompleted' | 'isEmailConfirmed'>): string {
  if (!user.isEmailConfirmed) return '/verify-email';
  if (!user.isProfileCompleted) return '/profile-setup';
  if (user.role === 'Admin') return '/admin';
  return '/dashboard';
}
