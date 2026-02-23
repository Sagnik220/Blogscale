import { NextResponse } from 'next/server';
import { ensureAdminUser } from '@/lib/auth';

// POST /api/auth/seed — Seed the initial admin user.
// This endpoint should be called once to create the admin account.
// In production, remove this endpoint or protect it with a secret.

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const seedSecret = process.env.SEED_SECRET || 'blogscale-setup-2026';

        if (authHeader !== `Bearer ${seedSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        await ensureAdminUser(email, password);

        return NextResponse.json({ success: true, message: `Admin user ${email} has been created/verified.` });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Failed to seed admin user' }, { status: 500 });
    }
}
