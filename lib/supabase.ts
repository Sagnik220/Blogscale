import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// diagnostic for logging
// diagnostic for logging
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('--- VERCEL ENV DIAGNOSTIC ---');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `Set (Length: ${supabaseUrl.length})` : 'MISSING');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? `Set (Length: ${supabaseServiceKey.length})` : 'MISSING');
} else if (process.env.NODE_ENV === 'production') {
    const isStandardKey = supabaseServiceKey.startsWith('ey');
    console.log('--- SUPABASE CONFIG DIAGNOSTIC ---');
    console.log('URL:', supabaseUrl);
    console.log('Key Format:', isStandardKey ? 'Standard (JWT)' : 'WRONG FORMAT (Starts with sb_)');
    console.log('Key Length:', supabaseServiceKey.length);

    if (!isStandardKey) {
        console.error('FATAL: The provided SUPABASE_SERVICE_ROLE_KEY is NOT a standard JWT key. It should start with "ey". Please get the Service Role key from Supabase Dashboard -> Settings -> API.');
    }
}

// Export a getter to ensure we get a fresh client or throw a better error
export const getSupabaseClient = () => {
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        throw new Error('Supabase URL is missing. Please add NEXT_PUBLIC_SUPABASE_URL to Vercel environment variables.');
    }
    if (!supabaseServiceKey || supabaseServiceKey === 'placeholder_key') {
        throw new Error('Supabase Service Key is missing. Please add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables.');
    }
    return createClient(supabaseUrl, supabaseServiceKey);
};

export const supabase = getSupabaseClient();
