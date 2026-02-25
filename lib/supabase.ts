import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// diagnostic for logging
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('--- VERCEL ENV DIAGNOSTIC ---');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `Set (Length: ${supabaseUrl.length})` : 'MISSING');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? `Set (Length: ${supabaseServiceKey.length})` : 'MISSING');
} else {
    const isCloudKey = supabaseServiceKey.startsWith('ey');
    const isLocalKey = supabaseServiceKey.startsWith('sb_');

    if (process.env.NODE_ENV === 'production') {
        console.log('--- SUPABASE CONFIG DIAGNOSTIC ---');
        console.log('URL Host:', new URL(supabaseUrl).hostname);
        console.log('Key Type:', isCloudKey ? 'Cloud (JWT)' : isLocalKey ? 'Local CLI (INCOMPATIBLE WITH CLOUD)' : 'Unknown');

        if (!isCloudKey) {
            console.error('FATAL: The provided SUPABASE_SERVICE_ROLE_KEY does not appear to be a standard Cloud JWT (should start with "ey").');
            if (isLocalKey) {
                console.error('DETECTED: You are using a local CLI key (starts with "sb_"). These do NOT work with Supabase Cloud projects.');
            }
            console.error('ACTION REQUIRED: Get the Service Role key from your Supabase Dashboard -> Settings -> API.');
        }
    }
}

// Export a getter to ensure we get a fresh client or throw a better error
export const getSupabaseClient = () => {
    if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
        throw new Error('Invalid or missing NEXT_PUBLIC_SUPABASE_URL. Please check your Vercel Environment Variables.');
    }
    if (!supabaseServiceKey || supabaseServiceKey.length < 20) {
        throw new Error('Invalid or missing SUPABASE_SERVICE_ROLE_KEY. Please check your Vercel Environment Variables.');
    }
    if (supabaseServiceKey.startsWith('sb_') && !supabaseUrl.includes('localhost') && !supabaseUrl.includes('127.0.0.1')) {
        throw new Error('Incompatible Key: Using a local CLI key ("sb_...") with a cloud Supabase URL. Please use the keys from the Supabase Dashboard.');
    }
    return createClient(supabaseUrl, supabaseServiceKey);
};

export const supabase = getSupabaseClient();
