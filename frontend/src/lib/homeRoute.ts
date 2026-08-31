import type { AppUser } from '@/types';

// Girişten sonra kullanıcıyı ayrı bir "Panel" ekranına uğratmak yerine
// doğrudan rolüne göre en işlevsel sayfaya götürür — müzisyen ilanları,
// işveren müzisyenleri görsün, ekstra bir tık gerekmesin.
export function getHomeRoute(user: Pick<AppUser, 'role' | 'isProfileCompleted'>): string {
  if (!user.isProfileCompleted) return '/profile-setup';
  if (user.role === 'Admin') return '/admin';
  if (user.role === 'Musician') return '/jobs';
  return '/explore';
}
