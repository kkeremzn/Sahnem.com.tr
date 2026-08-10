import type { OfferStatus } from './enums';

// Sahnem.Core/Entities/Offer.cs
export interface Offer {
  id: number;
  musicianId: number;
  musicianName: string;
  musicianAvatarUrl?: string;
  musicianBranch: string;
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
