import { api } from '@/lib/apiClient';
import type { AppNotification } from '@/types';

export async function listNotifications(): Promise<AppNotification[]> {
  return api.get<AppNotification[]>('/notification/mine');
}

export async function markAsRead(id: number): Promise<void> {
  await api.put(`/notification/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.put('/notification/read-all');
}
