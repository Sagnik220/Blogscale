"use client";

import { useState } from 'react';

export function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <button
            className="btn-social"
            style={{ marginTop: '1rem', position: 'relative' }}
            onClick={handleShare}
            title="Share link"
        >
            <span className="material-symbols-outlined">
                {copied ? 'check' : 'share'}
            </span>
            {copied && (
                <span style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '0.5rem',
                    background: '#000',
                    color: '#fff',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    border: '1px solid #FFD700',
                    boxShadow: '2px 2px 0px #000'
                }}>
                    COPIED!
                </span>
            )}
        </button>
    );
}
