import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();
        const valid = await validateSession(token);
        return NextResponse.json({ valid });
    } catch {
        return NextResponse.json({ valid: false });
    }
}
