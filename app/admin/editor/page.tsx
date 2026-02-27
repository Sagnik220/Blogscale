"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // restored dark theme

import './editor.css';

const LANGUAGES = [
    { label: 'Plain Text', value: 'plaintext' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    { label: 'C', value: 'c' },
    { label: 'SQL', value: 'sql' },
    { label: 'JSON', value: 'json' },
    { label: 'HTML/XML', value: 'xml' },
    { label: 'CSS', value: 'css' },
    { label: 'Bash/Shell', value: 'bash' },
    { label: 'Go', value: 'go' },
    { label: 'GraphQL', value: 'graphql' },
    { label: 'Rust', value: 'rust' }
];

function EditorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [snippet, setSnippet] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [content, setContent] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [authorName, setAuthorName] = useState('');
    const [authorTitle, setAuthorTitle] = useState('');
    const [authorBio, setAuthorBio] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initial hljs setup for marked
    useEffect(() => {
        const renderer = new marked.Renderer();

        renderer.code = function ({ text, lang, escaped }: { text: string, lang?: string, escaped?: boolean }): string {
            const language = (lang || 'plaintext').toLowerCase();
            const highlighted = hljs.highlight(text, { language: hljs.getLanguage(language) ? language : 'plaintext' }).value;

            // Display name for the header
            const displayLang = language === 'plaintext' ? '' : language.toUpperCase();

            return `
                <div class="code-block" data-lang="${language}">
                    <div class="code-header">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="code-lang">${displayLang}</span>
                            <span class="material-symbols-outlined" style="font-size: 16px; opacity: 0.5;">expand_more</span>
                        </div>
                        <button class="btn-copy" title="Copy code">
                            <span class="material-symbols-outlined" style="font-size: 16px;">content_copy</span>
                            <span style="font-size: 11px; font-weight: 700;">COPY</span>
                        </button>
                    </div>
                    <div class="code-content">
                        <pre><code class="hljs language-${language}">${highlighted}</code></pre>
                    </div>
                </div>
            `;
        };

        marked.setOptions({
            renderer,
            breaks: true,
            gfm: true
        } as any);
    }, []);

    useEffect(() => {
        if (editId) {
            fetch('/api/blogs')
                .then(res => res.json())
                .then(data => {
                    const blog = data.find((b: any) => b.id.toString() === editId);
                    if (blog) {
                        setTitle(blog.title);
                        setSlug(blog.slug);
                        setSnippet(blog.snippet || '');
                        setImageUrl(blog.image_url || '');
                        updateContent(blog.content);
                        setAuthorName(blog.author_name || '');
                        setAuthorTitle(blog.author_title || '');
                        setAuthorBio(blog.author_bio || '');
                        setTwitterUrl(blog.twitter_url || '');
                        setLinkedinUrl(blog.linkedin_url || '');
                        setWebsiteUrl(blog.website_url || '');
                    }
                });
        }
    }, [editId]);

    useEffect(() => {
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(words);
    }, [content]);

    // Handle copy buttons in preview mode
    useEffect(() => {
        if (!previewMode) return;

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
    }, [previewMode]);

    const applyFormatting = (prefix: string, suffix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
        updateContent(newContent);

        // Reset cursor position
        setTimeout(() => {
            textarea.selectionStart = start + prefix.length;
            textarea.selectionEnd = start + prefix.length + selectedText.length;
            textarea.focus();
        }, 0);
    };

    const applyHeading = (level: number) => {
        const prefix = '#'.repeat(level) + ' ';
        applyFormatting(prefix, '');
    };

    const insertList = (type: 'bullet' | 'number') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        const lines = selectedText.split('\n');
        const formattedLines = lines.map((line, index) => {
            const prefix = type === 'bullet' ? '- ' : `${index + 1}. `;
            return prefix + line;
        });

        const replacement = formattedLines.join('\n');
        const newContent = content.substring(0, start) + replacement + content.substring(end);
        updateContent(newContent);

        setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = start + replacement.length;
            textarea.focus();
        }, 0);
    };

    const insertTable = () => {
        const tableTemplate = `\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Data 1 | Data 2 |\n| Data 3 | Data 4 |\n`;
        applyFormatting(tableTemplate, '');
    };

    const updateContent = (newContent: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        if (newHistory.length > 50) newHistory.shift();

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setContent(newContent);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setHistoryIndex(prevIndex);
            setContent(history[prevIndex]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    undo();
                    break;
                case 'b':
                    e.preventDefault();
                    applyFormatting('**', '**');
                    break;
                case 'i':
                    e.preventDefault();
                    applyFormatting('*', '*');
                    break;
                case 's':
                    e.preventDefault();
                    handleSave();
                    break;
            }
        }
    };

    const handleSave = async () => {
        if (!title || !slug || !content) return alert('Title, slug, and content are required.');
        setSaving(true);
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/blogs/${editId}` : '/api/blogs';
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title, slug, snippet, content, image_url: imageUrl,
                    author_name: authorName || null,
                    author_title: authorTitle || null,
                    author_bio: authorBio || null,
                    twitter_url: twitterUrl || null,
                    linkedin_url: linkedinUrl || null,
                    website_url: websiteUrl || null,
                }),
            });
            if (res.ok) { router.push('/admin/dashboard'); router.refresh(); }
            else { const error = await res.json(); alert(error.error || 'Failed to save'); }
        } catch { alert('An error occurred while saving.'); }
        finally { setSaving(false); }
    };

    const generateSlug = () => {
        setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                // Defaulting to 100% width, user can change the #w= parameter
                const markdownImage = `\n![${file.name}](${data.url}#w=100)\n`;
                const textarea = textareaRef.current;
                if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const newContent = content.substring(0, start) + markdownImage + content.substring(end);
                    updateContent(newContent);
                    setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + markdownImage.length; textarea.focus(); }, 0);
                } else { updateContent(content + markdownImage); }
                console.log('Tip: Change #w=100 to #w=50 to resize image to 50%');
            } else { alert(data.error || 'Failed to upload image'); }
        } catch { alert('Error uploading image'); }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        const items = Array.from(clipboardData.items);
        const types = clipboardData.types;

        // Debugging logs and alerts
        console.log('Paste event triggered. Types:', types);
        alert('Paste event triggered! Types: ' + types.join(', '));

        let foundImage = false;
        const imageFiles: File[] = [];

        // Check Items
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (file) {
                    imageFiles.push(file);
                    foundImage = true;
                }
            }
        }

        // Fallback to Files
        if (!foundImage && clipboardData.files.length > 0) {
            const files = Array.from(clipboardData.files);
            for (const file of files) {
                if (file.type.indexOf('image') !== -1) {
                    imageFiles.push(file);
                    foundImage = true;
                }
            }
        }

        if (foundImage) {
            e.preventDefault();
            setIsUploadingImage(true);
            try {
                for (const file of imageFiles) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    const data = await res.json();
                    if (data.url) {
                        const markdownImage = `\n![Pasted Image](${data.url}#w=100)\n`;
                        const textarea = textareaRef.current;
                        if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const newContent = content.substring(0, start) + markdownImage + content.substring(end);
                            updateContent(newContent);
                            setTimeout(() => {
                                textarea.selectionStart = textarea.selectionEnd = start + markdownImage.length;
                                textarea.focus();
                            }, 0);
                        }
                    }
                }
            } catch (err) {
                console.error('Paste upload failed:', err);
                alert('Upload failed. Please try again.');
            } finally {
                setIsUploadingImage(false);
            }
        } else {
            // Log for debugging if it was a paste but no image was found
            if (types.includes('Files') || items.some(i => i.kind === 'file')) {
                console.log('Paste detected file/kind but no image type matched.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'var(--font-space)', background: '#050505', color: '#e5e5e5' }}>

            {/* Sidebar Settings Panel */}
            <aside style={{ display: 'flex', width: '320px', flexDirection: 'column', borderRight: '1px solid #1a1a1a', background: '#0a0a0a', flexShrink: 0 }} className="sidebar-editor">

                {/* Header Back Button */}
                <div style={{ padding: '1.25rem' }}>
                    <button onClick={() => router.push('/admin/dashboard')} className="btn-back">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                        <span>Back to Dashboard</span>
                    </button>
                    <div style={{ marginTop: '1.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Post Settings</span>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Input Groups */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Slug URL</label>
                        <input
                            type="text"
                            className="input-dark"
                            placeholder="e.g. system-design-primer"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Excerpt</label>
                        <textarea
                            className="input-dark"
                            style={{ minHeight: '100px', resize: 'vertical', paddingTop: '0.75rem' }}
                            placeholder="A short summary of the technical deep dive..."
                            value={snippet}
                            onChange={e => setSnippet(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Cover Image URL</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="input-dark"
                                style={{ paddingRight: '2.5rem' }}
                                placeholder="https://image-url..."
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                            />
                            <span className="material-symbols-outlined" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#666' }}>image</span>
                        </div>
                    </div>

                    {/* Author Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Author Details</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Author Name</label>
                        <input
                            type="text"
                            className="input-dark"
                            placeholder="e.g. Sagnik Mukherjee"
                            value={authorName}
                            onChange={e => setAuthorName(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Author Title</label>
                        <input
                            type="text"
                            className="input-dark"
                            placeholder="e.g. Principal Data Engineer"
                            value={authorTitle}
                            onChange={e => setAuthorTitle(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Author Bio</label>
                        <textarea
                            className="input-dark"
                            style={{ minHeight: '80px', resize: 'vertical', paddingTop: '0.75rem' }}
                            placeholder="A short bio about the author..."
                            value={authorBio}
                            onChange={e => setAuthorBio(e.target.value)}
                        />
                    </div>

                    {/* Social Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Social Links (optional)</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Twitter / X URL</label>
                        <input
                            type="url"
                            className="input-dark"
                            placeholder="https://x.com/username"
                            value={twitterUrl}
                            onChange={e => setTwitterUrl(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>LinkedIn URL</label>
                        <input
                            type="url"
                            className="input-dark"
                            placeholder="https://linkedin.com/in/username"
                            value={linkedinUrl}
                            onChange={e => setLinkedinUrl(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a3a3a3' }}>Website URL</label>
                        <input
                            type="url"
                            className="input-dark"
                            placeholder="https://yourwebsite.com"
                            value={websiteUrl}
                            onChange={e => setWebsiteUrl(e.target.value)}
                        />
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#111', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #1a1a1a' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Stats</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>Words</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{wordCount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>Reading Time</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>~{Math.max(1, Math.ceil(wordCount / 200))} min</span>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div style={{ padding: '1.25rem', borderTop: '1px solid #1a1a1a', background: '#0a0a0a' }}>
                    <button className="btn-publish" onClick={handleSave} disabled={saving}>
                        {saving ? 'Publishing...' : (editId ? 'Update Post' : 'Publish Post')}
                    </button>
                </div>
            </aside>

            {/* Main Editor Area */}
            <main style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', position: 'relative' }}>

                {/* Editor Toolbar */}
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #1a1a1a', background: '#050505', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ padding: '0.25rem 0.5rem', background: '#222', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#ffd700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Draft</span>
                        <span style={{ fontSize: '0.875rem', color: '#666' }}>Saved just now</span>
                        {isUploadingImage && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', color: '#ffd700', fontSize: '0.75rem', fontWeight: 600 }}>
                                <span className="material-symbols-outlined rotating" style={{ fontSize: '16px' }}>sync</span>
                                UPLOADING IMAGE...
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className={`btn-toolbar ${!previewMode ? 'active' : ''}`} onClick={() => setPreviewMode(false)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit_square</span>
                            Write
                        </button>
                        <button className={`btn-toolbar ${previewMode ? 'active' : ''}`} onClick={() => setPreviewMode(true)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>preview</span>
                            Preview
                        </button>

                        <div style={{ width: '1px', height: '24px', background: '#1a1a1a' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <div className="toolbar-dropdown-wrapper">
                                <button className="btn-icon" onClick={() => setShowHeadingDropdown(!showHeadingDropdown)} title="Headings">
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_size</span>
                                </button>
                                {showHeadingDropdown && (
                                    <div className="toolbar-dropdown">
                                        {[1, 2, 3, 4].map(level => (
                                            <button key={level} className="dropdown-option" onClick={() => { applyHeading(level); setShowHeadingDropdown(false); }}>
                                                Heading {level}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="btn-icon" onClick={() => applyFormatting('**', '**')} title="Bold">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_bold</span>
                            </button>
                            <button className="btn-icon" onClick={() => applyFormatting('*', '*')} title="Italic">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_italic</span>
                            </button>

                            <div style={{ width: '1px', height: '16px', background: '#222', margin: '0 0.25rem' }}></div>

                            <button className="btn-icon" onClick={() => insertList('bullet')} title="Bullet List">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_list_bulleted</span>
                            </button>
                            <button className="btn-icon" onClick={() => insertList('number')} title="Numbered List">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_list_numbered</span>
                            </button>

                            <div style={{ width: '1px', height: '16px', background: '#222', margin: '0 0.25rem' }}></div>

                            <div className="lang-select-wrapper">
                                <button className="btn-icon" onClick={() => setShowLangDropdown(!showLangDropdown)} title="Code Block">
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>code</span>
                                </button>
                                {showLangDropdown && (
                                    <div className="lang-dropdown custom-scrollbar">
                                        {LANGUAGES.map(lang => (
                                            <button
                                                key={lang.value}
                                                className="lang-option"
                                                onClick={() => {
                                                    applyFormatting(`\n\`\`\`${lang.value}\n`, '\n\`\`\`\n');
                                                    setShowLangDropdown(false);
                                                }}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="btn-icon" onClick={() => applyFormatting('[', '](url)')} title="Link">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>link</span>
                            </button>
                            <button className="btn-icon" onClick={() => insertTable()} title="Table">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>table_chart</span>
                            </button>
                            <button className="btn-icon" onClick={() => fileInputRef.current?.click()} title="Image">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>image</span>
                            </button>
                            <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                        </div>
                    </div>
                </header>

                {/* Editor Content Area */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>

                        {previewMode ? (
                            <>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '2rem', lineHeight: 1.2 }}>
                                    {title || 'Untitled'}
                                </h1>
                                <div className="blog-content dark-mode" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(content || '*No content yet.*') as string) }} />
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    className="editor-title"
                                    placeholder="Post title..."
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    onBlur={(!slug && !editId) ? generateSlug : undefined}
                                />
                                <div style={{ height: '3rem' }}></div>
                                <textarea
                                    ref={textareaRef}
                                    className="editor-body custom-scrollbar"
                                    placeholder="Start writing the technical deep dive..."
                                    value={content}
                                    onChange={e => updateContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onPaste={handlePaste}
                                />
                            </>
                        )}

                    </div>
                </div>

            </main>
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', color: '#64748B', fontWeight: 600 }}>Loading editor...</div>}>
            <EditorForm />
        </Suspense>
    );
}
