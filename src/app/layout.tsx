'use client';

import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { AuthProvider as CustomAuthProvider } from '@/context/AuthContext';
import { AuthProvider } from "react-oidc-context";
import { Suspense } from "react";
import { User } from 'oidc-client-ts';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const openDyslexic = localFont({
  src: "./fonts/OpenDyslexic-Regular.woff",
  variable: "--font-dyslexic-off",
  weight: "100 900",
});

const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  redirect_uri: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_REDIRECT_URI,
  response_type: "code",
  scope: "openid",
  loadUserInfo: true,
  onSigninCallback: (user: User | void) => {
    if (user && 'access_token' in user) {
      const maxAge = 3600 * 8; // 8 hours
      document.cookie = `auth-token=${user.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased ${geistSans.variable} ${geistMono.variable} ${openDyslexic.variable}`}>
        <AuthProvider {...oidcConfig}>
          <CustomAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense fallback={<Loading />}>
                <Navbar />
                {children}
              </Suspense>
            </ThemeProvider>
          </CustomAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}