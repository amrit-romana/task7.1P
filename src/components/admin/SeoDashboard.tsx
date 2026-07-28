"use client";

import { useState } from "react";
import { saveSeoReport, type SeoReport, type SeoReportRow, type SeoHistoryPoint } from "@/actions/seo";

function scoreColor(score: number): { text: string; bg: string; ring: string } {
  if (score >= 70) return { text: "text-emerald-600", bg: "bg-emerald-50", ring: "#10b981" };
  if (score >= 45) return { text: "text-amber-600", bg: "bg-amber-50", ring: "#f59e0b" };
  return { text: "text-rose-600", bg: "bg-rose-50", ring: "#ef4444" };
}

function priorityStyle(priority: string): string {
  if (priority === "high") return "bg-rose-50 text-rose-700 border-rose-100";
  if (priority === "medium") return "bg-amber-50 text-amber-700 border-amber-100";
  return "bg-gray-50 text-gray-600 border-gray-100";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScoreDonut({ score }: { score: number }) {
  const c = scoreColor(score);
  return (
    <div className="w-16 h-16 relative flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={c.ring} strokeWidth="3"
          strokeDasharray={`${score} ${100 - score}`}
          strokeDashoffset="25" strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{score}</span>
      </div>
    </div>
  );
}

function PageAuditCard({ page }: { page: SeoReport["pages"][number] }) {
  const [open, setOpen] = useState(false);
  const c = scoreColor(page.score);
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition text-left"
      >
        <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
          {page.score}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 font-mono truncate">{page.path}</p>
          <p className="text-xs text-gray-400 truncate">
            Target: <span className="text-gray-600">{page.targetKeyword}</span> · Position: <span className="text-gray-600">{page.estimatedPosition}</span>
          </p>
        </div>
        <svg className={`text-gray-300 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-gray-100 p-4 bg-[#FCFCFA] flex flex-col gap-3">
          <p className="text-xs text-gray-400"><span className="font-semibold text-gray-600">Title tag:</span> {page.title || "—"}</p>
          {page.issues.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Issues</p>
              <div className="flex flex-col gap-1.5">
                {page.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-rose-400 mt-0.5">•</span>{issue}
                  </div>
                ))}
              </div>
            </div>
          )}
          {page.recommendations.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Recommendations</p>
              <div className="flex flex-col gap-1.5">
                {page.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-emerald-500 mt-0.5">•</span>{rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SeoDashboard({
  initialReport,
  initialHistory,
}: {
  initialReport: SeoReportRow | null;
  initialHistory: SeoHistoryPoint[];
}) {
  const [report, setReport] = useState<SeoReport | null>(initialReport?.data ?? null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(initialReport?.fetchedAt ?? null);
  const [history, setHistory] = useState<SeoHistoryPoint[]>(initialHistory);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runReport = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/seo-report", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to generate SEO report.");
      }
      const newReport: SeoReport = json.report;
      await saveSeoReport(newReport);
      const now = new Date().toISOString();
      setReport(newReport);
      setFetchedAt(now);
      setHistory((prev) => [...prev, { fetchedAt: now, overallScore: newReport.overallScore, source: "ai" as const }].slice(-10));
    } catch (e: any) {
      setError(e.message || "Something went wrong running the SEO report.");
    } finally {
      setRunning(false);
    }
  };

  const maxHistScore = Math.max(...history.map((h) => h.overallScore), 1);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {fetchedAt ? (
              <>Last fetched <span className="font-medium text-gray-700">{formatDate(fetchedAt)}</span></>
            ) : (
              "No report yet."
            )}
            {report && (
              <span className={`ml-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${report.source === "ai" ? "bg-violet-50 text-violet-700 border-violet-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                {report.source === "ai" ? "AI Report" : "Manual Baseline"}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={runReport}
          disabled={running}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {running ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Running report…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
              Run SEO Report
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!report ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-400 text-sm">
          No SEO data yet. Click "Run SEO Report" to generate the first report.
        </div>
      ) : (
        <>
          {/* Overall score + summary + trend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center gap-5">
              <ScoreDonut score={report.overallScore} />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Overall Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{report.overallScore}<span className="text-sm font-normal text-gray-400">/100</span></p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed">{report.summary}</p>
            </div>
          </div>

          {/* Trend */}
          {history.length > 1 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Score Trend</p>
              <div className="flex items-end gap-2 h-24">
                {history.map((h, i) => {
                  const pct = Math.max((h.overallScore / maxHistScore) * 100, 4);
                  const c = scoreColor(h.overallScore);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                      <div className="w-full rounded-t-md transition-all" style={{ height: `${pct}%`, backgroundColor: c.ring }} title={`${h.overallScore} — ${formatDate(h.fetchedAt)}`} />
                      <p className="text-[9px] text-gray-400 whitespace-nowrap">{new Date(h.fetchedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Page audits */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Page-by-Page SEO</h2>
            <div className="flex flex-col gap-2">
              {report.pages.map((page) => (
                <PageAuditCard key={page.path} page={page} />
              ))}
            </div>
          </div>

          {/* Keyword rankings */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Keyword Rankings vs. Competitors</h2>
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Keyword</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Our Position</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Top Competitor</th>
                      <th className="px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Their Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.keywordRankings.map((k, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="px-4 py-3 text-gray-900 font-medium">{k.keyword}</td>
                        <td className="px-4 py-3 text-gray-600">{k.ourPosition}</td>
                        <td className="px-4 py-3 text-gray-600">{k.topCompetitor}</td>
                        <td className="px-4 py-3 text-gray-600">{k.topCompetitorPosition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Competitors */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Competitor Landscape</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {report.competitors.map((comp, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{comp.name}</p>
                      <p className="text-xs text-gray-400">{comp.domain}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 whitespace-nowrap">
                      {comp.estimatedVisibility}
                    </span>
                  </div>
                  {comp.strengths.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Strengths</p>
                      {comp.strengths.map((s, j) => (
                        <p key={j} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">•</span>{s}</p>
                      ))}
                    </div>
                  )}
                  {comp.weaknesses.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Weaknesses</p>
                      {comp.weaknesses.map((s, j) => (
                        <p key={j} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="text-rose-400 mt-0.5">•</span>{s}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top recommendations */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Priority Improvements</h2>
            <div className="flex flex-col gap-2">
              {report.topRecommendations.map((rec, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider flex-shrink-0 ${priorityStyle(rec.priority)}`}>
                    {rec.priority}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{rec.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{rec.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-300 text-center">
            Rankings and competitor visibility are estimated by Claude (via OpenRouter, web-search enabled) at the time of each report and should be cross-checked against Google Search Console for critical decisions.
          </p>
        </>
      )}
    </div>
  );
}
