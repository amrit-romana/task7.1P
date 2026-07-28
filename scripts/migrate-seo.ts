/**
 * Migration — creates the seo_reports table and seeds one manually-curated
 * baseline report so the admin SEO dashboard has data on first load.
 * Usage: npx tsx scripts/migrate-seo.ts
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

// Manually curated baseline — grounded in the live site's actual metadata/sitemap
// and a real competitor search (2026-07-29). Scores are heuristic technical-SEO
// assessments, not live rank-tracker output; positions are marked unmeasured
// until the first AI-powered report runs.
const BASELINE_REPORT = {
  source: "manual",
  overallScore: 58,
  summary:
    "Baseline technical audit set manually before the first automated report. Renaissance Decor has a solid technical foundation (LocalBusiness schema, sitemap, GTM) but several key pages share the homepage's title/description instead of unique per-page metadata, and no live rank-tracking has been run yet. Run an AI SEO Report to pull current keyword positions and refresh competitor data.",
  pages: [
    {
      path: "/",
      title: "Renaissance Decor | Venetian Plaster & Decorative Finishes Melbourne",
      targetKeyword: "venetian plaster melbourne",
      score: 74,
      estimatedPosition: "Not yet measured",
      issues: [
        "Meta description is broad brand copy rather than tightly targeted to one primary keyword",
      ],
      recommendations: [
        "Add a short, keyword-led opening paragraph above the fold restating \"Venetian plaster Melbourne\" naturally",
        "Run the AI report to confirm current ranking position for the primary keyword",
      ],
    },
    {
      path: "/venetian-plaster",
      title: "Venetian Plaster Finishes - Renaissance Decor",
      targetKeyword: "venetian plaster melbourne",
      score: 68,
      estimatedPosition: "Not yet measured",
      issues: [
        "Core service page competing directly with dedicated single-service competitors",
      ],
      recommendations: [
        "Expand content with process detail, FAQs and suburb mentions to build topical depth",
        "Add internal links from blog posts targeting related long-tail terms",
      ],
    },
    {
      path: "/materials",
      title: "Inherits homepage title/description",
      targetKeyword: "decorative wall finishes melbourne",
      score: 46,
      estimatedPosition: "Not yet measured",
      issues: [
        "No page-level metadata export — falls back to the homepage title template and description",
      ],
      recommendations: [
        "Add a dedicated generateMetadata with a unique title and description for this hub page",
        "Ensure each material sub-page (microcement, clay plaster, etc.) also has unique metadata",
      ],
    },
    {
      path: "/projects",
      title: "Inherits homepage title/description",
      targetKeyword: "venetian plaster portfolio melbourne",
      score: 44,
      estimatedPosition: "Not yet measured",
      issues: [
        "No page-level metadata export — duplicate title/description with homepage",
        "Portfolio pages are a strong local-proof signal that isn't being surfaced to search engines with unique copy",
      ],
      recommendations: [
        "Add unique metadata summarising the portfolio and suburbs covered",
        "Add short descriptive alt text and captions per project image",
      ],
    },
    {
      path: "/blog",
      title: "Blog | Renaissance Decor",
      targetKeyword: "venetian plaster tips melbourne",
      score: 55,
      estimatedPosition: "Not yet measured",
      issues: [
        "Publishing cadence and topical coverage unverified in this baseline",
      ],
      recommendations: [
        "Target long-tail, suburb- and finish-specific keywords per post (e.g. \"microcement bathroom Brighton\")",
        "Interlink blog posts to /materials and /venetian-plaster service pages",
      ],
    },
    {
      path: "/courses",
      title: "Courses | Renaissance Decor",
      targetKeyword: "venetian plaster course melbourne",
      score: 58,
      estimatedPosition: "Not yet measured",
      issues: [],
      recommendations: [
        "Add FAQ schema for common course questions to earn rich snippets",
      ],
    },
    {
      path: "/about",
      title: "Inherits homepage title/description",
      targetKeyword: "renaissance decor melbourne",
      score: 45,
      estimatedPosition: "Not yet measured",
      issues: [
        "No page-level metadata export — duplicate title/description with homepage",
      ],
      recommendations: [
        "Add unique metadata highlighting founder experience and UK training for brand/E-E-A-T signals",
      ],
    },
    {
      path: "/enquire",
      title: "Inherits homepage title/description",
      targetKeyword: "venetian plaster quote melbourne",
      score: 42,
      estimatedPosition: "Not yet measured",
      issues: [
        "No page-level metadata export",
      ],
      recommendations: [
        "Low SEO priority by design, but a unique title (\"Get a Quote\") would still help click-through from branded search",
      ],
    },
  ],
  keywordRankings: [
    { keyword: "venetian plaster melbourne", ourPosition: "Not yet measured", topCompetitor: "Venetian Plaster Gallery Melbourne", topCompetitorPosition: "Not yet measured" },
    { keyword: "polished plaster melbourne", ourPosition: "Not yet measured", topCompetitor: "Melbourne Artisan", topCompetitorPosition: "Not yet measured" },
    { keyword: "microcement melbourne", ourPosition: "Not yet measured", topCompetitor: "Cimento Studio", topCompetitorPosition: "Not yet measured" },
    { keyword: "venetian plaster mornington peninsula", ourPosition: "Not yet measured", topCompetitor: "Unknown", topCompetitorPosition: "Not yet measured" },
  ],
  competitors: [
    {
      name: "Venetian Plaster Gallery Melbourne",
      domain: "venetianplastergallery.com.au",
      estimatedVisibility: "Not yet measured",
      strengths: ["Exclusive Australian supplier of Stucco Italiano (strong brand/product differentiation)", "Multi-city presence (Sydney, Adelaide, expanding to Melbourne)"],
      weaknesses: ["Melbourne arm newer than its Sydney/Adelaide operations"],
    },
    {
      name: "Melbourne Artisan",
      domain: "melbourneartisan.com.au",
      estimatedVisibility: "Not yet measured",
      strengths: ["Positions itself as an award-winning specialist, strong content marketing"],
      weaknesses: ["Not yet measured"],
    },
    {
      name: "MT Venetian Plaster",
      domain: "mtvenetianplaster.com",
      estimatedVisibility: "Not yet measured",
      strengths: ["Founder training narrative similar to Renaissance Decor (Italy vs UK)"],
      weaknesses: ["Not yet measured"],
    },
  ],
  topRecommendations: [
    { priority: "high", title: "Add unique metadata to /about, /projects, /materials, /enquire", detail: "These pages currently have no generateMetadata export and silently inherit the homepage's title and description, which weakens their individual keyword targeting and can read as duplicate content to search engines." },
    { priority: "high", title: "Run the first AI-powered SEO report", detail: "This baseline has no verified keyword positions or competitor visibility. Click \"Run SEO Report\" to have Claude (via OpenRouter, web-search enabled) check current rankings and refresh this dashboard." },
    { priority: "medium", title: "Build topical depth on /venetian-plaster and /materials", detail: "Add FAQs, process detail, and suburb-specific content to compete with single-service specialists and strengthen internal linking from the blog." },
    { priority: "medium", title: "Establish a consistent blog cadence targeting long-tail, suburb-level keywords", detail: "Posts like \"microcement bathroom Brighton\" or \"Venetian plaster feature wall Toorak\" can capture demand competitors are not targeting directly." },
  ],
};

async function migrate() {
  console.log("🌱 Creating seo_reports table...");

  await sql`
    CREATE TABLE IF NOT EXISTS seo_reports (
      id          SERIAL PRIMARY KEY,
      data        JSONB NOT NULL DEFAULT '{}'::jsonb,
      fetched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const check = await sql`SELECT COUNT(*) as count FROM seo_reports`;
  if (Number(check[0].count) === 0) {
    console.log("Seeding manual baseline SEO report...");
    await sql`
      INSERT INTO seo_reports (data, fetched_at)
      VALUES (${JSON.stringify(BASELINE_REPORT)}::jsonb, NOW())
    `;
  } else {
    console.log("seo_reports already has data — skipping seed.");
  }

  console.log("✅ seo_reports table ready.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
