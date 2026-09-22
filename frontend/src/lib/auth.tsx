'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthSession } from './types';
import { authenticateUser, initializeData } from './data';

// Auth context definition
interface AuthContextValue {
  user: AuthSession['user'] | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isReady: boolean; // true once hydration complete
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  login: () => ({ success: false }),
  logout: () => {},
  isReady: false,
});

const SESSION_KEY = 'gls_session';

// Auth context provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    initializeData(); // seed if first visit
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const session: AuthSession = JSON.parse(raw);
        setUser(session.user);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const matched = authenticateUser(email, password);
    if (!matched) {
      return { success: false, error: 'Email atau kata sandi salah.' };
    }
    const safeUser = {
      id: matched.id,
      email: matched.email,
      name: matched.name,
      role: matched.role,
      createdAt: matched.createdAt,
    };
    const session: AuthSession = { user: safeUser, loginAt: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(safeUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume auth context
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
