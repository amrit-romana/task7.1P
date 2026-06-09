/**
 * Migration — run once to create products, courses, and analytics_views tables.
 * Usage: npx tsx scripts/migrate-new-tables.ts
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
  console.log("🌱 Creating products, courses, and analytics tables...");

  // 1. Create products table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL DEFAULT '',
      url         TEXT NOT NULL DEFAULT '',
      image       TEXT NOT NULL DEFAULT '',
      sort_order  INTEGER DEFAULT 0
    )
  `;

  // 2. Create courses table
  await sql`
    CREATE TABLE IF NOT EXISTS courses (
      id              TEXT PRIMARY KEY,
      title           TEXT NOT NULL DEFAULT '',
      price           TEXT DEFAULT 'TBC',
      duration        TEXT DEFAULT '1 Day',
      location        TEXT DEFAULT 'Unit 5 / 314 Governor Road, Braeside 3195',
      date            TEXT DEFAULT 'TBC',
      image           TEXT DEFAULT '',
      description     TEXT DEFAULT '',
      inclusions      JSONB DEFAULT '[]',
      enquiry_subject TEXT DEFAULT '',
      sort_order      INTEGER DEFAULT 0
    )
  `;

  // 3. Create analytics_views table
  await sql`
    CREATE TABLE IF NOT EXISTS analytics_views (
      page_path   TEXT PRIMARY KEY,
      views       INTEGER DEFAULT 0,
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // 4. Seed default products if empty
  const prodCheck = await sql`SELECT COUNT(*) as count FROM products`;
  if (Number(prodCheck[0].count) === 0) {
    console.log("Seeding default products...");
    const defaultProducts = [
      { id: "1", name: "Venetian Plasters", url: "https://lustrefx.com.au/product-category/surfaces/venetian-plaster/", image: "https://renaissancedecor.com.au/wp-content/uploads/2025/06/BeautifulBeast.jpg" },
      { id: "2", name: "Metals", url: "https://lustrefx.com.au/product-category/surfaces/metals/", image: "https://renaissancedecor.com.au/wp-content/uploads/2025/06/Metalswholefamily.jpg" },
      { id: "3", name: "Concretes", url: "https://lustrefx.com.au/product-category/surfaces/concretes/", image: "https://renaissancedecor.com.au/wp-content/uploads/2025/06/RustyChocolate.jpg" },
      { id: "4", name: "Patinas", url: "https://lustrefx.com.au/product-category/surfaces/patinas/", image: "https://renaissancedecor.com.au/wp-content/uploads/2025/06/TheLover.jpg" },
      { id: "5", name: "Primers & Topcoats", url: "https://lustrefx.com.au/product-category/primers-topcoats/", image: "https://renaissancedecor.com.au/wp-content/uploads/2025/06/TheUnicorn.jpg" },
      { id: "6", name: "Tools", url: "https://lustrefx.com.au/product-category/tools/", image: "https://renaissancedecor.com.au/wp-content/uploads/2025/06/Mammoth-sponge-large-2.jpg" }
    ];

    for (const [idx, p] of defaultProducts.entries()) {
      await sql`
        INSERT INTO products (id, name, url, image, sort_order)
        VALUES (${p.id}, ${p.name}, ${p.url}, ${p.image}, ${idx})
      `;
    }
  }

  // 5. Seed default courses if empty
  const courseCheck = await sql`SELECT COUNT(*) as count FROM courses`;
  if (Number(courseCheck[0].count) === 0) {
    console.log("Seeding default courses...");
    const defaultCourses = [
      {
        id: "venetian-plaster-beginners",
        title: "Venetian Plasters - Beginners",
        price: "$750.00",
        duration: "1 Day",
        location: "Unit 5 / 314 Governor Road, Braeside 3195",
        date: "TBC (Register Interest)",
        image: "/images/textured_wall_detail_1779881978134.png",
        description: "Intensive hands-on training of key Venetian plaster finishes. Learn the fundamentals of surface preparation, base coating, and refined trowel techniques to achieve authentic polished and textured Italian finishes.",
        inclusions: [
          "Certificate of completion",
          "Intensive training of key Venetian finishes by LustreFX",
          "Sample boards to take home for client presentations",
          "Free sample pots of products to start your practice",
          "Detailed reference workbook to take home",
          "Lunch, gourmet snacks, and drinks provided",
          "Ongoing expert technical support via phone/email"
        ],
        enquirySubject: "Venetian Plasters - Beginners"
      },
      {
        id: "metal-coatings",
        title: "Metal Coatings & Finishes",
        price: "TBC",
        duration: "1 Day",
        location: "Unit 5 / 314 Governor Road, Braeside 3195",
        date: "TBC (Register Interest)",
        image: "/images/modern_concrete_interior_1779881917291.png",
        description: "Master the application of liquid metal coatings and advanced oxidation techniques. Discover how to apply real metal to any surface and accelerate beautiful, natural rust, patina, and burnished textures.",
        inclusions: [
          "Certificate of completion",
          "Intensive training of key metal finishes by LustreFX",
          "Sample boards to take home for client presentations",
          "Free sample pots of products to start your practice",
          "Detailed reference workbook to take home",
          "Lunch, gourmet snacks, and drinks provided",
          "Ongoing expert technical support via phone/email"
        ],
        enquirySubject: "Metal Coatings & Finishes"
      },
      {
        id: "microcement-beginners",
        title: "Microcement - Beginners",
        price: "TBC",
        duration: "1 Day",
        location: "Unit 5 / 314 Governor Road, Braeside 3195",
        date: "TBC (Register Interest)",
        image: "/images/db_verification_test_1778646278288.webp",
        description: "Gain expert skills in microcement floor and wall applications. Learn the step-by-step processes of applying durable, seamless, waterproof microcement finishes by Hychem for residential and commercial spaces.",
        inclusions: [
          "Certificate of completion",
          "Intensive training in Microcement finishing by Hychem",
          "Sample boards to take home for client presentations",
          "Free sample pots of products to start your practice",
          "Detailed reference workbook to take home",
          "Lunch, snacks and drinks provided",
          "Ongoing expert technical support via phone/email"
        ],
        enquirySubject: "Microcement - Beginners"
      }
    ];

    for (const [idx, c] of defaultCourses.entries()) {
      await sql`
        INSERT INTO courses (id, title, price, duration, location, date, image, description, inclusions, enquiry_subject, sort_order)
        VALUES (
          ${c.id},
          ${c.title},
          ${c.price},
          ${c.duration},
          ${c.location},
          ${c.date},
          ${c.image},
          ${c.description},
          ${JSON.stringify(c.inclusions)}::jsonb,
          ${c.enquirySubject},
          ${idx}
        )
      `;
    }
  }

  // 6. Seed default analytics if empty
  const pageViewCheck = await sql`SELECT COUNT(*) as count FROM analytics_views`;
  if (Number(pageViewCheck[0].count) === 0) {
    console.log("Seeding default page views...");
    const pages = ["/", "/blog", "/courses", "/materials", "/projects", "/shop", "/enquire"];
    for (const path of pages) {
      await sql`
        INSERT INTO analytics_views (page_path, views, updated_at)
        VALUES (${path}, ${Math.floor(Math.random() * 100) + 10}, NOW())
      `;
    }
  }

  console.log("✅ Database tables successfully created and seeded!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
