import type { AdvertStatus, MusicBranch, OfferStatus } from './enums';

// Sahnem.Business/DTOs/Offer/OfferResponseDto.cs — musicianId, Offer.MusicianId
// (Musician'ın AppUserId'si) alanına karşılık gelir, MusicianProfile.Id'ye DEĞİL.
export interface Offer {
  id: number;
  musicianId: number;
  musicianName: string;
  musicianAvatarUrl?: string;
  musicianBranch?: MusicBranch;
  advertId: number;
  advertTitle: string;
  // İlanın kendi durumu (teklif "Bekliyor" olsa bile ilan süresi dolmuş
  // olabilir) — teklif listelerinde bu tutarsızlığı göstermek için.
  advertStatus?: AdvertStatus;
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
