export interface User {
  _id?: string;
  fullName: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'hr' | 'employee';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}
