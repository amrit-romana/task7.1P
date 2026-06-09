"use server";
import sql from "@/lib/db";

export async function incrementPageView(path: string): Promise<void> {
  try {
    // Normalise path (remove trailing slash, keep clean)
    let cleanPath = path.trim().split("?")[0];
    if (cleanPath.endsWith("/") && cleanPath.length > 1) {
      cleanPath = cleanPath.slice(0, -1);
    }
    if (!cleanPath) cleanPath = "/";

    await sql`
      INSERT INTO analytics_views (page_path, views, updated_at)
      VALUES (${cleanPath}, 1, NOW())
      ON CONFLICT (page_path)
      DO UPDATE SET views = analytics_views.views + 1, updated_at = NOW()
    `;
  } catch (error) {
    console.error("incrementPageView failed:", error);
  }
}

export async function getAnalyticsReports(): Promise<{ page_path: string; views: number; updated_at: string }[]> {
  try {
    const rows = await sql`
      SELECT page_path AS "page_path", views, updated_at AS "updated_at"
      FROM analytics_views
      ORDER BY views DESC
    `;
    return rows as { page_path: string; views: number; updated_at: string }[];
  } catch (error) {
    console.error("getAnalyticsReports failed:", error);
    return [];
  }
}
