import { api } from '@/lib/apiClient';
import type { MusicianProfile } from '@/types';

// Not: backend'de favoriler AppUserId (musicianUserId) ile anahtarlanıyor,
// MusicianProfile.Id ile DEĞİL — çağıranlar musician.appUserId kullanmalı.
export async function listFavoriteMusicianIds(): Promise<number[]> {
  return api.get<number[]>('/favorite/mine/ids');
}

export async function listFavoriteMusicians(): Promise<MusicianProfile[]> {
  return api.get<MusicianProfile[]>('/favorite/mine');
}

export async function toggleFavorite(musicianUserId: number): Promise<boolean> {
  const res = await api.post<{ isFavorite: boolean }>(`/favorite/toggle?musicianUserId=${musicianUserId}`);
  return res.isFavorite;
}
