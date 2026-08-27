import type { MusicBranch, OfferStatus } from './enums';

// Sahnem.Business/DTOs/Offer/OfferResponseDto.cs — musicianId, Offer.MusicianId
// (Musician'ın AppUserId'si) alanına karşılık gelir, MusicianProfile.Id'ye DEĞİL.
export interface Offer {
  id: number;
  musicianId: number;
  musicianName: string;
  musicianBranch?: MusicBranch;
  advertId: number;
  advertTitle: string;
  message: string;
  proposedPrice: number;
  offerStatus: OfferStatus;
  createdDate: string;
}

export interface OfferCreateInput {
  advertId: number;
  message: string;
  proposedPrice: number;
}
