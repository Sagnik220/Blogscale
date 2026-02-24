import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// diagnostic for logging
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('--- VERCEL ENV DIAGNOSTIC ---');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'OK' : 'MISSING');
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
