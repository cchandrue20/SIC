import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  console.log('MIDDLEWARE EXEC:', pathname);

  // Public paths – always accessible
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/browse',
    '/forgot-password',
    '/reset-password',
    '/profile/startup',
    '/profile/supporter',
  ];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
