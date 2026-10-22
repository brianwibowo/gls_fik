'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from './types';
import { apiLogin, apiLoginGoogle, apiGetMe, getAuthToken, removeAuthToken } from './api';

// Auth context definition
interface AuthContextValue {
  user: Omit<User, 'password'> | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isReady: boolean; // true once hydration complete
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  logout: () => {},
  isReady: false,
});

// Auth context provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Check token and verify session from backend on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsReady(true);
      return;
    }

    apiGetMe()
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        removeAuthToken();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('gls_user');
        }
        setUser(null);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { user: loggedInUser } = await apiLogin(email, password);
      setUser(loggedInUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Email atau kata sandi salah.' };
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    try {
      const { user: loggedInUser } = await apiLoginGoogle(credential);
      setUser(loggedInUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login dengan Google gagal.' };
    }
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gls_user');
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        loginWithGoogle,
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
