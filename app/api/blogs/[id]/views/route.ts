import { NextResponse } from 'next/server';
import { incrementViewCount } from '@/lib/blogs';
import crypto from 'crypto';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const blogId = Number(params.id);
        if (isNaN(blogId)) {
            return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
        }

        // Generate a visitor hash from IP + User-Agent for unique view tracking
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
        const userAgent = request.headers.get('user-agent') || '';
        const visitorHash = crypto
            .createHash('sha256')
            .update(`${ip}:${userAgent}`)
            .digest('hex');

        const viewCount = await incrementViewCount(blogId, visitorHash);

        return NextResponse.json({ views: viewCount });
    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }
}
