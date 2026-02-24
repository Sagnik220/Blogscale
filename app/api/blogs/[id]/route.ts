import { NextResponse } from 'next/server';
import { updateBlog, deleteBlog } from '@/lib/blogs';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();
        await updateBlog(Number(id), data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await deleteBlog(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
