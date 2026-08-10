import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '@/services/authService';
import type { AppUser, AppUserLoginInput, AppUserRegisterInput } from '@/types';

const SESSION_KEY = 'sahnem:session';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isMusician: boolean;
  isEmployer: boolean;
  login: (input: AppUserLoginInput) => Promise<AppUser>;
  register: (input: AppUserRegisterInput) => Promise<AppUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem(SESSION_KEY);
    if (!savedId) {
      setLoading(false);
      return;
    }
    authService
      .getById(Number(savedId))
      .then((u) => setUser(u ?? null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (input: AppUserLoginInput) => {
    const u = await authService.login(input);
    localStorage.setItem(SESSION_KEY, String(u.id));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (input: AppUserRegisterInput) => {
    const u = await authService.register(input);
    localStorage.setItem(SESSION_KEY, String(u.id));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const u = await authService.getById(user.id);
    setUser(u ?? null);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isMusician: user?.role === 'Musician',
      isEmployer: user?.role === 'Organizer' || user?.role === 'Venue',
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
