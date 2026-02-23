import { NextResponse } from 'next/server';
import { updateBlog, deleteBlog } from '@/lib/blogs';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const data = await request.json();
        await updateBlog(Number(params.id), data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await deleteBlog(Number(params.id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
