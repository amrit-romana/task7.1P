import { getDbData } from "@/actions/admin";
import { getProjects } from "@/actions/projects";
import { getFinishes } from "@/actions/finishes";
import { getBlogPosts } from "@/actions/blog";
import { getAnalyticsReports } from "@/actions/analytics";
import { getProducts } from "@/actions/products";
import { getCourses } from "@/actions/courses";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [db, projects, finishes, posts, analytics, products, courses] = await Promise.all([
    getDbData(),
    getProjects(),
    getFinishes(),
    getBlogPosts(false),
    getAnalyticsReports(),
    getProducts(),
    getCourses(),
  ]);

  const publishedPosts = posts.filter((p) => p.published).length;
  const draftPosts = posts.length - publishedPosts;

  // Total views
  const totalViews = analytics.reduce((sum, a) => sum + (a.views || 0), 0);

  // Top 5 pages by views
  const topPages = analytics.slice(0, 5);

  // Most popular page
  const topPage = analytics[0];

  const stats = [
    { label: "Hero Slides", value: db.carouselItems.length, href: "/admin/carousel", color: "bg-violet-50 text-violet-600", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
    { label: "Projects", value: projects.length, href: "/admin/portfolio", color: "bg-amber-50 text-amber-600", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
    { label: "Blog Posts", value: posts.length, href: "/admin/blog", color: "bg-blue-50 text-blue-600", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { label: "Total Page Views", value: totalViews, href: "/admin", color: "bg-emerald-50 text-emerald-600", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
    { label: "Finishes", value: finishes.length, href: "/admin/portfolio", color: "bg-rose-50 text-rose-600", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
    { label: "Courses", value: courses.length, href: "/admin/courses", color: "bg-orange-50 text-orange-600", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  ];

  const quickActions = [
    { label: "Edit Hero Slides", desc: "Add or remove homepage carousel images", href: "/admin/carousel" },
    { label: "Manage Blog Posts", desc: "Write, edit and publish journal articles", href: "/admin/blog" },
    { label: "Manage Courses", desc: "Update training course details and dates", href: "/admin/courses" },
    { label: "Manage Products", desc: "Update product categories and images", href: "/admin/products" },
    { label: "Portfolio", desc: "Manage projects and surface finishes", href: "/admin/portfolio" },
    { label: "Navbar Links", desc: "Change navigation menu items", href: "/admin/links" },
    { label: "Testimonials", desc: "Update client quotes and names", href: "/admin/testimonials" },
    { label: "Footer Settings", desc: "Update contact info and social links", href: "/admin/footer" },
    { label: "Site Settings", desc: "Update page title and meta description", href: "/admin/settings" },
  ];

  const health = [
    { label: "Hero slides configured", ok: db.carouselItems.length > 0 },
    { label: "Testimonials present", ok: db.testimonials.length > 0 },
    { label: "Navbar links set", ok: db.navLinks.length > 0 },
    { label: "Projects added", ok: projects.length > 0 },
    { label: "Finishes added", ok: finishes.length > 0 },
    { label: "Blog posts published", ok: publishedPosts > 0 },
    { label: "Courses listed", ok: courses.length > 0 },
    { label: "Footer phone set", ok: !!db.footerSettings?.phone },
  ];

  const healthScore = Math.round((health.filter((h) => h.ok).length / health.length) * 100);

  // Build page view bar chart data (top 6 pages)
  const chartPages = analytics.slice(0, 6);
  const maxViews = Math.max(...chartPages.map((p) => p.views), 1);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back — {totalViews} total page views tracked.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          Site Online
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700 transition">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Analytics + Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Page Views Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live Page Views</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalViews.toLocaleString()} <span className="text-sm font-normal text-gray-400">total tracked</span>
              </p>
              {topPage && (
                <p className="text-xs text-gray-400 mt-1">
                  Most visited: <span className="font-semibold text-gray-600">{topPage.page_path}</span> ({topPage.views} views)
                </p>
              )}
            </div>
            <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded font-mono">
              Live DB data
            </span>
          </div>

          {/* Bar Chart */}
          {chartPages.length > 0 ? (
            <div className="space-y-3">
              {chartPages.map((page) => {
                const pct = Math.round((page.views / maxViews) * 100);
                return (
                  <div key={page.page_path} className="flex items-center gap-3">
                    <p className="text-xs font-mono text-gray-500 w-32 truncate flex-shrink-0">{page.page_path}</p>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 w-10 text-right flex-shrink-0">
                      {page.views}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No page views recorded yet. Views will appear as visitors browse your site.
            </div>
          )}
        </div>

        {/* Content Health */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Content Health</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{healthScore}<span className="text-sm font-normal text-gray-400">%</span></p>
            </div>
            <div className="w-12 h-12 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={healthScore >= 80 ? "#10b981" : healthScore >= 50 ? "#f59e0b" : "#ef4444"} strokeWidth="3" strokeDasharray={`${healthScore} ${100 - healthScore}`} strokeDashoffset="25" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {health.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.ok ? "bg-emerald-100" : "bg-gray-100"}`}>
                  {item.ok ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="19"/></svg>
                  )}
                </div>
                <span className={`text-xs ${item.ok ? "text-gray-700" : "text-gray-400"}`}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Blog publish summary */}
          {posts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Blog Status</p>
              <div className="flex gap-3">
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                  {publishedPosts} Published
                </span>
                {draftPosts > 0 && (
                  <span className="flex items-center gap-1.5 bg-gray-50 text-gray-500 text-xs font-semibold px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
                    {draftPosts} Draft
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 group flex items-start justify-between"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-gray-700">{action.label}</p>
                <p className="text-gray-400 text-xs mt-1">{action.desc}</p>
              </div>
              <svg className="text-gray-300 group-hover:text-gray-600 transition mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
