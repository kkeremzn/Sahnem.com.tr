import type { AdvertStatus, City, MusicBranch } from './enums';

// Sahnem.Business/DTOs/Advert/AdvertResponseDto.cs
export interface Advert {
  id: number;
  creatorId: number;
  creatorName: string;
  creatorRole: 'Organizer' | 'Venue';
  title: string;
  description: string;
  city: City;
  district?: string;
  address: string;
  equipmentProvided: boolean;
  equipmentNote?: string;
  eventTime: string;
  budget: number;
  minimumExperienceYears?: number;
  branch?: MusicBranch;
  status: AdvertStatus;
  applicationDeadline: string;
  createdDate: string;
  offerCount: number;
}

// Sahnem.Business/DTOs/Advert/AdvertCreateDto.cs (+ AdvertUpdateDto — alanlar birebir aynı)
export interface AdvertCreateInput {
  title: string;
  description: string;
  city: City;
  district?: string;
  address: string;
  equipmentProvided: boolean;
  equipmentNote?: string;
  eventTime: string;
  budget: number;
  minimumExperienceYears?: number;
  branch?: MusicBranch;
  applicationDeadline: string;
}

export type AdvertUpdateInput = AdvertCreateInput;
