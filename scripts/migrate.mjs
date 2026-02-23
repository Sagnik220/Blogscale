// Run this script with: node scripts/migrate.mjs
// It adds author, social links, and view tracking to the database

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnttyxanlfnhuvboqskq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function runSQL(sql) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
    });
    return { status: res.status, body: await res.text() };
}

// Since we can't run raw SQL through the REST API,
// we'll use the /pg endpoint (Supabase SQL API)
async function execSQL(sql) {
    const res = await fetch(`${SUPABASE_URL}/pg/query`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
    });
    return { status: res.status, body: await res.text() };
}

async function main() {
    console.log('🔄 Running BlogScale database migration...\n');

    const migrations = [
        'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_name TEXT',
        'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_title TEXT',
        'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author_bio TEXT',
        'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS twitter_url TEXT',
        'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS linkedin_url TEXT',
        'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS website_url TEXT',
        'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0',
        `CREATE TABLE IF NOT EXISTS blog_views (
            id BIGSERIAL PRIMARY KEY,
            blog_id BIGINT REFERENCES blogs(id) ON DELETE CASCADE,
            visitor_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(blog_id, visitor_hash)
        )`,
    ];

    for (const sql of migrations) {
        const result = await execSQL(sql);
        const label = sql.split('\n')[0].substring(0, 60);
        if (result.status === 200 || result.status === 201) {
            console.log(`✅ ${label}...`);
        } else {
            console.log(`❌ ${label}... (${result.status})`);
            console.log(`   ${result.body}`);
        }
    }

    console.log('\n✅ Migration complete!');
    console.log('\n📋 If any migrations failed, run the SQL manually in the Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/pnttyxanlfnhuvboqskq/sql/new');
    console.log('\nSQL to run:');
    console.log('─'.repeat(60));
    console.log(migrations.join(';\n') + ';');
}

main().catch(console.error);
