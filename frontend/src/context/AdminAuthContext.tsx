import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as adminAuthService from '@/services/adminAuthService';
import type { AdminUser } from '@/services/adminAuthService';

interface AdminAuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

// Normal AuthProvider'dan bilerek tamamen ayrı — admin oturumu, kullanıcı
// oturumundan farklı bir token/cookie kullanıyor, ikisi birbirini hiç etkilemez.
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAuthService.tryRestoreSession().then(setAdmin).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    await adminAuthService.login(username, password);
    const a = await adminAuthService.getMe();
    setAdmin(a);
    return a;
  }, []);

  const logout = useCallback(async () => {
    await adminAuthService.logout();
    setAdmin(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(() => ({ admin, loading, login, logout }), [admin, loading, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth, AdminAuthProvider içinde kullanılmalı.');
  return ctx;
}
