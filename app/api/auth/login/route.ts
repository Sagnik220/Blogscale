import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createSession, checkRateLimit } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        // Rate limiting
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
        const rateCheck = checkRateLimit(ip);

        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${rateCheck.retryAfter}s.` },
                { status: 429 }
            );
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const { valid, userId } = await verifyAdminCredentials(email, password);

        if (!valid || !userId) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create a secure, random session token stored in the DB
        const sessionToken = await createSession(userId);

        const response = NextResponse.json({ success: true }, { status: 200 });

        response.cookies.set('blogscale_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
