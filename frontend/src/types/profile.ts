import type {
  City, IsAvailableToTravel, MusicBranch, MusicGenre, OrganizerType, VenueType,
  VerificationStatus, WorkStatus,
} from './enums';

// Sahnem.Core/Entities/MusicianProfile.cs
export interface MusicianProfile {
  id: number;
  appUserId: number;
  firstName: string;
  lastName: string;
  bio: string;
  branch: MusicBranch[];
  genres: MusicGenre[];
  experienceYears: number;
  city: City;
  district?: string;
  additionalCities: City[];
  isAvailableToTravel: IsAvailableToTravel;
  hasOwnEquipment: boolean;
  equipmentNote?: string;
  workStatus: WorkStatus;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  spotifyUrl?: string;
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
  branch: MusicBranch[];
  genres: MusicGenre[];
  experienceYears: number;
  city: City;
  district?: string;
  additionalCities: City[];
  isAvailableToTravel: IsAvailableToTravel;
  hasOwnEquipment: boolean;
  equipmentNote?: string;
  workStatus: WorkStatus;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  spotifyUrl?: string;
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
  additionalCities: City[];
  verificationStatus: VerificationStatus;
  websiteUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  spotifyUrl?: string;
  avatarUrl?: string;
}

export interface OrganizerProfileInput {
  organizerName: string;
  organizerType: OrganizerType;
  bio: string;
  city: City;
  district?: string;
  address: string;
  additionalCities: City[];
  websiteUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  spotifyUrl?: string;
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
  spotifyUrl?: string;
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
  spotifyUrl?: string;
}

export type EmployerProfile =
  | ({ kind: 'Organizer' } & OrganizerProfile)
  | ({ kind: 'Venue' } & VenueProfile);

// Sahnem.Business/DTOs/Profile/EmployerSummaryDto.cs — /explore'da müzisyenlerin
// mekan/organizatör keşfedebilmesi için özet kart verisi.
export interface EmployerSummary {
  appUserId: number;
  kind: 'Organizer' | 'Venue';
  name: string;
  organizerType?: OrganizerType;
  venueType?: VenueType;
  bio: string;
  city: City;
  district?: string;
  avatarUrl?: string;
}
