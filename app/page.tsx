import Link from 'next/link';
import { getAllBlogs } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BlogScale | AI & System Design',
  description: 'Deep technical dives into scalable architecture, distributed databases, and high-throughput data pipelines.',
};

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2532&auto=format&fit=crop",
  list1: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHBEBG2b9ZsawQUvayLzLurvopXUnjc3Ukgzc565MFiFSGTYXxRhRNekuIgWs7eIxkGiFNSV2yPdllYXRfXoZpe47oJaP7TQDpa_vvw_5QTu2HTnJTXYwQhke1_t31GEg_hU-MRKcWw62S5ytmbWkTiVaek1BL-8E32RRPGDfPVNCddhbKed2PkVIqFenY9uXbT7OkOJBTIiVSILBafxQrqdumGDVFYEnCyDG4-kTn_8zOPChHBJoIw8nqF0cAJUvvFnlqndlelOT4",
  list2: "https://lh3.googleusercontent.com/aida-public/AB6AXuCecjWDjMa3cwqOObZDeXXb1nMvBOc9qnUoQy4hX8vV5I61KksfCgTYW_x1CE_sC_VDOE5e_ZnVWPfB3Bllxl7GEdhGJvUYc8wHo2ZbV88jd4n_TlwiIJrhRuMqFMK5hDyot-U_AIfsOx9-ZKoOGuyT2mDvv4sxyt-9VHOm3F2-g8lshxxqIRKjCOwhudAUGksFB6LXWDooLZPzgdw6F-8zZBpfDwT8Rxgvj0msOs2tDZwp7KgrO7jFZYnOdc6M9xgDxbwexhtMjDHB",
  list3: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuaIt6gsav0-UHRPX-dgU-YuEkoByFt4TlEhBqrXlFqoH9yD63wm8gZ4siuzWb4PehWiz4CRDj-p-kJ263tJRCCghj8ppIvM4ltuAUBiZgxydWGdV0_KRRw-dytY5E0WjSWJa5WbrkEWBFRRyT_kiJ6bv0tAJIjEMqknaR5xr8OHrpNeFphT0NG-kclSFV7aNsVGW4HzL2a4ngk69eQH2yRoDcagYdhKeLyWSTN4JFzqmuLSaslwtdAwR_kGmwYqWjAIiAw785rH2r",
};

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#ffffff', fontFamily: 'var(--font-space, Space Grotesk, sans-serif)' }}>

      {/* ===== HEADER ===== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(5, 5, 5, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0 2rem',
        height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ color: '#FFD700', fontSize: '32px' }}>hub</span>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff' }}>BlogScale</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' } as any} className="desktop-flex">
          <Link href="#deep-dives" className="nav-link">Engineering</Link>
          <Link href="#deep-dives" className="nav-link">MLOps</Link>
          <Link href="#deep-dives" className="nav-link">System Design</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="hide-mobile">
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.75rem', color: '#a3a3a3', fontSize: '20px' }}>search</span>
            <input
              type="text"
              placeholder="Search topics..."
              className="search-input"
            />
          </div>
          <Link href="/admin/login" className="btn-admin">
            Admin Sign In
          </Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>

        {/* ===== HERO SECTION ===== */}
        <section style={{ padding: '5rem 2rem', position: 'relative' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', background: 'rgba(255,215,0,0.1)', padding: '0.25rem 0.75rem', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                  <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#FFD700', opacity: 0.75 }}></span>
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: '#FFD700' }}></span>
                </span>
                Trending: Distributed Systems
              </div>

              <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Mastering <span style={{ color: '#FFD700' }}>AI</span> &amp; System <span style={{ background: 'linear-gradient(to right, #FFD700, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Design</span>.
              </h1>

              <p style={{ maxWidth: '600px', fontSize: '1.125rem', color: '#a3a3a3', lineHeight: 1.6, fontWeight: 300 }}>
                Deep technical dives into scalable architecture, distributed databases, and high-throughput data pipelines. No fluff, just engineering.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Link href="#deep-dives" className="btn-primary-hero">
                  Start Learning
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                </Link>
                <Link href="#deep-dives" className="btn-secondary-hero">
                  Explore Patterns
                </Link>
              </div>
            </div>

            {/* Glowing Hero Image */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', overflow: 'visible' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMAGES.hero}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8, filter: 'grayscale(1) contrast(1.25)', mixBlendMode: 'screen', transition: 'transform 0.7s', transform: 'scale(1)' }} className="hero-img-zoom"></div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050505, transparent)' }}></div>

                {/* Floating widget */}
                <div style={{ position: 'absolute', bottom: '2.5rem', right: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,215,0,0.3)', boxShadow: '0 0 30px rgba(0,0,0,0.5)', maxWidth: '320px', transition: 'transform 0.5s', zIndex: 10 }} className="hero-widget">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ height: '40px', width: '40px', border: '1px solid rgba(255,215,0,0.5)', background: 'rgba(255,215,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>
                      <span className="material-symbols-outlined">memory</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Node Replication</div>
                      <div style={{ fontSize: '0.75rem', color: '#a3a3a3', fontFamily: 'monospace' }}>Syncing availability zones...</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', height: '4px', width: '100%', background: '#1f2937', marginTop: '0.5rem' }}>
                    <div style={{ height: '100%', background: '#FFD700', width: '66%', boxShadow: '0 0 10px #FFD700', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#FFD700', fontFamily: 'monospace' }}>
                    <span>STATUS: ACTIVE</span>
                    <span>99.9% UP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ADD STYLE BLOCK FOR ANIMATIONS & HOVERS ===== */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }
          .hero-img-zoom:hover {
            transform: scale(1.05) !important;
          }
          .hero-widget:hover {
            transform: translateY(-5px) !important;
          }
          .card-dark-hover:hover {
            border-color: rgba(255,215,0,0.5) !important;
          }
          .card-dark-hover:hover .card-img {
            transform: scale(1.05) !important;
            filter: grayscale(0) !important;
          }
          .card-dark-hover:hover h3 {
            color: #FFD700 !important;
          }
          .nav-link {
            font-size: 0.875rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #a3a3a3; text-decoration: none; transition: color 0.2s;
          }
          .nav-link:hover { color: #FFD700; }
          .search-input {
            height: 40px; width: 256px; background: #0A0A0A; border: 1px solid rgba(255,255,255,0.1); padding-left: 2.5rem; color: #ffffff; font-size: 0.875rem; outline: none; transition: border-color 0.2s;
          }
          .search-input:focus { border-color: #FFD700; }
          .btn-admin {
            display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 1.5rem; background: #FFD700; color: #000000; font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; border: none; transition: transform 0.1s, background 0.2s;
          }
          .btn-admin:hover { background: #E6C200; }
          .btn-primary-hero {
            display: inline-flex; height: 56px; align-items: center; justify-content: center; gap: 0.5rem; background: #FFD700; padding: 0 2rem; color: #000000; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; transition: all 0.2s; border: 1px solid transparent; box-shadow: 0 0 20px rgba(255,215,0,0);
          }
          .btn-primary-hero:hover { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
          .btn-secondary-hero {
            display: inline-flex; height: 56px; align-items: center; justify-content: center; gap: 0.5rem; background: transparent; padding: 0 2rem; color: #ffffff; font-size: 1rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.2);
          }
          .btn-secondary-hero:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }
          .btn-load-more {
            display: inline-flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.2); background: transparent; padding: 0.75rem 2rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #ffffff; transition: all 0.2s; cursor: pointer;
          }
          .btn-load-more:hover { background: #FFD700; border-color: #FFD700; color: #000000; box-shadow: 0 0 15px rgba(255,215,0,0.4); }
          .btn-subscribe {
            display: inline-flex; align-items: center; justify-content: center; background: #FFD700; padding: 0.75rem 2rem; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.05em; border: none; cursor: pointer; transition: background 0.2s;
          }
          .btn-subscribe:hover { background: #E6C200; }
          .footer-link { color: #a3a3a3; text-decoration: none; transition: color 0.2s; }
          .footer-link:hover { color: #FFD700; }
          @media (min-width: 768px) {
            .desktop-flex { display: flex !important; }
          }
          @media (max-width: 768px) {
            .hide-mobile { display: none !important; }
          }
        `}} />


        {/* ===== LATEST ENGINEERING ARTICLES ===== */}
        <section id="deep-dives" style={{ padding: '4rem 2rem', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest Engineering Articles</h2>
              <span style={{ padding: '0.125rem 0.5rem', border: '1px solid rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.1)', fontSize: '0.75rem', fontFamily: 'monospace', color: '#FFD700', textTransform: 'uppercase' }}>Fresh Build</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#333', marginBottom: '1rem', display: 'block' }}>article</span>
                  <p style={{ color: '#666', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>No articles published yet.</p>
                  <p style={{ color: '#444', fontSize: '0.875rem' }}>Check back soon for deep dives into system design, AI, and engineering.</p>
                </div>
              ) : (
                <>
                  {blogs.map((blog) => (
                    <article key={blog.id} className="card-dark-hover" style={{ display: 'flex', gap: '1.5rem', padding: '1rem', border: '1px solid transparent', transition: 'border-color 0.2s', background: 'transparent' }}>
                      {blog.image_url && (
                        <div style={{ width: '128px', aspectRatio: '3/2', flexShrink: 0, overflow: 'hidden', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)' }} className="hide-mobile">
                          <Link href={`/blog/${blog.slug}`}>
                            <div className="card-img" style={{ width: '100%', height: '100%', backgroundImage: `url('${blog.image_url}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(1)', transition: 'transform 0.5s, filter 0.5s' }}></div>
                          </Link>
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#a3a3a3', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                          <span style={{ color: '#FFD700', fontWeight: 700, textTransform: 'uppercase' }}>Engineering</span>
                          <span>|</span>
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', transition: 'color 0.2s' }}>{blog.title}</h3>
                        </Link>
                        {blog.snippet && (
                          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.snippet}</p>
                        )}
                      </div>
                    </article>
                  ))}

                  <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <button className="btn-load-more">
                      Load more articles
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER CTA ===== */}
        <section style={{ padding: '5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(to bottom, #050505, #0f0f0f)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ margin: '0 auto 1.5rem', display: 'flex', height: '80px', width: '80px', alignItems: 'center', justifyContent: 'center', border: '1px solid #FFD700', color: '#FFD700', background: 'rgba(255,215,0,0.05)', boxShadow: '0 0 20px rgba(255,215,0,0.15)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>mark_email_unread</span>
            </div>
            <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Level up your <span style={{ color: '#FFD700' }}>engineering stack</span>.
            </h2>
            <p style={{ margin: '0 auto 2rem', maxWidth: '600px', color: '#a3a3a3', fontWeight: 300, fontSize: '1.125rem' }}>
              Join 25,000+ data engineers and architects. Get our weekly digest of system design case studies and AI trends.
            </p>

            <form style={{ margin: '0 auto', display: 'flex', maxWidth: '450px', flexDirection: 'row', border: '1px solid rgba(255,255,255,0.2)', padding: '4px', background: '#000000' }}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.75rem 1rem', color: '#ffffff', outline: 'none' }}
              />
              <button type="button" className="btn-subscribe">
                Subscribe
              </button>
            </form>

            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#a3a3a3', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              NO SPAM, EVER. UNSUBSCRIBE AT ANY TIME.
            </p>
          </div>
        </section>

      </main>

      {/* ===== DARK FOOTER ===== */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: '#000000', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#FFD700' }}>hub</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BlogScale</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Link href="#" className="footer-link">Privacy</Link>
            <Link href="#" className="footer-link">Terms</Link>
            <Link href="#" className="footer-link">Twitter</Link>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#a3a3a3', fontFamily: 'monospace' }}>
            © {new Date().getFullYear()} BLOGSCALE INC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
