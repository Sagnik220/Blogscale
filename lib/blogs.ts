import { supabase } from './supabase';

export interface Blog {
    id: number;
    title: string;
    slug: string;
    snippet: string | null;
    content: string;
    image_url: string | null;
    author_name: string | null;
    author_title: string | null;
    author_bio: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export async function getAllBlogs(): Promise<Blog[]> {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }

    return data as Blog[];
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return undefined;
        console.error('Error fetching blog by slug:', error);
        throw error;
    }

    return data as Blog;
}

export async function createBlog(
    data: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'view_count'>
): Promise<number> {
    const { data: result, error } = await supabase
        .from('blogs')
        .insert({
            title: data.title,
            slug: data.slug,
            snippet: data.snippet,
            content: data.content,
            image_url: data.image_url,
            author_name: data.author_name,
            author_title: data.author_title,
            author_bio: data.author_bio,
            twitter_url: data.twitter_url,
            linkedin_url: data.linkedin_url,
            website_url: data.website_url,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating blog:', error);
        throw error;
    }

    return result.id;
}

export async function updateBlog(
    id: number,
    data: Partial<Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'view_count'>>
): Promise<void> {
    const { error } = await supabase
        .from('blogs')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error updating blog:', error);
        throw error;
    }
}

export async function deleteBlog(id: number): Promise<void> {
    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }
}

// ─── View Tracking ───

export async function incrementViewCount(blogId: number, visitorHash: string): Promise<number> {
    // Try to insert a unique view (will fail silently if already exists due to UNIQUE constraint)
    const { error: insertError } = await supabase
        .from('blog_views')
        .insert({ blog_id: blogId, visitor_hash: visitorHash })
        .select();

    if (insertError && insertError.code !== '23505') {
        // 23505 = unique_violation, which is expected for repeat views
        console.error('Error tracking view:', insertError);
    }

    // Count total unique views for this blog
    const { count, error: countError } = await supabase
        .from('blog_views')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', blogId);

    if (countError) {
        console.error('Error counting views:', countError);
        return 0;
    }

    const viewCount = count || 0;

    // Update the denormalized view_count on the blog
    await supabase
        .from('blogs')
        .update({ view_count: viewCount })
        .eq('id', blogId);

    return viewCount;
}
