"use client";

export default function NewsletterForm() {
    return (
        <form
            style={{ display: 'flex', gap: '0', maxWidth: '480px', margin: '0 auto' }}
            onSubmit={e => e.preventDefault()}
        >
            <input
                type="email"
                placeholder="ENGINEER@EXAMPLE.COM"
                style={{
                    flex: 1, height: '52px', padding: '0 1rem',
                    border: '2px solid #000', borderRight: 'none',
                    background: '#fff', color: '#000',
                    fontSize: '0.85rem', fontWeight: 700,
                    fontFamily: 'monospace', outline: 'none',
                }}
            />
            <button
                type="submit"
                style={{
                    height: '52px', padding: '0 1.5rem',
                    background: '#000', color: '#FACC15',
                    border: '2px solid #000', fontWeight: 900,
                    fontSize: '0.8rem', textTransform: 'uppercase',
                    letterSpacing: '0.08em', cursor: 'pointer',
                    fontFamily: 'inherit',
                }}
            >
                Subscribe
            </button>
        </form>
    );
}
