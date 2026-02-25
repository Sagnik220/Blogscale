import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('blogscale_session')?.value;

    // To validate sessions against Supabase in middleware (Edge Runtime),
    // we call an internal API endpoint that checks the DB.
    // 1. PUBLIC ROUTES - Always allow
    const isPublicRoute =
        pathname === '/' ||
        pathname.startsWith('/blog/') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        (pathname.startsWith('/api/blogs') && pathname.endsWith('/views')); // Allow view tracking

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // 2. SESSION VALIDATION
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

    // 3. ADMIN LOGIN REDIRECTS
    if (pathname === '/admin/login') {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // 4. PROTECTED ROUTES
    const isProtectedAdminRoute = pathname.startsWith('/admin');
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
