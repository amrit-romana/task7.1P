/**
 * Seed Script — run ONCE after creating the Neon database.
 * Copies existing JSON data into the database.
 *
 * Usage: npx tsx scripts/seed.ts
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL not found. Run: npx vercel env pull .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Read existing JSON files
const db       = JSON.parse(readFileSync(join(process.cwd(), 'src/data/db.json'), 'utf-8'));
const projects = JSON.parse(readFileSync(join(process.cwd(), 'src/data/projects.json'), 'utf-8'));
const finishes = JSON.parse(readFileSync(join(process.cwd(), 'src/data/finishes.json'), 'utf-8'));
const about    = JSON.parse(readFileSync(join(process.cwd(), 'src/data/about.json'), 'utf-8'));

async function seed() {
  console.log('🌱 Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS nav_links (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      href       TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS carousel_items (
      id         TEXT PRIMARY KEY,
      image_src  TEXT NOT NULL,
      title      TEXT DEFAULT '',
      subtitle   TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id         TEXT PRIMARY KEY,
      quote      TEXT NOT NULL,
      name       TEXT NOT NULL,
      title      TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS footer_settings (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL DEFAULT '{}'::jsonb
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL DEFAULT '{}'::jsonb
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id             TEXT PRIMARY KEY,
      title          TEXT NOT NULL,
      image          TEXT DEFAULT '',
      aspect         TEXT DEFAULT '3/4',
      show_on_home   BOOLEAN DEFAULT false,
      gallery_images JSONB DEFAULT '[]'::jsonb,
      description    TEXT DEFAULT '',
      sort_order     INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS finishes (
      id             TEXT PRIMARY KEY,
      name           TEXT NOT NULL,
      image          TEXT DEFAULT '',
      show_on_home   BOOLEAN DEFAULT false,
      description    TEXT DEFAULT '',
      gallery_images JSONB DEFAULT '[]'::jsonb,
      sort_order     INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS about (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL DEFAULT '{}'::jsonb
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS enquiries (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT DEFAULT '',
      message    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log('✅ Tables created!\n');

  // ── Nav Links ───────────────────────────────────────────────
  console.log('📌 Seeding nav_links...');
  for (const [i, link] of db.navLinks.entries()) {
    await sql`
      INSERT INTO nav_links (id, name, href, sort_order)
      VALUES (${link.id}, ${link.name}, ${link.href}, ${i})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`   ✓ ${db.navLinks.length} nav links`);

  // ── Carousel Items ──────────────────────────────────────────
  console.log('🎠 Seeding carousel_items...');
  for (const [i, item] of db.carouselItems.entries()) {
    await sql`
      INSERT INTO carousel_items (id, image_src, title, subtitle, sort_order)
      VALUES (${item.id}, ${item.imageSrc}, ${item.title ?? ''}, ${item.subtitle ?? ''}, ${i})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`   ✓ ${db.carouselItems.length} carousel items`);

  // ── Testimonials ─────────────────────────────────────────────
  console.log('💬 Seeding testimonials...');
  for (const [i, t] of db.testimonials.entries()) {
    await sql`
      INSERT INTO testimonials (id, quote, name, title, sort_order)
      VALUES (${t.id}, ${t.quote}, ${t.name}, ${t.title ?? ''}, ${i})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`   ✓ ${db.testimonials.length} testimonials`);

  // ── Footer Settings ──────────────────────────────────────────
  console.log('🦶 Seeding footer_settings...');
  await sql`
    INSERT INTO footer_settings (id, data)
    VALUES (1, ${JSON.stringify(db.footerSettings)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  console.log('   ✓ Footer settings');

  // ── Site Settings ────────────────────────────────────────────
  console.log('⚙️  Seeding site_settings...');
  await sql`
    INSERT INTO site_settings (id, data)
    VALUES (1, ${JSON.stringify(db.siteSettings)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  console.log('   ✓ Site settings');

  // ── Projects ─────────────────────────────────────────────────
  console.log('🏛️  Seeding projects...');
  for (const [i, p] of projects.entries()) {
    await sql`
      INSERT INTO projects (id, title, image, aspect, show_on_home, gallery_images, description, sort_order)
      VALUES (
        ${p.id},
        ${p.title},
        ${p.image ?? ''},
        ${p.aspect ?? '3/4'},
        ${p.showOnHome ?? false},
        ${JSON.stringify(p.galleryImages ?? [])}::jsonb,
        ${p.description ?? ''},
        ${i}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`   ✓ ${projects.length} projects`);

  // ── Finishes ─────────────────────────────────────────────────
  console.log('🎨 Seeding finishes...');
  for (const [i, f] of finishes.entries()) {
    await sql`
      INSERT INTO finishes (id, name, image, show_on_home, description, gallery_images, sort_order)
      VALUES (
        ${f.id},
        ${f.name},
        ${f.image ?? ''},
        ${f.showOnHome ?? false},
        ${f.description ?? ''},
        ${JSON.stringify(f.galleryImages ?? [])}::jsonb,
        ${i}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`   ✓ ${finishes.length} finishes`);

  // ── About ────────────────────────────────────────────────────
  console.log('📖 Seeding about...');
  await sql`
    INSERT INTO about (id, data)
    VALUES (1, ${JSON.stringify(about)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  console.log('   ✓ About page data');

  console.log('\n🎉 Seed complete! Your database is ready.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
