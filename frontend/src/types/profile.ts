import type {
  City, IsAvailableToTravel, MusicBranch, OrganizerType, VenueType,
  VerificationStatus, WorkStatus,
} from './enums';

// Sahnem.Core/Entities/MusicianProfile.cs
export interface MusicianProfile {
  id: number;
  appUserId: number;
  firstName: string;
  lastName: string;
  bio: string;
  branch: MusicBranch;
  genres: string;
  experienceYears: number;
  city: City;
  district?: string;
  isAvailableToTravel: IsAvailableToTravel;
  hasOwnEquipment: boolean;
  workStatus: WorkStatus;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
  // Backend'de puanlama/fiyatlandırma sistemi henüz yok — bu alanlar sadece
  // UI'da opsiyonel gösterim için tutuluyor, gerçek veri gelene dek undefined.
  ratingAvg?: number;
  ratingCount?: number;
  priceFrom?: number;
}

export interface MusicianProfileInput {
  bio: string;
  branch: MusicBranch;
  genres: string;
  experienceYears: number;
  city: City;
  district?: string;
  isAvailableToTravel: IsAvailableToTravel;
  hasOwnEquipment: boolean;
  workStatus: WorkStatus;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

// Sahnem.Core/Entities/OrganizerProfile.cs
export interface OrganizerProfile {
  id: number;
  appUserId: number;
  organizerName: string;
  organizerType: OrganizerType;
  bio: string;
  city: City;
  district?: string;
  address: string;
  verificationStatus: VerificationStatus;
  websiteUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
}

export interface OrganizerProfileInput {
  organizerName: string;
  organizerType: OrganizerType;
  bio: string;
  city: City;
  district?: string;
  address: string;
  websiteUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

// Sahnem.Core/Entities/VenueProfile.cs
export interface VenueProfile {
  id: number;
  appUserId: number;
  venueName: string;
  venueType: VenueType;
  bio: string;
  city: City;
  district?: string;
  capacity: number;
  address: string;
  hasSoundSystem: boolean;
  verificationStatus: VerificationStatus;
  websiteUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
}

export interface VenueProfileInput {
  venueName: string;
  venueType: VenueType;
  bio: string;
  city: City;
  district?: string;
  capacity: number;
  address: string;
  hasSoundSystem: boolean;
  websiteUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

export type EmployerProfile =
  | ({ kind: 'Organizer' } & OrganizerProfile)
  | ({ kind: 'Venue' } & VenueProfile);
