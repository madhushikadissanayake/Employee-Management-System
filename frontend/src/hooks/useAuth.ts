"use client";
import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
    return user;
  };

  const signup = async (userData: Omit<import('../types/auth').SignupFormData, 'confirmPassword'>) => {
    const { user } = await authService.signup(userData);
    setUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };
}