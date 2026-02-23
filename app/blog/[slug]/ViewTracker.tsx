"use client";

import { useEffect } from 'react';

export function ViewTracker({ blogId }: { blogId: number }) {
    useEffect(() => {
        // Fire and forget — track the view
        fetch(`/api/blogs/${blogId}/views`, { method: 'POST' }).catch(() => { });
    }, [blogId]);

    return null; // invisible component
}
