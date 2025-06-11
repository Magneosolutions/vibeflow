import React, { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => void;
  signup: (email?: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email?: string, password?: string) => {
    console.log('Simulating login with:', email, password);
    if (email === 'demo@example.com' && password === 'password123') {
      setIsAuthenticated(true);
      console.log('Demo login successful');
    } else {
      setIsAuthenticated(false);
      console.log('Demo login failed: Invalid credentials');
      alert('Invalid demo credentials. Use demo@example.com and password123');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    console.log('User logged out (simulated)');
  };

  const signup = async (email?: string, password?: string) => {
    console.log('Simulating signup with:', email, password);
    if (email === 'demo@example.com' && password === 'password123') {
      setIsAuthenticated(true);
      console.log('Demo signup successful, user logged in.');
    } else {
      console.log('Demo signup: For this demo, please use demo@example.com and password123 to "sign up" and log in.');
      alert('For this demo, please use demo@example.com and password123 to "sign up" and log in.');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
