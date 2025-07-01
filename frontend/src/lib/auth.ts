// src/lib/auth.ts

import { User, SignupFormData } from '../types/auth';

class AuthService {
  private storageKey = 'ems_auth_data';

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@ems.com' && password === 'admin123') {
      const user: User = {
        _id: '1',
        fullName: 'System Administrator',
        email: 'admin@ems.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      const token = 'mock_jwt_token_' + Date.now();
      this.setAuthData({ user, token });
      return { user, token };
    }

    throw new Error('Invalid email or password');
  }

  async signup(userData: Omit<SignupFormData, 'confirmPassword'>): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      _id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString()
    };

    const token = 'mock_jwt_token_' + Date.now();
    this.setAuthData({ user, token });
    return { user, token };
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const { user } = JSON.parse(data);
        return user;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const { token } = JSON.parse(data);
        return token;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  private setAuthData(data: { user: User; token: string }): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }
}

export const authService = new AuthService();
