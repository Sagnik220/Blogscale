import { NextResponse } from 'next/server';
import { getAllBlogs, createBlog } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const blogs = await getAllBlogs();
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const id = await createBlog({
            title: data.title,
            slug: data.slug,
            snippet: data.snippet,
            content: data.content,
            image_url: data.image_url,
            author_name: data.author_name || null,
            author_title: data.author_title || null,
            author_bio: data.author_bio || null,
            twitter_url: data.twitter_url || null,
            linkedin_url: data.linkedin_url || null,
            website_url: data.website_url || null,
        });
        return NextResponse.json({ id, ...data }, { status: 201 });
    } catch (error) {
        console.error('Failed to create blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}
