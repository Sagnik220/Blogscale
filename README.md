# BlogScale

A modern, high-performance tech blog platform built with Next.js, React, and Supabase. Features a Notion-style markdown editor, secure authentication, unique view tracking, and a neobrutalist aesthetic.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase PostgreSQL
- **Authentication**: Bcrypt + Secure HTTP-Only Cookies
- **Styling**: Vanilla CSS (High-Contrast Neobrutalism)
- **Content**: Markdown processing with `marked` and `dompurify`

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up a Supabase project and database (schema in `scripts/migrate.mjs`)
4. Create a `.env.local` file with your Supabase credentials
5. Run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
