import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Sanitize filename and add timestamp to avoid collisions
        const safeRegex = /[^a-zA-Z0-9.-]/g;
        const sanitizedName = file.name.replace(safeRegex, '-');
        const filename = `${Date.now()}-${sanitizedName}`;
        const filePath = `uploads/${filename}`;

        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
    } catch (error) {
        console.error('Error in upload route:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
