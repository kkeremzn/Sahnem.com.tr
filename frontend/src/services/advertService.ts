import { api } from '@/lib/apiClient';
import type { Advert, AdvertCreateInput, AdvertStatus, AdvertUpdateInput, City, MusicBranch } from '@/types';

interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Backend'in AdvertResponseDto.TargetBranch alanı frontend'de kısaca "branch" —
// tüm bileşenlerde tutarlı olsun diye burada tek noktadan çeviriliyor.
interface AdvertDto extends Omit<Advert, 'branch'> {
  targetBranch?: MusicBranch;
}

function fromDto(dto: AdvertDto): Advert {
  const { targetBranch, ...rest } = dto;
  return { ...rest, branch: targetBranch };
}

function toCreateDto(input: AdvertCreateInput) {
  const { branch, ...rest } = input;
  return { ...rest, targetBranch: branch };
}

export interface AdvertFilters {
  search?: string;
  city?: City;
  branch?: MusicBranch;
  status?: AdvertStatus;
  minBudget?: number;
  creatorId?: number;
  page?: number;
  pageSize?: number;
}

async function fetchAdverts(filters: AdvertFilters): Promise<PagedResult<Advert>> {
  const res = await api.get<PagedResult<AdvertDto>>('/advert/getall', {
    search: filters.search,
    city: filters.city,
    branch: filters.branch,
    status: filters.status,
    minBudget: filters.minBudget,
    creatorId: filters.creatorId,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  });
  return { ...res, items: res.items.map(fromDto) };
}

// Herkese açık ilan listesi (jobs sayfası) — durum belirtilmezse sadece açık
// ilanlar gösterilir, bu yüzden varsayılan burada 'Open'.
export async function listAdverts(filters: AdvertFilters = {}): Promise<PagedResult<Advert>> {
  return fetchAdverts({ ...filters, status: filters.status ?? 'Open' });
}

export async function getAdvertById(id: number): Promise<Advert | undefined> {
  try {
    const dto = await api.get<AdvertDto>('/advert/getbyid', { advertId: id });
    return fromDto(dto);
  } catch {
    return undefined;
  }
}

export async function listMyAdverts(): Promise<Advert[]> {
  const list = await api.get<AdvertDto[]>('/advert/getmyadverts');
  return list.map(fromDto);
}

export async function listAdvertsByCreator(creatorId: number): Promise<Advert[]> {
  const res = await fetchAdverts({ creatorId, pageSize: 100 });
  return res.items;
}

export async function createAdvert(input: AdvertCreateInput): Promise<Advert> {
  const dto = await api.post<AdvertDto>('/advert/create', toCreateDto(input));
  return fromDto(dto);
}

export async function updateAdvert(id: number, input: AdvertUpdateInput): Promise<void> {
  await api.put(`/advert/update?advertId=${id}`, toCreateDto(input));
}

export async function cancelAdvert(id: number): Promise<void> {
  await api.put(`/advert/cancel?advertId=${id}`);
}
