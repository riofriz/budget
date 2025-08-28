import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth');
    const isAuthenticated = authCookie?.value === 'true';
    const { pathname } = request.nextUrl;
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthenticated && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
