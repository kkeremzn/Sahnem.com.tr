import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '@/services/authService';
import type { AppUser, AppUserLoginInput, AppUserRegisterInput } from '@/types';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isMusician: boolean;
  isEmployer: boolean;
  isAdmin: boolean;
  login: (input: AppUserLoginInput) => Promise<AppUser>;
  register: (input: AppUserRegisterInput) => Promise<AppUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Oturum artık localStorage'da değil, HttpOnly bir cookie'de (refresh token)
  // tutuluyor — JS bu cookie'yi okuyamaz. Açılışta yapabileceğimiz tek şey
  // backend'e "bu cookie geçerliyse bana yeni bir access token ver" demek.
  useEffect(() => {
    authService
      .tryRestoreSession()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (input: AppUserLoginInput) => {
    await authService.login(input);
    const u = await authService.getMe();
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (input: AppUserRegisterInput) => {
    await authService.register(input);
    const u = await authService.getMe();
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const u = await authService.getMe();
    setUser(u);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isMusician: user?.role === 'Musician',
      isEmployer: user?.role === 'Organizer' || user?.role === 'Venue',
      isAdmin: user?.role === 'Admin',
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalı.');
  return ctx;
}
