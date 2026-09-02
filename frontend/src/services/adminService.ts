import { adminApi } from '@/lib/adminApiClient';
import type { AdminStats, AdminUserDetail, AdminUserFilter, Advert, AppUser, Offer } from '@/types';

interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function getStats(): Promise<AdminStats> {
  return adminApi.get<AdminStats>('/admin/stats');
}

export async function listAllUsers(page = 1, pageSize = 20, filter?: AdminUserFilter): Promise<PagedResult<AppUser>> {
  return adminApi.get<PagedResult<AppUser>>('/admin/users', {
    page, pageSize, search: filter?.search, role: filter?.role, isActive: filter?.isActive, isEmailConfirmed: filter?.isEmailConfirmed,
  });
}

export async function getUserDetail(id: number): Promise<AdminUserDetail> {
  return adminApi.get<AdminUserDetail>(`/admin/users/${id}`);
}

export async function suspendUser(id: number): Promise<void> {
  await adminApi.put(`/admin/users/${id}/suspend`);
}

export async function reactivateUser(id: number): Promise<void> {
  await adminApi.put(`/admin/users/${id}/reactivate`);
}

export async function deleteUser(id: number): Promise<void> {
  await adminApi.delete(`/admin/users/${id}`);
}

export async function listAllAdverts(page = 1, pageSize = 20, search?: string): Promise<PagedResult<Advert>> {
  return adminApi.get<PagedResult<Advert>>('/admin/adverts', { page, pageSize, search });
}

export async function getAdvertDetail(id: number): Promise<Advert> {
  return adminApi.get<Advert>(`/admin/adverts/${id}`);
}

export async function cancelAdvertAsAdmin(id: number): Promise<void> {
  await adminApi.put(`/admin/adverts/${id}/cancel`);
}

export async function getAdvertOffers(id: number): Promise<Offer[]> {
  return adminApi.get<Offer[]>(`/admin/adverts/${id}/offers`);
}

export interface AdminConversation {
  id: number;
  userAId: number;
  userAName: string;
  userBId: number;
  userBName: string;
  lastMessage?: string;
  lastMessageAt: string;
  messageCount: number;
  createdDate: string;
}

export interface AdminMessage {
  id: number;
  senderId: number;
  senderName: string;
  body: string;
  createdDate: string;
}

export async function listConversations(page = 1, pageSize = 20, search?: string): Promise<PagedResult<AdminConversation>> {
  return adminApi.get<PagedResult<AdminConversation>>('/admin/conversations', { page, pageSize, search });
}

export async function getConversationMessages(id: number): Promise<AdminMessage[]> {
  return adminApi.get<AdminMessage[]>(`/admin/conversations/${id}/messages`);
}

export async function deleteMessage(id: number): Promise<void> {
  await adminApi.delete(`/admin/messages/${id}`);
}
