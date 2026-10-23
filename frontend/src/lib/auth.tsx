'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { User } from './types';
import { ApiError, apiLogin, apiLoginGoogle, apiGetMe, getAuthToken, removeAuthToken, setAuthToken } from './api';

type LoginResult = { success: true; user: User } | { success: false; error: string };

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginWithGoogle: (credential: string) => Promise<LoginResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, isLoggedIn: false, isAdmin: false, isReady: false,
  login: async () => ({ success: false, error: 'Sesi belum siap.' }),
  loginWithGoogle: async () => ({ success: false, error: 'Sesi belum siap.' }),
  logout: () => {}, refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const generation = useRef(0);
  const refreshSequence = useRef(0);

  const logout = useCallback(() => {
    generation.current += 1;
    removeAuthToken();
    setUser(null);
    setIsReady(true);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    const currentRefresh = ++refreshSequence.current;
    const currentGeneration = generation.current;
    if (!token) {
      setUser(null);
      setIsReady(true);
      return;
    }
    try {
      const currentUser = await apiGetMe();
      if (generation.current === currentGeneration && refreshSequence.current === currentRefresh && getAuthToken() === token) setUser(currentUser);
    } catch (error) {
      if (generation.current === currentGeneration && refreshSequence.current === currentRefresh && getAuthToken() === token && error instanceof ApiError && error.status === 401) logout();
    } finally {
      if (generation.current === currentGeneration && refreshSequence.current === currentRefresh) setIsReady(true);
    }
  }, [logout]);

  useEffect(() => {
    void refreshUser();
    const focus = () => { if (document.visibilityState === 'visible') void refreshUser(); };
    const storage = (event: StorageEvent) => {
      if (event.key === 'gls_token' || event.key === null) {
        generation.current += 1;
        setUser(null);
        void refreshUser();
      }
    };
    window.addEventListener('focus', focus);
    document.addEventListener('visibilitychange', focus);
    window.addEventListener('storage', storage);
    window.addEventListener('gcl:unauthorized', logout);
    const interval = window.setInterval(focus, 30_000);
    return () => {
      generation.current += 1;
      window.clearInterval(interval);
      window.removeEventListener('focus', focus);
      document.removeEventListener('visibilitychange', focus);
      window.removeEventListener('storage', storage);
      window.removeEventListener('gcl:unauthorized', logout);
    };
  }, [refreshUser, logout]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const currentGeneration = ++generation.current;
    try {
      const session = await apiLogin(email, password);
      if (generation.current !== currentGeneration) return { success: false, error: 'Sesi berubah. Silakan masuk kembali.' };
      setAuthToken(session.token);
      setUser(session.user);
      setIsReady(true);
      return { success: true, user: session.user };
    } catch (error) {
      if (generation.current === currentGeneration) setIsReady(true);
      return { success: false, error: error instanceof Error ? error.message : 'Login gagal.' };
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential: string): Promise<LoginResult> => {
    const currentGeneration = ++generation.current;
    try {
      const session = await apiLoginGoogle(credential);
      if (generation.current !== currentGeneration) return { success: false, error: 'Sesi berubah. Silakan masuk kembali.' };
      setAuthToken(session.token);
      setUser(session.user);
      setIsReady(true);
      return { success: true, user: session.user };
    } catch (error) {
      if (generation.current === currentGeneration) setIsReady(true);
      return { success: false, error: error instanceof Error ? error.message : 'Login dengan Google gagal.' };
    }
  }, []);

  return <AuthContext.Provider value={{ user, isLoggedIn: !!user, isAdmin: user?.role === 'admin', login, loginWithGoogle, logout, refreshUser, isReady }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
