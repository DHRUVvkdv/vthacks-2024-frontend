import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import { useRouter, useSearchParams } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  userAttributes: any;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const oidcAuth = useOidcAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthStateChange = async () => {
      console.log('Auth State:', {
        isAuthenticated: oidcAuth.isAuthenticated,
        isLoading: oidcAuth.isLoading,
        user: oidcAuth.user,
      });

      if (!oidcAuth.isLoading) {
        if (oidcAuth.error) {
          console.error('Auth error:', oidcAuth.error);
          setLoading(false);
          return;
        }

        if (oidcAuth.isAuthenticated && oidcAuth.user) {
          // Handle redirect if present
          const redirectPath = searchParams.get('redirect');
          if (redirectPath) {
            router.push(redirectPath);
          }
        }

        setLoading(false);
      }
    };

    handleAuthStateChange();
  }, [oidcAuth.isLoading, oidcAuth.isAuthenticated, oidcAuth.error, oidcAuth.user, router, searchParams]);

  const signIn = async () => {
    try {
      // Simpler sign-in without storage manipulation
      const redirectPath = searchParams.get('redirect');
      if (redirectPath) {
        sessionStorage.setItem('postLoginRedirect', redirectPath);
      }
      await oidcAuth.signinRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear auth cookie
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      if (oidcAuth.user) {
        await oidcAuth.removeUser();
      }
      router.push('/home');
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/home');
    }
  };

  const value = {
    isAuthenticated: !!oidcAuth.user && oidcAuth.isAuthenticated,
    user: oidcAuth.user,
    userAttributes: oidcAuth.user?.profile,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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