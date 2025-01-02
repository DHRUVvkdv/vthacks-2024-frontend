'use client';

import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { AuthProvider as CustomAuthProvider } from '@/context/AuthContext';
import { AuthProvider } from "react-oidc-context";

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
  scope: "email openid",
};

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
              <Navbar />
              {children}
            </ThemeProvider>
          </CustomAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}