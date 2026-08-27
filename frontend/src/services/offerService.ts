import { api } from '@/lib/apiClient';
import type { Offer, OfferCreateInput, OfferStatus } from '@/types';

export async function listMyOffers(): Promise<Offer[]> {
  return api.get<Offer[]>('/offer/getmyoffers');
}

export async function listOffersByAdvert(advertId: number): Promise<Offer[]> {
  return api.get<Offer[]>('/offer/getbyadvert', { advertId });
}

export async function getOfferById(id: number): Promise<Offer | undefined> {
  try {
    return await api.get<Offer>('/offer/getbyid', { offerId: id });
  } catch {
    return undefined;
  }
}

export async function createOffer(input: OfferCreateInput): Promise<Offer> {
  return api.post<Offer>('/offer/create', input);
}

export async function updateOfferStatus(id: number, status: OfferStatus): Promise<void> {
  await api.put(`/offer/updatestatus?offerId=${id}`, { status });
}
