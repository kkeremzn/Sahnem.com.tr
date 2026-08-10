import { delay } from '@/lib/async';
import { nextId, readStore, writeStore } from '@/lib/storage';
import { SEED_ADVERTS } from '@/mocks/seed';
import type { Advert, AdvertCreateInput, AdvertStatus, City, MusicBranch } from '@/types';

function getAdverts(): Advert[] {
  return readStore('adverts', SEED_ADVERTS);
}
function setAdverts(list: Advert[]) {
  writeStore('adverts', list);
}

export interface AdvertFilters {
  search?: string;
  city?: City;
  branch?: MusicBranch;
  minBudget?: number;
  status?: AdvertStatus;
}

export async function listAdverts(filters: AdvertFilters = {}): Promise<Advert[]> {
  await delay();
  let list = getAdverts();
  if (filters.status) list = list.filter((a) => a.status === filters.status);
  else list = list.filter((a) => a.status === 'Open');
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }
  if (filters.city) list = list.filter((a) => a.city === filters.city);
  if (filters.branch) list = list.filter((a) => a.branch === filters.branch);
  if (filters.minBudget) list = list.filter((a) => a.budget >= filters.minBudget!);
  return [...list].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
}

export async function getAdvertById(id: number): Promise<Advert | undefined> {
  await delay(200);
  return getAdverts().find((a) => a.id === id);
}

export async function listAdvertsByCreator(creatorId: number): Promise<Advert[]> {
  await delay();
  return getAdverts()
    .filter((a) => a.creatorId === creatorId)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
}

export async function createAdvert(
  creatorId: number,
  creatorName: string,
  creatorKind: 'Organizer' | 'Venue',
  input: AdvertCreateInput,
): Promise<Advert> {
  await delay();
  const list = getAdverts();
  const advert: Advert = {
    id: nextId(list), creatorId, creatorName, creatorKind,
    status: 'Open', createdDate: new Date().toISOString(), offerCount: 0, ...input,
  };
  setAdverts([...list, advert]);
  return advert;
}

export async function updateAdvert(id: number, input: Partial<AdvertCreateInput>): Promise<Advert> {
  await delay();
  const list = getAdverts();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('İlan bulunamadı.');
  list[idx] = { ...list[idx], ...input };
  setAdverts(list);
  return list[idx];
}

export async function cancelAdvert(id: number): Promise<Advert> {
  return setAdvertStatus(id, 'Cancelled');
}

export async function setAdvertStatus(id: number, status: AdvertStatus): Promise<Advert> {
  await delay();
  const list = getAdverts();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('İlan bulunamadı.');
  list[idx] = { ...list[idx], status };
  setAdverts(list);
  return list[idx];
}
