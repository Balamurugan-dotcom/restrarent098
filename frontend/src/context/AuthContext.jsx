import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('spicegarden_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current user on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/api/auth/me');
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('spicegarden_user', JSON.stringify(data.data));
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (data.success) {
      setUser(data.data);
      setToken(data.data.token);
      localStorage.setItem('spicegarden_token', data.data.token);
      localStorage.setItem('spicegarden_user', JSON.stringify(data.data));
      return data.data;
    }
  };

  const register = async (userData) => {
    const { data } = await api.post('/api/auth/register', userData);
    if (data.success) {
      setUser(data.data);
      setToken(data.data.token);
      localStorage.setItem('spicegarden_token', data.data.token);
      localStorage.setItem('spicegarden_user', JSON.stringify(data.data));
      return data.data;
    }
  };

  const updateProfile = async (profileData) => {
    const { data } = await api.put('/api/auth/profile', profileData);
    if (data.success) {
      setUser(data.data);
      localStorage.setItem('spicegarden_user', JSON.stringify(data.data));
      return data.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spicegarden_token');
    localStorage.removeItem('spicegarden_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
