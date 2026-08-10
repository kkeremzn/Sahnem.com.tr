import { delay } from '@/lib/async';
import { readStore, writeStore } from '@/lib/storage';
import type { Favorite } from '@/types';

const SEED_FAVORITES: Favorite[] = [{ id: 1, musicianId: 3 }, { id: 2, musicianId: 7 }];

function getFavorites(): Favorite[] {
  return readStore('favorites', SEED_FAVORITES);
}
function setFavorites(list: Favorite[]) {
  writeStore('favorites', list);
}

export async function listFavoriteMusicianIds(): Promise<number[]> {
  await delay(200);
  return getFavorites().map((f) => f.musicianId);
}

export async function toggleFavorite(musicianId: number): Promise<boolean> {
  await delay(150);
  const list = getFavorites();
  const idx = list.findIndex((f) => f.musicianId === musicianId);
  if (idx === -1) {
    setFavorites([...list, { id: (list.at(-1)?.id ?? 0) + 1, musicianId }]);
    return true;
  }
  setFavorites(list.filter((f) => f.musicianId !== musicianId));
  return false;
}
