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
  const sameSite = process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax';
  const maxAge = 3600 * 8; // 8 hours
  document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
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
        console.log('Auth state changed:', {
          isAuthenticated: oidcAuth.isAuthenticated,
          hasUser: !!oidcAuth.user,
          hasError: !!oidcAuth.error
        });

        if (oidcAuth.error) {
          console.error('Auth error:', oidcAuth.error);
          clearAuthCookie();
          setLoading(false);
          return;
        }

        if (oidcAuth.isAuthenticated && oidcAuth.user?.access_token) {
          console.log('Setting auth cookie');
          setAuthCookie(oidcAuth.user.access_token);
          
          // Check for redirect after login
          const redirectPath = sessionStorage.getItem('postLoginRedirect');
          if (redirectPath) {
            sessionStorage.removeItem('postLoginRedirect');
            router.push(redirectPath);
          }
        }

        setLoading(false);
      }
    };

    handleAuthStateChange();
  }, [oidcAuth.isLoading, oidcAuth.isAuthenticated, oidcAuth.error, oidcAuth.user, router]);

  console.log('Auth Provider State:', {  
    isAuthenticated: oidcAuth.isAuthenticated,
    loading,
    hasUser: !!oidcAuth.user
  });

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