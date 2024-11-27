import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';
import { api } from './api';

export const authService = {
  async login(credentials: LoginCredentials) {
    const formData = new FormData();
    // Use 'username' instead of 'email' as expected by the API
    formData.append('username', credentials.email); // email is used as username
    formData.append('password', credentials.password);
    
    const { data } = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async register(credentials: RegisterCredentials) {
    try {
      const { data } = await api.post<AuthResponse>('/register', credentials);
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  }
};
