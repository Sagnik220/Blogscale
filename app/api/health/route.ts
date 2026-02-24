import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase.from('blogs').select('id').limit(1);

        const diagnostic = {
            status: error ? 'error' : 'ok',
            database_reachable: !error,
            env_vars: {
                url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                key_set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            },
            error: error || null,
        };

        return NextResponse.json(diagnostic, { status: error ? 500 : 200 });
    } catch (err: any) {
        return NextResponse.json({
            status: 'exception',
            message: err.message,
            stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        }, { status: 500 });
    }
}
