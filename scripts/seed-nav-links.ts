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

async function seed() {
  console.log("Checking nav_links table...");

  const existingLinks = await sql`SELECT href FROM nav_links`;
  const hrefs = existingLinks.map((l: any) => l.href);

  // Add Courses if missing
  if (!hrefs.includes("/courses")) {
    console.log("Adding Courses to nav_links...");
    const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM nav_links`;
    const nextOrder = (maxOrder[0].m as number) + 1;
    await sql`
      INSERT INTO nav_links (id, name, href, sort_order)
      VALUES (${"c" + Date.now()}, 'Courses', '/courses', ${nextOrder})
    `;
  }

  // Add Journal if missing
  if (!hrefs.includes("/blog")) {
    console.log("Adding Journal to nav_links...");
    const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM nav_links`;
    const nextOrder = (maxOrder[0].m as number) + 1;
    await sql`
      INSERT INTO nav_links (id, name, href, sort_order)
      VALUES (${"j" + Date.now()}, 'Journal', '/blog', ${nextOrder})
    `;
  }

  console.log("✅ nav_links verified and seeded!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
