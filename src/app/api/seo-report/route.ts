import { NextResponse } from "next/server";
import type { SeoReport } from "@/actions/seo";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SITE_URL = "https://renaissancedecor.com.au";

const AUDIT_PAGES = [
  { path: "/", keyword: "venetian plaster melbourne" },
  { path: "/venetian-plaster", keyword: "venetian plaster melbourne" },
  { path: "/materials", keyword: "decorative wall finishes melbourne" },
  { path: "/projects", keyword: "venetian plaster portfolio melbourne" },
  { path: "/blog", keyword: "venetian plaster tips melbourne" },
  { path: "/courses", keyword: "venetian plaster course melbourne" },
  { path: "/about", keyword: "renaissance decor melbourne" },
  { path: "/enquire", keyword: "venetian plaster quote melbourne" },
];

const KNOWN_COMPETITOR_SEEDS = [
  "Venetian Plaster Gallery Melbourne (venetianplastergallery.com.au)",
  "Melbourne Artisan (melbourneartisan.com.au)",
  "MT Venetian Plaster (mtvenetianplaster.com)",
  "Cimento Studio (cimentostudio.com.au)",
];

// ── Lightweight on-page HTML extraction (no external deps) ─────────────────

function extractTag(html: string, regex: RegExp): string {
  const match = html.match(regex);
  return match ? match[1].trim().replace(/\s+/g, " ") : "";
}

async function auditPage(path: string, keyword: string) {
  const url = `${SITE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RenaissanceDecor-SEO-Auditor/1.0" },
      cache: "no-store",
    });
    const html = await res.text();

    const title = extractTag(html, /<title>([^<]*)<\/title>/i);
    const description = extractTag(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const h1 = extractTag(html, /<h1[^>]*>([^<]*)<\/h1>/i);
    const canonical = extractTag(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);

    const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
    const wordCount = textOnly.split(/\s+/).filter(Boolean).length;

    const imgTags = html.match(/<img\s+[^>]*>/gi) || [];
    const imgsWithAlt = imgTags.filter((tag) => /alt=["'][^"']+["']/i.test(tag)).length;

    return {
      path,
      keyword,
      httpStatus: res.status,
      title,
      description,
      h1,
      canonical,
      wordCount,
      imageCount: imgTags.length,
      imagesWithAlt: imgsWithAlt,
    };
  } catch (error: any) {
    return { path, keyword, httpStatus: 0, title: "", description: "", h1: "", canonical: "", wordCount: 0, imageCount: 0, imagesWithAlt: 0, error: error.message };
  }
}

export async function POST() {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured in environment variables." }, { status: 500 });
  }

  try {
    // 1. Real technical on-page audit of the live site.
    const pageAudits = await Promise.all(AUDIT_PAGES.map((p) => auditPage(p.path, p.keyword)));

    const model = process.env.OPENROUTER_SEO_MODEL || "anthropic/claude-sonnet-4.5";

    const systemPrompt = `You are an SEO analyst for Renaissance Decor, a premium Venetian plaster & decorative finishes company based in Braeside, Melbourne, Australia (renaissancedecor.com.au). You have live web search available — use it to check current Google.com.au rankings and identify real competitors. Always respond with ONLY valid JSON matching the exact schema requested, no markdown fences, no commentary.`;

    const userPrompt = `Here is a real technical on-page audit of our live site, one entry per page (extracted just now via HTTP fetch):

${JSON.stringify(pageAudits, null, 2)}

Known/previously identified competitors to re-verify and expand on: ${KNOWN_COMPETITOR_SEEDS.join(", ")}.

Using live web search, research current Google Australia search rankings for Renaissance Decor and the target keyword for each page above, plus these general category keywords: "venetian plaster melbourne", "polished plaster melbourne", "microcement melbourne", "venetian plaster mornington peninsula". Identify who currently ranks above Renaissance Decor for these terms (real business names and domains only — do not invent companies).

Return ONLY a JSON object with this exact shape:
{
  "overallScore": <0-100 integer, weighted average of page scores>,
  "summary": "<2-3 sentence executive summary of current SEO standing and what changed>",
  "pages": [
    {
      "path": "<page path from the audit>",
      "title": "<the page's actual <title> from the audit data>",
      "targetKeyword": "<primary keyword>",
      "score": <0-100 integer>,
      "estimatedPosition": "<e.g. '4-7', 'Page 1 (position 3)', 'Not ranking in top 20', based on real search results>",
      "issues": ["<short technical or content issue>", ...],
      "recommendations": ["<short actionable fix>", ...]
    }
  ],
  "keywordRankings": [
    { "keyword": "<keyword>", "ourPosition": "<position or 'Not ranking in top 20'>", "topCompetitor": "<real business name>", "topCompetitorPosition": "<their position>" }
  ],
  "competitors": [
    { "name": "<real business name>", "domain": "<their domain>", "estimatedVisibility": "High|Medium|Low", "strengths": ["..."], "weaknesses": ["..."] }
  ],
  "topRecommendations": [
    { "priority": "high|medium|low", "title": "<short title>", "detail": "<1-2 sentence explanation>" }
  ]
}

Base scores partly on the real technical audit data provided (title/description length, H1 presence, word count, image alt coverage) and partly on the live search rankings you find. Be specific and honest — if a page isn't ranking, say so rather than guessing optimistically.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://renaissancedecor.vercel.app",
        "X-Title": "Renaissance Decor CMS - SEO Dashboard",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        plugins: [{ id: "web", max_results: 6 }],
        temperature: 0.3,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `OpenRouter API error: ${response.status} ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const rawContent = choice?.message?.content || "";

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse AI response as JSON", raw: rawContent }, { status: 500 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError: any) {
      const truncationNote = choice?.finish_reason === "length"
        ? " The response was cut off (hit the token limit) before the JSON finished — try again or raise max_tokens."
        : "";
      return NextResponse.json({
        error: `Could not parse AI response as JSON: ${parseError.message}.${truncationNote}`,
        raw: rawContent,
      }, { status: 500 });
    }

    const report: SeoReport = { ...parsed, source: "ai" };

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("SEO report generation error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
