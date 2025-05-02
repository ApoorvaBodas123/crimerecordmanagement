
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define user types
export type UserRole = 'citizen' | 'police' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Police Officer', email: 'police@example.com', role: 'police' },
  { id: '3', name: 'Citizen User', email: 'citizen@example.com', role: 'citizen' }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('civicEyeUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        
        if (foundUser && password === 'password') {  // Simple mock auth
          setUser(foundUser);
          localStorage.setItem('civicEyeUser', JSON.stringify(foundUser));
          toast.success(`Welcome back, ${foundUser.name}`);
          resolve(true);
        } else {
          toast.error("Invalid email or password");
          resolve(false);
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find(u => u.email === email);
        
        if (existingUser) {
          toast.error("Email already in use");
          resolve(false);
        } else {
          const newUser: User = {
            id: `${MOCK_USERS.length + 1}`,
            name,
            email,
            role
          };
          
          // In a real app, we would save this to a database
          // This is just for demonstration purposes
          MOCK_USERS.push(newUser);
          setUser(newUser);
          localStorage.setItem('civicEyeUser', JSON.stringify(newUser));
          toast.success("Registration successful");
          resolve(true);
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('civicEyeUser');
    setUser(null);
    toast.info("You have been logged out");
  };

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
