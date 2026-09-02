import { api } from '@/lib/apiClient';
import type {
  AdminStats, AdminUserDetail, AdminUserFilter, Advert, AppUser, PendingVerification, VerificationStatus,
} from '@/types';

interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function getStats(): Promise<AdminStats> {
  return api.get<AdminStats>('/admin/stats');
}

export async function listPendingVerifications(): Promise<PendingVerification[]> {
  return api.get<PendingVerification[]>('/admin/verifications/pending');
}

export async function setVerificationStatus(
  kind: PendingVerification['kind'],
  profileId: number,
  status: Extract<VerificationStatus, 'Approved' | 'Rejected'>,
): Promise<void> {
  await api.put(`/admin/verifications/${kind}/${profileId}`, { status });
}

export async function listAllUsers(page = 1, pageSize = 20, filter?: AdminUserFilter): Promise<PagedResult<AppUser>> {
  return api.get<PagedResult<AppUser>>('/admin/users', {
    page, pageSize, search: filter?.search, role: filter?.role, isActive: filter?.isActive, isEmailConfirmed: filter?.isEmailConfirmed,
  });
}

export async function getUserDetail(id: number): Promise<AdminUserDetail> {
  return api.get<AdminUserDetail>(`/admin/users/${id}`);
}

export async function suspendUser(id: number): Promise<void> {
  await api.put(`/admin/users/${id}/suspend`);
}

export async function reactivateUser(id: number): Promise<void> {
  await api.put(`/admin/users/${id}/reactivate`);
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

export async function listAllAdverts(page = 1, pageSize = 20, search?: string): Promise<PagedResult<Advert>> {
  return api.get<PagedResult<Advert>>('/admin/adverts', { page, pageSize, search });
}

export async function cancelAdvertAsAdmin(id: number): Promise<void> {
  await api.put(`/admin/adverts/${id}/cancel`);
}
