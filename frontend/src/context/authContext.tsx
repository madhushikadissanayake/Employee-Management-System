"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../lib/auth";
import { User } from "../types/auth";

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (userData: Omit<any, "confirmPassword">) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  initialized: boolean; // Add this to track if auth state is initialized
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Start with false
  const [initialized, setInitialized] = useState(false); // Track initialization

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check if there's a stored token/user
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Optionally verify the token is still valid
          // You might want to add a token validation endpoint
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid stored auth data
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await authService.login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: Omit<any, "confirmPassword">) => {
    try {
      setLoading(true);
      const { user } = await authService.signup(userData);
      setUser(user);
      return user;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setLoading(true);
    authService.logout();
    setUser(null);
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}