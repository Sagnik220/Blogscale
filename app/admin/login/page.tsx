"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Incorrect credentials. Please try again.');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            background: '#fff', fontFamily: 'var(--font-space, Space Grotesk, sans-serif)',
        }}>

            {/* Header */}
            <header style={{ padding: '1.5rem 2.5rem', borderBottom: '2px solid #000', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#FACC15', fontSize: '20px' }}>terminal</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>BlogScale</span>
            </header>

            {/* Center content */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>

                    {/* Title */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#000', marginBottom: '0.5rem' }}>Admin Access</h1>
                        <p style={{ color: '#64748B', fontWeight: 500, fontSize: '0.9rem' }}>Sign in to manage your content</p>
                    </div>

                    {/* Card */}
                    <div style={{ background: '#fff', border: '2px solid #000', padding: '2rem', boxShadow: '6px 6px 0 #000' }}>

                        {/* Google Button (UI only) */}
                        <button
                            type="button"
                            className="btn-google"
                            style={{ marginBottom: '1.25rem' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="divider-text" style={{ marginBottom: '1.25rem' }}>
                            <span>or sign in with password</span>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ display: 'block' }}>
                                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', marginBottom: '0.4rem' }}>Email</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    style={{
                                        width: '100%', padding: '0.85rem 1rem',
                                        border: `2px solid ${error ? '#EF4444' : '#0f172a'}`,
                                        borderRadius: '0',
                                        background: '#fff', color: '#000',
                                        fontSize: '0.95rem', fontFamily: 'inherit',
                                        outline: 'none',
                                        transition: 'border-color 0.15s, box-shadow 0.15s',
                                    }}
                                    placeholder="admin@example.com"
                                    onFocus={e => { e.currentTarget.style.borderColor = '#FACC15'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(250,204,21,0.25)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = error ? '#EF4444' : '#0f172a'; e.currentTarget.style.boxShadow = 'none'; }}
                                    required
                                />
                            </label>
                            <label style={{ display: 'block' }}>
                                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', marginBottom: '0.4rem' }}>Password</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    style={{
                                        width: '100%', padding: '0.85rem 1rem',
                                        border: `2px solid ${error ? '#EF4444' : '#0f172a'}`,
                                        borderRadius: '0',
                                        background: '#fff', color: '#000',
                                        fontSize: '0.95rem', fontFamily: 'inherit',
                                        outline: 'none',
                                        transition: 'border-color 0.15s, box-shadow 0.15s',
                                    }}
                                    placeholder="Enter your password"
                                    onFocus={e => { e.currentTarget.style.borderColor = '#FACC15'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(250,204,21,0.25)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = error ? '#EF4444' : '#0f172a'; e.currentTarget.style.boxShadow = 'none'; }}
                                    required
                                />
                            </label>

                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#FEF2F2', border: '2px solid #EF4444', color: '#DC2626', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '0.9rem',
                                    background: loading ? '#E2E8F0' : '#000',
                                    border: '2px solid #000',
                                    color: loading ? '#94a3b8' : '#fff',
                                    fontWeight: 800, fontSize: '0.8rem',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontFamily: 'inherit',
                                    boxShadow: loading ? 'none' : '4px 4px 0 #FACC15',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign In →'}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', marginTop: '1.5rem', fontWeight: 500 }}>
                        Protected admin area. Authorized personnel only.
                    </p>
                </div>
            </div>
        </div>
    );
}
