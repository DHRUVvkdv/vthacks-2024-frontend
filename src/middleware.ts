import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/planner', '/profile'];
  const path = request.nextUrl.pathname;

  console.log('Middleware running for path:', path);

  // Skip middleware for auth callback URLs
  if (request.nextUrl.searchParams.has('code') || 
      request.nextUrl.searchParams.has('error')) {
    return NextResponse.next();
  }

  // Check if the path is protected
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    // Get all possible auth cookies
    const authCookies = request.cookies.getAll().filter(cookie => 
      cookie.name.startsWith('oidc.') || 
      cookie.name === 'auth-token' ||
      cookie.name.includes('cognito')
    );

    console.log('Auth cookies found:', authCookies.map(c => c.name));
    
    const authToken = request.cookies.get('auth-token');
    
    if (!authToken || authCookies.length === 0) {
      console.log('No auth cookies found, redirecting to home');
      const url = new URL('/home', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }

    // Add auth token to headers for backend requests
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${authToken.value}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/planner/:path*',
    '/profile/:path*'
  ]
};