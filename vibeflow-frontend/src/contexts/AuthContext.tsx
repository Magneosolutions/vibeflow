import React, { useState, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; // Import ReactNode as a type
import {
  // type Auth, // Auth type is not explicitly used, can be removed
  type User, // Import User as a type
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider, // Added for potential Google Sign-In
  signInWithPopup // Added for potential Google Sign-In
} from 'firebase/auth';
import { auth as firebaseAuth } from '../firebaseConfig'; // Import the auth instance from firebaseConfig

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loadingAuth: boolean; // To indicate auth state is being determined
  login: (email?: string, password?: string) => Promise<User | null>;
  logout: () => Promise<void>;
  signup: (email?: string, password?: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>; // Added for Google Sign-In
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // Start as true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      setLoadingAuth(false); // Auth state determined
      console.log('Auth state changed, user:', user ? user.uid : null);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email?: string, password?: string): Promise<User | null> => {
    if (!email || !password) {
      throw new Error('Email and password are required for login.');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      console.log('Login successful:', userCredential.user.uid);
      // onAuthStateChanged will handle setting currentUser and isAuthenticated
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      // Let the UI component handle displaying the error message
      throw error; // Re-throw to be caught by the calling component
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(firebaseAuth);
      console.log('User logged out successfully');
      // onAuthStateChanged will handle setting currentUser and isAuthenticated to null/false
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const signup = async (email?: string, password?: string): Promise<User | null> => {
    if (!email || !password) {
      throw new Error('Email and password are required for signup.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      console.log('Signup successful:', userCredential.user.uid);
      // onAuthStateChanged will handle setting currentUser and isAuthenticated
      return userCredential.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log('Google sign-in successful:', user.uid);
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      throw error;
    }
  };


  const value = {
    currentUser,
    isAuthenticated,
    loadingAuth,
    login,
    logout,
    signup,
    signInWithGoogle
  };

  // Don't render children until auth state is determined to prevent flicker
  // or rendering protected content prematurely
  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};
