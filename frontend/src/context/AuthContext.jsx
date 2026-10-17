import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const OFFICIAL_CREDENTIALS = [
  {
    role: 'admin',
    email: 'kadiyanjatin28@gmail.com',
    password: 'Password@123',
    id: '7fc51e31-a141-4b9b-9216-ab06dbd4fdbc',
    full_name: 'Jatin Kadiyan',
    department: 'Office of Campus Administration',
    badge: 'Campus Administrator'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [demoAccounts, setDemoAccounts] = useState({
    student: null,
    staff: null,
    admin: null,
    all: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const res = await api.getDemoAccounts();
      if (res.success && res.data) {
        setDemoAccounts({
          student: res.data.defaults?.student || null,
          staff: res.data.defaults?.staff || null,
          admin: res.data.defaults?.admin || OFFICIAL_CREDENTIALS[0],
          all: res.data.all || OFFICIAL_CREDENTIALS
        });

        // Check if there is a saved user in localStorage
        const savedId = localStorage.getItem('glitchxgreen_user_id');
        if (savedId) {
          const matched = (res.data.all || []).find(u => u.id === savedId) || OFFICIAL_CREDENTIALS.find(c => c.id === savedId);
          if (matched) {
            setCurrentUser(matched);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    } catch (err) {
      console.error('Error loading accounts:', err);
      const savedId = localStorage.getItem('glitchxgreen_user_id');
      const matched = OFFICIAL_CREDENTIALS.find(c => c.id === savedId);
      setCurrentUser(matched || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data?.user) {
        const user = res.data.user;
        setCurrentUser(user);
        localStorage.setItem('glitchxgreen_user_id', user.id);
        if (res.data.token) {
          localStorage.setItem('glitchxgreen_token', res.data.token);
        }
        await fetchAccounts();
        return { success: true, user };
      }
      return { success: false, error: res.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Login connection error' };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success && res.data?.user) {
        const user = res.data.user;
        setCurrentUser(user);
        localStorage.setItem('glitchxgreen_user_id', user.id);
        if (res.data.token) {
          localStorage.setItem('glitchxgreen_token', res.data.token);
        }
        await fetchAccounts();
        return { success: true, user };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration connection error' };
    }
  };

  // Reset password handler
  const resetPassword = async (email, newPassword) => {
    try {
      const res = await api.resetPassword({ email, newPassword });
      return res;
    } catch (err) {
      return { success: false, error: err.message || 'Password reset error' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('glitchxgreen_token');
    localStorage.removeItem('glitchxgreen_user_id');
    setCurrentUser(null);
  };

  const switchUser = (user) => {
    if (!user) return;
    setCurrentUser(user);
    localStorage.setItem('glitchxgreen_user_id', user.id);
  };

  const switchRole = (roleName) => {
    if (demoAccounts[roleName]) {
      switchUser(demoAccounts[roleName]);
      return;
    }
    const match = (demoAccounts.all || []).find(u => u.role === roleName);
    if (match) {
      switchUser(match);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        demoAccounts,
        credentials: [],
        login,
        register,
        resetPassword,
        logout,
        switchUser,
        switchRole,
        loading,
        refreshAccounts: fetchAccounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
