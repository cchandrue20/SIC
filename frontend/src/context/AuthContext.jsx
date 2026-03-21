'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Timeout after 3 seconds so login/register never hang forever
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
      );
      const { data } = await Promise.race([api.get('/auth/me'), timeout]);
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
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

  const register = async (email, password, role) => {
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
