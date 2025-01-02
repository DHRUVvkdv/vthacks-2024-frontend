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

const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const REDIRECT_URI = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const oidcAuth = useOidcAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log environment variables on mount (excluding sensitive data)
    console.log('Auth Configuration:', {
      hasDomain: !!COGNITO_DOMAIN,
      hasClientId: !!CLIENT_ID,
      redirectUri: REDIRECT_URI
    });

    if (!oidcAuth.isLoading) {
      setLoading(false);
    }
  }, [oidcAuth.isLoading]);

  const signIn = async () => {
    try {
      console.log('Initiating sign in...');
      await oidcAuth.signinRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

const signOut = async () => {
  try {
    console.log('Starting sign out process...');
    
    if (!COGNITO_DOMAIN || !CLIENT_ID) {
      throw new Error('Missing Cognito configuration');
    }

    const baseUrl = `https://${COGNITO_DOMAIN}`;
    const logoutUrl = new URL('/logout', baseUrl);
    
    // Use the current origin for logout_uri
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : REDIRECT_URI;
    
    logoutUrl.searchParams.append('client_id', CLIENT_ID);
    logoutUrl.searchParams.append('logout_uri', currentOrigin);

    if (oidcAuth.removeUser) {
      await oidcAuth.removeUser();
    }

    window.location.href = logoutUrl.toString();
  } catch (error) {
    console.error('Error during sign out:', error);
      // Fallback to basic signout if Cognito logout fails
      try {
        console.log('Attempting fallback signout...');
        await oidcAuth.removeUser();
        window.location.href = REDIRECT_URI;
      } catch (fallbackError) {
        console.error('Fallback signout also failed:', fallbackError);
      }
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