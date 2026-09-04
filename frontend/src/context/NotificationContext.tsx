import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import * as notificationService from '@/services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextValue {
  unreadCount: number;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Navbar'daki zil ikonundaki nokta ile /notifications sayfasının aynı
// "okunmamış sayısı"nı paylaşması için — biri okundu işaretlerken diğeri
// de anında güncellensin diye tek bir paylaşılan state.
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const list = await notificationService.listNotifications();
    setUnreadCount(list.filter((n) => !n.isRead).length);
  }, [user]);

  useEffect(() => {
    refresh();
    // Yeni bir bildirim geldiğinde (teklif, ilan başvurusu vb.) sayfa
    // yenilenmeden zil rozeti güncellenmiyordu — periyodik yoklama ekliyoruz.
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return <NotificationContext.Provider value={{ unreadCount, refresh }}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications, NotificationProvider içinde kullanılmalı.');
  return ctx;
}
