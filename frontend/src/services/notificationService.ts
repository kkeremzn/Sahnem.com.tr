import { delay } from '@/lib/async';
import { readStore, writeStore } from '@/lib/storage';
import { SEED_NOTIFICATIONS } from '@/mocks/seed';
import type { AppNotification } from '@/types';

function getNotifications(): AppNotification[] {
  return readStore('notifications', SEED_NOTIFICATIONS);
}
function setNotifications(list: AppNotification[]) {
  writeStore('notifications', list);
}

export async function listNotifications(): Promise<AppNotification[]> {
  await delay();
  return [...getNotifications()].sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
  );
}

export async function markAsRead(id: number): Promise<void> {
  await delay(100);
  const list = getNotifications();
  const idx = list.findIndex((n) => n.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], isRead: true };
  setNotifications(list);
}

export async function markAllAsRead(): Promise<void> {
  await delay(150);
  setNotifications(getNotifications().map((n) => ({ ...n, isRead: true })));
}
