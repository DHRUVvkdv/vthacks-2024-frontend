import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/profile'];
  const path = request.nextUrl.pathname;

  // Skip middleware for auth callback URLs
  if (request.nextUrl.searchParams.has('code') || 
      request.nextUrl.searchParams.has('error') ||
      request.nextUrl.searchParams.has('state')) {
    return NextResponse.next();
  }

  // Check if the path is protected
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    const authCookies = request.cookies.getAll().filter(cookie => 
      cookie.name.startsWith('oidc.') || 
      cookie.name === 'auth-token' ||
      cookie.name.includes('cognito')
    );

    console.log('Auth cookies found:', authCookies.map(c => c.name));
    
    if (authCookies.length === 0) {
      console.log('No auth cookies found, redirecting to home');
      // Store the attempted path before redirect
      const url = new URL('/home', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*'
  ]
};