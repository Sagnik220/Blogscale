# ⚡️ BlogScale

A high-performance, minimalist technical blogging platform built for developers. BlogScale combines the simplicity of markdown with the power of Next.js and Supabase, wrapped in a bold neobrutalist aesthetic.

![BlogScale Demo](./public/EndtoEndDemo.webp)

## 🚀 Key Features

### ✍️ Notion-Style Technical Editor
- **Markdown-First**: Write in pure markdown with real-time preview and word count.
- **Smart Media Handling**: Direct drag-and-drop/upload for images and videos with automatic markdown injection.
- **Reading Time Estimation**: Automatically calculates reading time for your readers.
- **Distraction-Free**: A focused, dark-mode editing environment.

### 🔐 Secure Admin Infrastructure
- **Custom Auth**: Secure admin panel protected by Bcrypt hashing and HTTP-only session cookies.
- **Middleware Protection**: Edge-ready middleware ensuring your admin dashboard and sensitive APIs stay private.
- **Session Management**: Automated session cleanup and secure token validation.

### 📊 Advanced Analytics & Growth
- **Unique View Tracking**: Smart visitor hashing to track genuine unique views without invading privacy.
- **Newsletter Engine**: Integrated subscription forms to capture leads and grow your audience.
- **SEO Optimized**: Dynamic metadata, server-side rendering, and performance-first architecture.

### 🎨 Premium Neobrutalist Design
- **High-Contrast UI**: Bold typography and vibrant accents for a modern editorial feel.
- **Responsive & Accessible**: Works flawlessly across mobile, tablet, and desktop devices.
- **Micro-Animations**: Subtle transitions that enhance the user experience without distraction.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [Supabase PostgreSQL](https://supabase.com/)
- **Authentication**: Custom Bcrypt + Secure Cookies
- **Styling**: Vanilla CSS (Global Design System)
- **Editor**: [Marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/dompurify)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- A Supabase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sagnik220/Blogscale.git
   cd Blogscale
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Initialize Database**
   Run the migration script to set up your tables:
   ```bash
   node scripts/migrate.mjs
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view your blog.

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your Environment Variables.
4. Deploy!

### Database Schema
The project uses the following core tables:
- `blogs`: Stores post content and metadata.
- `blog_views`: Tracks unique view hashes.
- `admin_users`: Stores admin credentials.
- `sessions`: Manages active auth sessions.
- `newsletter_subs`: Stores newsletter emails.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
