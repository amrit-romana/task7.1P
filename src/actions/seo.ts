"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────────────────

export type SeoPageAudit = {
  path: string;
  title: string;
  targetKeyword: string;
  score: number;
  estimatedPosition: string;
  issues: string[];
  recommendations: string[];
};

export type SeoKeywordRanking = {
  keyword: string;
  ourPosition: string;
  topCompetitor: string;
  topCompetitorPosition: string;
};

export type SeoCompetitor = {
  name: string;
  domain: string;
  estimatedVisibility: string;
  strengths: string[];
  weaknesses: string[];
};

export type SeoRecommendation = {
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
};

export type SeoReport = {
  source: "manual" | "ai";
  overallScore: number;
  summary: string;
  pages: SeoPageAudit[];
  keywordRankings: SeoKeywordRanking[];
  competitors: SeoCompetitor[];
  topRecommendations: SeoRecommendation[];
};

export type SeoReportRow = {
  data: SeoReport;
  fetchedAt: string;
};

export type SeoHistoryPoint = {
  fetchedAt: string;
  overallScore: number;
  source: "manual" | "ai";
};

// ── Read ───────────────────────────────────────────────────────────────────

export async function getLatestSeoReport(): Promise<SeoReportRow | null> {
  try {
    const rows = await sql`
      SELECT data, fetched_at AS "fetchedAt"
      FROM seo_reports
      ORDER BY fetched_at DESC
      LIMIT 1
    `;
    if (!rows[0]) return null;
    return { data: rows[0].data as SeoReport, fetchedAt: rows[0].fetchedAt as string };
  } catch (error) {
    console.error("getLatestSeoReport failed:", error);
    return null;
  }
}

export async function getSeoReportHistory(limit = 10): Promise<SeoHistoryPoint[]> {
  try {
    const rows = await sql`
      SELECT
        fetched_at AS "fetchedAt",
        (data->>'overallScore')::int AS "overallScore",
        data->>'source' AS "source"
      FROM seo_reports
      ORDER BY fetched_at DESC
      LIMIT ${limit}
    `;
    return (rows as SeoHistoryPoint[]).reverse();
  } catch (error) {
    console.error("getSeoReportHistory failed:", error);
    return [];
  }
}

// ── Write ──────────────────────────────────────────────────────────────────

export async function saveSeoReport(report: SeoReport): Promise<void> {
  try {
    await sql`
      INSERT INTO seo_reports (data, fetched_at)
      VALUES (${JSON.stringify(report)}::jsonb, NOW())
    `;

    // Keep the table lean — retain the most recent 30 reports.
    await sql`
      DELETE FROM seo_reports
      WHERE id NOT IN (
        SELECT id FROM seo_reports ORDER BY fetched_at DESC LIMIT 30
      )
    `;

    revalidatePath("/admin/seo");
  } catch (error) {
    console.error("saveSeoReport failed:", error);
    throw error;
  }
}
