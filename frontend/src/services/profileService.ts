import { delay } from '@/lib/async';
import { nextId, readStore, writeStore } from '@/lib/storage';
import { SEED_MUSICIANS, SEED_ORGANIZERS, SEED_VENUES } from '@/mocks/seed';
import type {
  City, EmployerProfile, MusicBranch, MusicianProfile, MusicianProfileInput,
  OrganizerProfile, OrganizerProfileInput, VenueProfile, VenueProfileInput,
} from '@/types';

function getMusicians(): MusicianProfile[] {
  return readStore('musicians', SEED_MUSICIANS);
}
function setMusicians(list: MusicianProfile[]) {
  writeStore('musicians', list);
}
function getOrganizers(): OrganizerProfile[] {
  return readStore('organizers', SEED_ORGANIZERS);
}
function setOrganizers(list: OrganizerProfile[]) {
  writeStore('organizers', list);
}
function getVenues(): VenueProfile[] {
  return readStore('venues', SEED_VENUES);
}
function setVenues(list: VenueProfile[]) {
  writeStore('venues', list);
}

export interface MusicianFilters {
  search?: string;
  branch?: MusicBranch;
  city?: City;
  maxPrice?: number;
  travelOnly?: boolean;
}

export async function listMusicians(filters: MusicianFilters = {}): Promise<MusicianProfile[]> {
  await delay();
  let list = getMusicians();
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.genres.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q),
    );
  }
  if (filters.branch) list = list.filter((m) => m.branch === filters.branch);
  if (filters.city) list = list.filter((m) => m.city === filters.city);
  if (filters.maxPrice) list = list.filter((m) => (m.priceFrom ?? 0) <= filters.maxPrice!);
  if (filters.travelOnly) list = list.filter((m) => m.isAvailableToTravel === 'Yes');
  return list;
}

export async function getMusicianById(id: number): Promise<MusicianProfile | undefined> {
  await delay(200);
  return getMusicians().find((m) => m.id === id);
}

export async function getMusicianByUserId(userId: number): Promise<MusicianProfile | undefined> {
  await delay(150);
  return getMusicians().find((m) => m.appUserId === userId);
}

export async function createMusicianProfile(userId: number, input: MusicianProfileInput, firstName: string, lastName: string): Promise<MusicianProfile> {
  await delay();
  const list = getMusicians();
  const profile: MusicianProfile = {
    id: nextId(list), appUserId: userId, firstName, lastName,
    ratingAvg: 0, ratingCount: 0, verificationStatus: 'Pending', ...input,
  };
  setMusicians([...list, profile]);
  return profile;
}

export async function updateMusicianProfile(id: number, input: Partial<MusicianProfileInput>): Promise<MusicianProfile> {
  await delay();
  const list = getMusicians();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error('Profil bulunamadı.');
  list[idx] = { ...list[idx], ...input };
  setMusicians(list);
  return list[idx];
}

export async function getOrganizerByUserId(userId: number): Promise<OrganizerProfile | undefined> {
  await delay(150);
  return getOrganizers().find((o) => o.appUserId === userId);
}

export async function createOrganizerProfile(userId: number, input: OrganizerProfileInput): Promise<OrganizerProfile> {
  await delay();
  const list = getOrganizers();
  const profile: OrganizerProfile = { id: nextId(list), appUserId: userId, verificationStatus: 'Pending', ...input };
  setOrganizers([...list, profile]);
  return profile;
}

export async function updateOrganizerProfile(id: number, input: Partial<OrganizerProfileInput>): Promise<OrganizerProfile> {
  await delay();
  const list = getOrganizers();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error('Profil bulunamadı.');
  list[idx] = { ...list[idx], ...input };
  setOrganizers(list);
  return list[idx];
}

export async function getVenueByUserId(userId: number): Promise<VenueProfile | undefined> {
  await delay(150);
  return getVenues().find((v) => v.appUserId === userId);
}

export async function createVenueProfile(userId: number, input: VenueProfileInput): Promise<VenueProfile> {
  await delay();
  const list = getVenues();
  const profile: VenueProfile = { id: nextId(list), appUserId: userId, verificationStatus: 'Pending', ...input };
  setVenues([...list, profile]);
  return profile;
}

export async function updateVenueProfile(id: number, input: Partial<VenueProfileInput>): Promise<VenueProfile> {
  await delay();
  const list = getVenues();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error('Profil bulunamadı.');
  list[idx] = { ...list[idx], ...input };
  setVenues(list);
  return list[idx];
}

export async function getEmployerByUserId(userId: number): Promise<EmployerProfile | undefined> {
  const org = await getOrganizerByUserId(userId);
  if (org) return { kind: 'Organizer', ...org };
  const venue = await getVenueByUserId(userId);
  if (venue) return { kind: 'Venue', ...venue };
  return undefined;
}

export async function getEmployerById(id: number, kind: 'Organizer' | 'Venue'): Promise<EmployerProfile | undefined> {
  await delay(200);
  if (kind === 'Organizer') {
    const o = getOrganizers().find((x) => x.id === id);
    return o ? { kind: 'Organizer', ...o } : undefined;
  }
  const v = getVenues().find((x) => x.id === id);
  return v ? { kind: 'Venue', ...v } : undefined;
}
