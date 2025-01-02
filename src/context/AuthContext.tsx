import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  userAttributes: any;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN; 
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID; 
const logoutUri = "http://localhost:3000"; 

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const oidcAuth = useOidcAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!oidcAuth.isLoading) {
      setLoading(false);
    }
  }, [oidcAuth.isLoading]);

  const signIn = async () => {
    try {
      await oidcAuth.signinRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Use Cognito's logout endpoint
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    isAuthenticated: oidcAuth.isAuthenticated,
    user: oidcAuth.user,
    userAttributes: oidcAuth.user?.profile,
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