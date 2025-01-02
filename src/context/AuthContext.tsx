'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signOut as amplifySignOut, signInWithRedirect, fetchUserAttributes } from '@aws-amplify/auth';
import type { AuthUser, FetchUserAttributesOutput } from '@aws-amplify/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userAttributes: FetchUserAttributesOutput | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userAttributes, setUserAttributes] = useState<FetchUserAttributesOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setIsAuthenticated(true);
      setUser(currentUser);
      setUserAttributes(attributes);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setUserAttributes(null);
    } finally {
      setLoading(false);
    }
  }

async function signIn() {
  try {
    console.log('Starting sign in process...');
    await signInWithRedirect();
    console.log('Sign in redirect completed');
  } catch (error) {
    console.error('Sign in error:', error);
    if (error instanceof Error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

  async function signOut() {
    try {
      await amplifySignOut();
      setIsAuthenticated(false);
      setUser(null);
      setUserAttributes(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const value = {
    isAuthenticated,
    user,
    userAttributes,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}