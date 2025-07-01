import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  
  signup: (userData: any) => 
    api.post('/auth/signup', userData),
  
  logout: () => 
    api.post('/auth/logout'),
  
  verifyToken: () => 
    api.get('/auth/verify'),
};

// Employee API
export const employeeAPI = {
  getAll: (params?: any) => 
    api.get('/employees', { params }),
  
  getById: (id: string) => 
    api.get(`/employees/${id}`),
  
  create: (data: any) => 
    api.post('/employees', data),
  
  update: (id: string, data: any) => 
    api.put(`/employees/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/employees/${id}`),
  
  getStats: () => 
    api.get('/employees/stats/dashboard'),
};

export default api;
