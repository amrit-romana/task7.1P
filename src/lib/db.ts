import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Run: npx vercel env pull .env.local');
}

// `sql` is a tagged template function — use it like:
// const rows = await sql`SELECT * FROM nav_links`
const sql = neon(process.env.DATABASE_URL);

export default sql;
