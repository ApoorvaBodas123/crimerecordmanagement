import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

// Define user types
export type UserRole = 'police' | 'admin';

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    badgeNumber: string,
    department: string,
    phoneNumber: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token and fetch user data
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data;
      setUser({
        id: userData._id,
        userId: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser({
        id: userData._id || userData.id,
        userId: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      toast.success(`Welcome back, ${userData.name}`);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    badgeNumber: string,
    department: string,
    phoneNumber: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
        badgeNumber,
        department,
        phoneNumber
      });
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser({
        id: userData._id || userData.id,
        userId: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      toast.success('Registration successful');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Failed to register';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('You have been logged out');
  };

  // Add axios interceptor for token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
