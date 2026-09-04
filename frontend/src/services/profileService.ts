import { api } from '@/lib/apiClient';
import { setAccessToken } from '@/lib/tokenStore';
import type {
  City, EmployerProfile, EmployerSummary, MusicBranch, MusicianProfile, MusicianProfileInput,
  OrganizerProfile, OrganizerProfileInput, VenueProfile, VenueProfileInput,
} from '@/types';

interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface MusicianFilters {
  search?: string;
  branch?: MusicBranch;
  city?: City;
  travelOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export async function listMusicians(filters: MusicianFilters = {}): Promise<PagedResult<MusicianProfile>> {
  return api.get<PagedResult<MusicianProfile>>('/profile/musicians', {
    search: filters.search,
    branch: filters.branch,
    city: filters.city,
    travelOnly: filters.travelOnly,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  });
}

export interface EmployerFilters {
  search?: string;
  city?: City;
  page?: number;
  pageSize?: number;
}

// GetMusicians'ın işveren tarafındaki karşılığı — müzisyenlerin de mekan/
// organizatör keşfedebilmesi için.
export async function listEmployers(filters: EmployerFilters = {}): Promise<PagedResult<EmployerSummary>> {
  return api.get<PagedResult<EmployerSummary>>('/profile/employers', {
    search: filters.search,
    city: filters.city,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  });
}

// Herkese açık müzisyen profili — /musicians/:id route'u tutarlılık için
// (bkz. /employers/:id) her yerde AppUserId taşıyor, MusicianProfile.Id değil.
export async function getMusicianByUserId(userId: number): Promise<MusicianProfile | undefined> {
  try {
    return await api.get<MusicianProfile>(`/profile/musician/by-user/${userId}`);
  } catch {
    return undefined;
  }
}

export async function createMusicianProfile(input: MusicianProfileInput): Promise<void> {
  const res = await api.post<{ accessToken: string }>('/profile/musician', input);
  setAccessToken(res.accessToken);
}

export async function updateMusicianProfile(input: MusicianProfileInput): Promise<MusicianProfile> {
  return api.put<MusicianProfile>('/profile/musician', input);
}

export async function createOrganizerProfile(input: OrganizerProfileInput): Promise<void> {
  const res = await api.post<{ accessToken: string }>('/profile/organizer', input);
  setAccessToken(res.accessToken);
}

export async function updateOrganizerProfile(input: OrganizerProfileInput): Promise<OrganizerProfile> {
  return api.put<OrganizerProfile>('/profile/organizer', input);
}

export async function createVenueProfile(input: VenueProfileInput): Promise<void> {
  const res = await api.post<{ accessToken: string }>('/profile/venue', input);
  setAccessToken(res.accessToken);
}

export async function updateVenueProfile(input: VenueProfileInput): Promise<VenueProfile> {
  return api.put<VenueProfile>('/profile/venue', input);
}

// Kendi profilini getirir — rolüne göre üç şekilden biri döner, sayfa hangi
// alanların dolu olduğuna bakarak (role zaten context'te var) ayırt eder.
export async function getMyProfile(): Promise<MusicianProfile | OrganizerProfile | VenueProfile> {
  return api.get('/profile/getmyprofile');
}

export async function getEmployerByUserId(userId: number): Promise<EmployerProfile | undefined> {
  try {
    const res = await api.get<{ kind: 'Organizer' | 'Venue'; profile: OrganizerProfile | VenueProfile }>(
      `/profile/employer/${userId}`,
    );
    return { kind: res.kind, ...res.profile } as EmployerProfile;
  } catch {
    return undefined;
  }
}
