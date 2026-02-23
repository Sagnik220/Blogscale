import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/lib/blogs';
import Link from 'next/link';
import { marked } from 'marked';
import './article.css';
import { ViewTracker } from './ViewTracker';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) return { title: 'Post Not Found' };
    return {
        title: `${blog.title} | BlogScale`,
        description: blog.snippet || 'A technical engineering deep-dive.',
    };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) notFound();

    const htmlContent = marked.parse(blog.content);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#000000', fontFamily: 'var(--font-space, Space Grotesk, sans-serif)', overflowX: 'hidden' }}>

            {/* Progress Bar */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, height: '6px', background: 'transparent' }}>
                <div style={{ height: '100%', background: '#FFD700', width: '45%', transition: 'all 0.3s ease-out', boxShadow: '0 0 10px rgba(255,215,0,0.5)' }}></div>
            </div>

            {/* ===== HEADER ===== */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 90,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '2px solid #000',
                transition: 'all 0.2s',
            }}>
                <div style={{ margin: '0 auto', maxWidth: '1400px', padding: '0 1rem', display: 'flex', height: '80px', alignItems: 'center', justifyContent: 'space-between' }} className="header-padding">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#000', transition: 'opacity 0.2s' }}>
                            <div style={{ width: '32px', height: '32px', background: '#FFD700', padding: '0.375rem', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px rgba(0,0,0,1)' }}>
                                <span className="material-symbols-outlined" style={{ fontWeight: 900, fontSize: '20px' }}>hub</span>
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase' }}>
                                Blog<span style={{ background: '#000', color: '#FFD700', padding: '0 0.25rem' }}>Scale</span>
                            </span>
                        </Link>

                        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' } as any} className="desktop-flex">
                            <Link href="/" className="nav-link-black">Interviews</Link>
                            <Link href="/" className="nav-link-black">Architecture</Link>
                            <Link href="/" className="nav-link-black">Algorithms</Link>
                        </nav>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="btn-icon">
                            <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>search</span>
                        </button>
                        <div style={{ width: '2px', height: '32px', background: '#000' }}></div>
                        <Link href="/admin/login" className="btn-subscribe-black">
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT AREA ===== */}
            <main style={{ position: 'relative', flex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '4rem 1rem', display: 'flex', justifyContent: 'space-between', gap: '4rem' }} className="main-padding">

                {/* Left Sidebar (Sticky Social Actions) */}
                <aside style={{ display: 'none', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '8rem', height: 'max-content', width: '5rem', alignItems: 'center', borderRight: '2px solid rgba(0,0,0,0.05)', paddingRight: '2rem' } as any} className="xl-flex">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', cursor: 'pointer' }} className="group">
                        <button className="btn-social">
                            <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000' }}>{blog.view_count || 0}</span>
                    </div>

                    <div style={{ width: '32px', height: '2px', background: '#000', margin: '0.5rem 0' }}></div>

                    <button className="btn-social">
                        <span className="material-symbols-outlined">bookmark</span>
                    </button>
                    <button className="btn-social" style={{ marginTop: '1rem' }}>
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </aside>

                {/* Article Center Column */}
                <article style={{ width: '100%', maxWidth: '820px', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
                    <header style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <span style={{ padding: '0.375rem 1rem', background: '#FFD700', color: '#000', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', border: '2px solid #000', boxShadow: '2px 2px 0px rgba(0,0,0,1)' }}>Engineering</span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, color: '#000', lineHeight: 1.05, letterSpacing: '-0.05em', marginBottom: '2.5rem', textDecoration: 'underline', textDecorationColor: '#FFD700', textDecorationThickness: '8px', textUnderlineOffset: '4px' }}>
                            {blog.title}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '1.5rem 0', background: '#F9F9F9', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0 1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '56px', height: '56px', border: '2px solid #000', background: '#111', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, boxShadow: '3px 3px 0px #FFD700' }}>
                                        {(blog.author_name || 'A').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: '#22c55e', border: '2px solid #000' }}></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: '#000', fontWeight: 700, fontSize: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{blog.author_name || 'Anonymous'}</span>
                                        <span className="material-symbols-outlined" style={{ color: '#2563eb', fontSize: '18px' }}>verified</span>
                                    </div>
                                    {blog.author_title && (
                                        <span style={{ color: '#4b5563', fontSize: '0.875rem', fontWeight: 500 }}>{blog.author_title}</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', padding: '0 1rem' }}>
                                <span style={{ color: '#000', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                </span>
                                <span style={{ color: '#000', background: '#FFD700', padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #000', display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: '2px 2px 0px rgba(0,0,0,1)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                                    {Math.max(1, Math.ceil(blog.content.trim().split(/\s+/).length / 200))} min read
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Article Content */}
                    <div className="article-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {blog.image_url && (
                            <div style={{ position: 'relative', width: '100%', marginBottom: '2rem' }}>
                                <div style={{ border: '4px solid #000', boxShadow: '8px 8px 0px rgba(0,0,0,1)', background: '#F9F9F9', overflow: 'hidden' }}>
                                    <img src={blog.image_url} alt="Cover image" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '21/9', objectFit: 'cover', filter: 'grayscale(0.5)' }} />
                                </div>
                            </div>
                        )}

                        <div dangerouslySetInnerHTML={{ __html: htmlContent as string }} />
                    </div>

                    {/* Footer Author Box */}
                    {blog.author_name && (
                        <div style={{ marginTop: '5rem', padding: '2rem', border: '4px solid #000', background: '#000', boxShadow: '8px 8px 0px #FFD700', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' } as any} className="author-box">
                            <div style={{ width: '96px', height: '96px', border: '4px solid #FFD700', background: '#111', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, flexShrink: 0 }}>
                                {blog.author_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#FFD700', fontWeight: 900, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Written by</span>
                                <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{blog.author_name}</h3>
                                {blog.author_bio && (
                                    <p style={{ color: '#a3a3a3', fontSize: '1.125rem', lineHeight: 1.6, fontWeight: 300, marginBottom: '1.5rem', maxWidth: '500px' }}>
                                        {blog.author_bio}
                                    </p>
                                )}
                                {(blog.twitter_url || blog.linkedin_url || blog.website_url) && (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {blog.twitter_url && <a href={blog.twitter_url} target="_blank" rel="noopener noreferrer" className="btn-author-social">Twitter</a>}
                                        {blog.linkedin_url && <a href={blog.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-author-social">LinkedIn</a>}
                                        {blog.website_url && <a href={blog.website_url} target="_blank" rel="noopener noreferrer" className="btn-author-social">Website</a>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View Tracker */}
                    <ViewTracker blogId={blog.id} />
                </article>

                {/* Right Placeholder to balance center column */}
                <div style={{ display: 'none', width: '5rem' } as any} className="xl-block"></div>
            </main>

            {/* ===== NEXT ARTICLE PREVIEWS ===== */}
            <section style={{ borderTop: '4px solid #000', background: '#111', padding: '5rem 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }} className="main-padding">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className="material-symbols-outlined" style={{ color: '#FFD700', fontSize: '36px' }}>bolt</span>
                            Read Next
                        </h2>
                        <Link href="/" style={{ color: '#FFD700', textDecoration: 'underline', textUnderlineOffset: '4px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem' }}>View all articles</Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Placeholder Next Article */}
                        <div className="next-article-card" style={{ background: '#000', border: '2px solid #333', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer' }}>
                            <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', borderBottom: '2px solid #333', overflow: 'hidden' }}>
                                <div style={{ width: '100%', height: '100%', backgroundImage: 'url(https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', filter: 'grayscale(1)', transition: 'filter 0.3s' }} className="card-img"></div>
                            </div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                                <span style={{ color: '#FFD700', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Architecture</span>
                                <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Scaling Vector Databases for RAG</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
