import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/planner', '/profile'];
  const path = request.nextUrl.pathname;

  // Skip middleware for auth callback URLs
  if (request.nextUrl.searchParams.has('code') || 
      request.nextUrl.searchParams.has('error')) {
    return NextResponse.next();
  }

  // Check if the path is protected
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    // Check for auth token cookie
    const authToken = request.cookies.get('auth-token');
    
    if (!authToken?.value) {
      console.log('No auth token found, redirecting to home');
      const url = new URL('/home', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/planner/:path*',
    '/profile/:path*'
  ]
};