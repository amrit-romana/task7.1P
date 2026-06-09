import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { keyword, tone, wordCount, existingTitle, existingExcerpt } = await req.json();

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY not configured in environment variables." }, { status: 500 });
    }

    const systemPrompt = `You are an expert SEO content writer for Renaissance Decor, a premium decorative finishes company in Melbourne, Australia. They specialise in Venetian plaster, microcement, metal coatings, polished plasters, tadelakt, clay plaster, oxidation finishes, and more. Their brand tone is sophisticated, minimalist, and premium. Write in Australian English.`;

    let userPrompt = "";

    if (keyword) {
      // Keyword mode: generate a full SEO blog post
      userPrompt = `Write a full SEO-optimised blog article for Renaissance Decor targeting the keyword: "${keyword}".

Tone: ${tone || "professional and luxurious"}
Target word count: ${wordCount || 600}–${Math.round((wordCount || 600) * 1.3)} words

Structure the response as valid JSON with these exact fields:
{
  "title": "SEO-optimised article title",
  "slug": "seo-slug-from-title",
  "excerpt": "150 character meta description summary",
  "content": "Full article body (no markdown headers, just plain paragraphs separated by double newlines)"
}

Guidelines:
- Use the keyword naturally 3–5 times
- Include relevant secondary keywords related to decorative finishes
- Start with a compelling hook
- Include tips or insights that showcase expertise
- End with a soft call-to-action mentioning enquiring or visiting the showroom
- Do NOT include HTML tags or markdown`;
    } else if (existingTitle) {
      // Improve / rewrite mode
      userPrompt = `Improve this blog post for Renaissance Decor for better SEO and engagement:
Title: "${existingTitle}"
Excerpt: "${existingExcerpt || ""}"

Respond with valid JSON:
{
  "title": "improved SEO title",
  "slug": "improved-seo-slug",
  "excerpt": "improved 150-char meta description",
  "content": "Improved full body content"
}`;
    } else {
      return NextResponse.json({ error: "Provide either a keyword or existing title." }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://renaissancedecor.vercel.app",
        "X-Title": "Renaissance Decor CMS",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-haiku",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `OpenRouter API error: ${response.status} ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse AI response as JSON", raw: rawContent }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, post: parsed });
  } catch (error: any) {
    console.error("AI blog generate error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
