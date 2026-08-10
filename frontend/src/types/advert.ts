import type { AdvertStatus, City, MusicBranch } from './enums';

// Sahnem.Core/Entities/Advert.cs
export interface Advert {
  id: number;
  creatorId: number;
  creatorName: string;
  creatorKind: 'Organizer' | 'Venue';
  creatorAvatarUrl?: string;
  title: string;
  description: string;
  city: City;
  district?: string;
  address: string;
  equipmentProvided: boolean;
  eventTime: string;
  budget: number;
  minimumExperienceYears?: number;
  status: AdvertStatus;
  applicationDeadline: string;
  createdDate: string;
  // NOT: Backend'deki Advert entity'sinde ve DTO'larında henüz bir "hedef branş" alanı yok
  // (bkz. backend/BACKEND-TODO.md). Branşa göre filtreleme/etiketleme değerli bir özellik
  // olduğu için frontend'de tutuluyor; backend'e MusicBranch alanı eklendiğinde buradaki
  // opsiyonellik kaldırılabilir.
  branch?: MusicBranch;
  offerCount: number;
}

// Sahnem.Business/DTOs/Advert/AdvertCreateDto.cs + frontend-only "branch" eklentisi
export interface AdvertCreateInput {
  title: string;
  description: string;
  city: City;
  district?: string;
  address: string;
  equipmentProvided: boolean;
  eventTime: string;
  budget: number;
  minimumExperienceYears?: number;
  applicationDeadline: string;
  branch?: MusicBranch;
}

export type AdvertUpdateInput = AdvertCreateInput;
