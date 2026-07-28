import { getLatestSeoReport, getSeoReportHistory } from "@/actions/seo";
import SeoDashboard from "@/components/admin/SeoDashboard";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const [report, history] = await Promise.all([
    getLatestSeoReport(),
    getSeoReportHistory(10),
  ]);

  return <SeoDashboard initialReport={report} initialHistory={history} />;
}
