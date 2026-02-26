import { NextRequest, NextResponse } from 'next/server';

function requiresAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/contact-messages')) return true;
  if (pathname.startsWith('/api/site-profiles')) return true;
  if (pathname === '/api/contact' && request.method === 'GET') return true;
  if (pathname === '/api/site-profile' && request.method === 'PUT') return true;
  if (pathname === '/api/auth/me') return true;
  return false;
}

export function middleware(request: NextRequest) {
  if (!requiresAuth(request)) return NextResponse.next();

  const apiKey = request.headers.get('x-api-key');
  const authorization = request.headers.get('authorization');

  if (apiKey && apiKey === process.env.API_KEY) {
    return NextResponse.next();
  }

  if (authorization && authorization.startsWith('Bearer ')) {
    return NextResponse.next();
  }

  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

export const config = {
  matcher: [
    '/api/contact',
    '/api/site-profile',
    '/api/contact-messages/:path*',
    '/api/site-profiles/:path*',
    '/api/auth/me'
  ]
};
