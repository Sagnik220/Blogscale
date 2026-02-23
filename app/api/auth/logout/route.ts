import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(request: Request) {
    const sessionToken = request.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('blogscale_session='))
        ?.split('=')[1];

    if (sessionToken) {
        await deleteSession(sessionToken);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('blogscale_session');
    return response;
}
