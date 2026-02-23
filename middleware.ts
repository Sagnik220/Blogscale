import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('blogscale_session')?.value;

    // To validate sessions against Supabase in middleware (Edge Runtime),
    // we call an internal API endpoint that checks the DB.
    let isAuthenticated = false;

    if (sessionToken) {
        try {
            const validateUrl = new URL('/api/auth/validate', request.url);
            const res = await fetch(validateUrl.toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: sessionToken }),
            });
            const data = await res.json();
            isAuthenticated = data.valid === true;
        } catch {
            isAuthenticated = false;
        }
    }

    // Smart redirect: already-authenticated users bypass the login page
    if (pathname === '/admin/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Also redirect /admin root to dashboard if authenticated
    if (pathname === '/admin' && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Define protected routes
    const isProtectedAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
    const isProtectedApiRoute = pathname.startsWith('/api/blogs') && request.method !== 'GET';
    const isUploadApiRoute = pathname.startsWith('/api/upload');

    const needsAuth = isProtectedAdminRoute || isProtectedApiRoute || isUploadApiRoute;

    if (needsAuth && !isAuthenticated) {
        if (isProtectedAdminRoute) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/blogs/:path*', '/api/upload'],
};
