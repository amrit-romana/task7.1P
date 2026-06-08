/**
 * Blog Migration — run once to create the blog_posts table.
 * Usage: npx tsx scripts/migrate-blog.ts
 */

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL not found.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
  console.log("🌱 Creating blog_posts table...");

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id           TEXT PRIMARY KEY,
      slug         TEXT UNIQUE NOT NULL,
      title        TEXT NOT NULL DEFAULT '',
      excerpt      TEXT DEFAULT '',
      content      TEXT DEFAULT '',
      cover_image  TEXT DEFAULT '',
      published    BOOLEAN DEFAULT false,
      published_at TIMESTAMPTZ,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log("✅ blog_posts table ready!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
