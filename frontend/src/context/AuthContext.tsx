'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: 'startup' | 'supporter' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: any;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setToken(data.token);
    if (data.user.role === 'admin') {
      router.push('/admin');
    } else if (data.user.role === 'startup') {
      router.push('/dashboard/startup');
    } else {
      router.push('/dashboard/supporter');
    }
  };

  const register = async (email: string, password: string, role: string) => {
    const { data } = await api.post('/auth/register', { email, password, role });
    setUser(data.user);
    setToken(data.token);
    if (role === 'startup') {
      router.push('/profile/startup');
    } else {
      router.push('/profile/supporter');
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setProfile(null);
    setToken(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, token, login, register, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
