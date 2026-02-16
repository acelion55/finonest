import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getDeviceId, clearDeviceId } from '../utils/deviceId.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceId] = useState(getDeviceId());

  // Load user from token on mount
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Device-Id': deviceId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setToken(null);
        localStorage.removeItem('token');
        clearDeviceId();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setToken(null);
      localStorage.removeItem('token');
      clearDeviceId();
    } finally {
      setLoading(false);
    }
  };

  const signup = useCallback(async (email, password, confirmPassword, fullName, phoneNumber) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Id': deviceId,
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          fullName,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const message = 'Signup failed: ' + err.message;
      setError(message);
      return { success: false, message };
    }
  }, [deviceId]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Id': deviceId,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const message = 'Login failed: ' + err.message;
      setError(message);
      return { success: false, message };
    }
  }, [deviceId]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    clearDeviceId();
  }, []);

  const updateProfile = useCallback(
    async (profileData) => {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Device-Id': deviceId,
          },
          body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          return { success: true, message: data.message };
        } else {
          setError(data.message);
          return { success: false, message: data.message };
        }
      } catch (err) {
        const message = 'Update profile failed: ' + err.message;
        setError(message);
        return { success: false, message };
      }
    },
    [token, deviceId]
  );

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
