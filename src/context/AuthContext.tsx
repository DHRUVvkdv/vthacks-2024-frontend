import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  userAttributes: any;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setAuthCookie(token: string) {
  const secure = process.env.NODE_ENV === 'production';
  const maxAge = 3600 * 8; // 8 hours
  document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secure ? '; Secure' : ''}`;
}

function clearAuthCookie() {
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'oidc.user:*=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const oidcAuth = useOidcAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleAuthStateChange = async () => {
      if (!oidcAuth.isLoading) {
        if (oidcAuth.error) {
          console.error('Auth error:', oidcAuth.error);
          clearAuthCookie();
          setLoading(false);
          return;
        }

        if (oidcAuth.isAuthenticated && oidcAuth.user?.access_token) {
          // Set the auth cookie whenever we have a valid token
          setAuthCookie(oidcAuth.user.access_token);
        }

        setLoading(false);
      }
    };

    handleAuthStateChange();
  }, [oidcAuth.isLoading, oidcAuth.isAuthenticated, oidcAuth.error, oidcAuth.user]);

  const signIn = async () => {
    try {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      sessionStorage.setItem('postLoginRedirect', currentPath);
      await oidcAuth.signinRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      clearAuthCookie();
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