import { delay } from '@/lib/async';
import { nextId, readStore, writeStore } from '@/lib/storage';
import { SEED_OFFERS } from '@/mocks/seed';
import { getAdvertById, setAdvertStatus } from './advertService';
import type { Offer, OfferCreateInput, OfferStatus } from '@/types';

function getOffers(): Offer[] {
  return readStore('offers', SEED_OFFERS);
}
function setOffers(list: Offer[]) {
  writeStore('offers', list);
}

export async function listOffersByMusician(musicianId: number): Promise<Offer[]> {
  await delay();
  return getOffers()
    .filter((o) => o.musicianId === musicianId)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
}

export async function listOffersByAdvert(advertId: number): Promise<Offer[]> {
  await delay();
  return getOffers()
    .filter((o) => o.advertId === advertId)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
}

export async function getOfferById(id: number): Promise<Offer | undefined> {
  await delay(150);
  return getOffers().find((o) => o.id === id);
}

export async function createOffer(
  musicianId: number,
  musicianName: string,
  musicianBranch: string,
  input: OfferCreateInput,
): Promise<Offer> {
  await delay();
  const advert = await getAdvertById(input.advertId);
  if (!advert) throw new Error('İlan bulunamadı.');
  const list = getOffers();
  const offer: Offer = {
    id: nextId(list), musicianId, musicianName, musicianBranch,
    advertTitle: advert.title, offerStatus: 'Pending', createdDate: new Date().toISOString(), ...input,
  };
  setOffers([...list, offer]);
  return offer;
}

export async function updateOfferStatus(id: number, status: OfferStatus): Promise<Offer> {
  await delay();
  const list = getOffers();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error('Teklif bulunamadı.');
  list[idx] = { ...list[idx], offerStatus: status };
  setOffers(list);
  if (status === 'Accepted') {
    await setAdvertStatus(list[idx].advertId, 'Closed');
  }
  return list[idx];
}
