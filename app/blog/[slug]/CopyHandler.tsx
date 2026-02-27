"use client";

import { useEffect } from 'react';

export function CopyHandler() {
    useEffect(() => {
        const handleCopy = async (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('.btn-copy');
            if (!btn) return;

            const codeBlock = btn.closest('.code-block');
            const code = codeBlock?.querySelector('code')?.innerText;

            if (code) {
                try {
                    await navigator.clipboard.writeText(code);

                    const originalContent = btn.innerHTML;
                    btn.innerHTML = `
                        <span class="material-symbols-outlined" style="font-size: 16px;">check</span>
                        <span style="font-size: 11px; font-weight: 700;">COPIED!</span>
                    `;
                    btn.classList.add('copied');

                    setTimeout(() => {
                        btn.innerHTML = originalContent;
                        btn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            }
        };

        document.addEventListener('click', handleCopy);
        return () => document.removeEventListener('click', handleCopy);
    }, []);

    return null;
}
