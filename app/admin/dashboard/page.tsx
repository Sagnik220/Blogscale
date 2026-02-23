"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './dashboard.css';

interface Blog {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    snippet?: string;
    image_url?: string;
}

export default function DashboardPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            setBlogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this post permanently?')) return;
        await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        setBlogs(blogs.filter(b => b.id !== id));
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'var(--font-space)', background: '#f8fafc', color: '#0f172a' }}>

            {/* Sidebar View */}
            <aside style={{ display: 'flex', width: '280px', flexDirection: 'column', borderRight: '2px solid #0f172a', background: '#fff', transition: 'all 0.3s' }} className="sidebar-desktop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem', paddingBottom: '2rem', borderBottom: '2px solid #0f172a' }}>
                    <div style={{ display: 'flex', height: '40px', width: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#0f172a', color: '#facc15' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>neurology</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.025em', color: '#0f172a' }}>DataMind</h1>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Admin Console</span>
                    </div>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin/dashboard" className="nav-item active">
                        <span className="material-symbols-outlined nav-icon">article</span>
                        <span style={{ fontWeight: 700 }}>Content</span>
                    </Link>
                    <Link href="/" className="nav-item">
                        <span className="material-symbols-outlined nav-icon">dashboard</span>
                        <span>View Live Site</span>
                    </Link>
                    <div style={{ margin: '1rem 0', borderTop: '2px solid #e2e8f0' }}></div>
                    <button className="nav-item" onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/admin/login';
                    }}>
                        <span className="material-symbols-outlined nav-icon">logout</span>
                        <span>Sign Out</span>
                    </button>
                </nav>

                <div style={{ padding: '1rem', borderTop: '2px solid #0f172a', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '0.5rem', border: '2px solid #0f172a', background: '#fff', padding: '0.75rem', boxShadow: '0 2px 0 #000' }}>
                        <div style={{ height: '40px', width: '40px', borderRadius: '9999px', border: '2px solid #0f172a', background: '#0f172a', color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>A</div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Admin User</p>
                            <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>admin@datamind.ai</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content View */}
            <main style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#fff', position: 'relative' }}>

                {/* Header */}
                <header style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', borderBottom: '2px solid #0f172a', background: '#f8fafc', flexShrink: 0 }} className="header-responsive">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a' }}>Content Manager</h2>
                        <p style={{ color: '#475569', fontWeight: 500 }}>Manage technical tracks, interview prep series, and deep dives.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href="/admin/editor" className="btn-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                            <span>New Article</span>
                        </Link>
                    </div>
                </header>

                {/* Sub-toolbar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.5rem 2rem', flexShrink: 0, background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button className="btn-filter">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
                            <span>Track: All</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#0f172a' }}>expand_more</span>
                        </button>
                    </div>
                    <div style={{ display: 'flex', borderRadius: '0.5rem', border: '2px solid #0f172a', background: '#f1f5f9', padding: '0.25rem' }}>
                        <button className="btn-toggle active">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>table_rows</span>
                            <span>List</span>
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div style={{ flex: 1, overflow: 'auto', padding: '0 2rem 2rem', background: '#fff' }}>
                    {loading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>Loading content...</div>
                    ) : blogs.length === 0 ? (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#94a3b8', marginBottom: '1rem' }}>article</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No articles published</h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Get started by writing a new piece of content.</p>
                            <Link href="/admin/editor" className="btn-primary" style={{ display: 'inline-flex' }}>
                                Start Writing
                            </Link>
                        </div>
                    ) : (
                        <div style={{ minWidth: '100%', display: 'inline-block', verticalAlign: 'middle' }}>
                            <div style={{ overflow: 'hidden', borderRadius: '0.75rem', border: '2px solid #0f172a', background: '#fff', boxShadow: '0 4px 0 #000' }}>
                                <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f1f5f9', borderBottom: '2px solid #0f172a' }}>
                                        <tr>
                                            <th scope="col" style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Article Title</th>
                                            <th scope="col" style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', width: '10rem' }}>Status</th>
                                            <th scope="col" style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', width: '10rem' }}>Date</th>
                                            <th scope="col" style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', width: '8rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ background: '#fff' }}>
                                        {blogs.map((blog, index) => (
                                            <tr key={blog.id} className="table-row pulse-in" style={{ borderBottom: index < blogs.length - 1 ? '1px solid #e2e8f0' : 'none', animationDelay: `${index * 0.05}s` }}>
                                                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ height: '40px', width: '40px', flexShrink: 0, border: '2px solid #0f172a', background: '#000', borderRadius: '0.25rem', overflow: 'hidden' }}>
                                                            {blog.image_url ? (
                                                                <img src={blog.image_url} alt="" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <div style={{ height: '100%', width: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#94a3b8' }}>image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ marginLeft: '1rem', overflow: 'hidden' }}>
                                                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden' }}>{blog.title}</div>
                                                            <div style={{ fontSize: '0.875rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden' }}>/{blog.slug}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                                                    <span style={{ display: 'inline-flex', borderRadius: '9999px', background: '#dcfce7', padding: '0.125rem 0.625rem', fontSize: '0.75rem', fontWeight: 600, color: '#166534', border: '1px solid #166534' }}>Published</span>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
                                                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', textAlign: 'right', fontSize: '0.875rem', fontWeight: 500 }}>
                                                    <Link href={`/admin/editor?id=${blog.id}`} className="action-link" style={{ marginRight: '1rem' }}>Edit</Link>
                                                    <button onClick={() => handleDelete(blog.id)} className="action-link text-red">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
