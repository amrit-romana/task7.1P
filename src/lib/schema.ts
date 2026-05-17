/**
 * Database Schema — run this once via the seed script.
 * Tables:
 *   nav_links, carousel_items, testimonials,
 *   footer_settings, site_settings,
 *   projects, finishes, about, enquiries
 */

export const CREATE_TABLES_SQL = `
-- Nav Links
CREATE TABLE IF NOT EXISTS nav_links (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  href        TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0
);

-- Carousel Items
CREATE TABLE IF NOT EXISTS carousel_items (
  id          TEXT PRIMARY KEY,
  image_src   TEXT NOT NULL,
  title       TEXT DEFAULT '',
  subtitle    TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id          TEXT PRIMARY KEY,
  quote       TEXT NOT NULL,
  name        TEXT NOT NULL,
  title       TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0
);

-- Footer Settings (single row, id = 1)
CREATE TABLE IF NOT EXISTS footer_settings (
  id   INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Site Settings (single row, id = 1)
CREATE TABLE IF NOT EXISTS site_settings (
  id   INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  image          TEXT DEFAULT '',
  aspect         TEXT DEFAULT '3/4',
  show_on_home   BOOLEAN DEFAULT false,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  description    TEXT DEFAULT '',
  sort_order     INTEGER DEFAULT 0
);

-- Finishes / Materials
CREATE TABLE IF NOT EXISTS finishes (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  image          TEXT DEFAULT '',
  show_on_home   BOOLEAN DEFAULT false,
  description    TEXT DEFAULT '',
  gallery_images JSONB DEFAULT '[]'::jsonb,
  sort_order     INTEGER DEFAULT 0
);

-- About Page (single row, id = 1, full JSON blob)
CREATE TABLE IF NOT EXISTS about (
  id   INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enquiries (form submissions)
CREATE TABLE IF NOT EXISTS enquiries (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT DEFAULT '',
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;
