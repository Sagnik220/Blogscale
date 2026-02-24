import { createClient } from '@supabase/supabase-js';

// Use fallbacks during build time to prevent "supabaseUrl is required" errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';

// Server-side client using service role key (full access, never exposed to browser)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
