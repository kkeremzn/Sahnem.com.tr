import { api } from '@/lib/apiClient';
import type { AppUser, PendingVerification, VerificationStatus } from '@/types';

interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
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

export async function listAllUsers(page = 1, pageSize = 20): Promise<PagedResult<AppUser>> {
  return api.get<PagedResult<AppUser>>('/admin/users', { page, pageSize });
}
