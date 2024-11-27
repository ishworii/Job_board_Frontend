import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { AuthResponse } from '../types/auth';

interface AuthContextType {
  user: AuthResponse | null;
  setUser: (user: AuthResponse | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);

  const isAuthenticated = !!user;

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Add this effect to check for user session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You'll need to create an endpoint to get user profile
      api.get('/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
