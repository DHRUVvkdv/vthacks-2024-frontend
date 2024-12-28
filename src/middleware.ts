// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // List of protected paths
  const protectedPaths = ['/planner', '/profile'];
  const path = request.nextUrl.pathname;

  // Check if the path is protected
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    const authSession = request.cookies.get('amplify-authenticator-authState');
    
    if (!authSession) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/planner/:path*', '/profile/:path*'],
};