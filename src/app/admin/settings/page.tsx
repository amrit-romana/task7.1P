import { getDbData, saveSiteSettings } from "@/actions/admin";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminSettingsPage() {
  const db = await getDbData();
  const s = db.siteSettings || {};

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Control global website metadata and admin access settings.</p>
      </div>

      <form action={saveSiteSettings} className="flex flex-col gap-6">

        {/* SEO Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 text-sm mb-5 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            SEO & Metadata
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Site Title</label>
              <input name="siteTitle" defaultValue={s.siteTitle || ""} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" placeholder="Renaissance Decor | Master Artisans of Surface Design" />
              <p className="text-xs text-gray-400">Appears in browser tabs and search engine results. Keep under 60 characters.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Description</label>
              <textarea name="metaDescription" rows={3} defaultValue={s.metaDescription || ""} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none" placeholder="Bespoke Venetian Plaster, Micro Cement, and unique surface finishes..." />
              <p className="text-xs text-gray-400">Appears in Google search previews. Keep between 120–160 characters for best results.</p>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-700 transition flex items-center gap-2 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Settings
          </button>
        </div>
      </form>

      <ChangePasswordForm />

      {/* Info panel */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
        <svg className="text-blue-500 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <p className="text-xs font-semibold text-blue-800 mb-1">Deployment Note</p>
          <p className="text-xs text-blue-600">This CMS uses a local JSON file for storage. If deploying to Vercel or other serverless platforms, consider migrating to a persistent database (Supabase, PlanetScale, etc.) as the filesystem resets on each deploy.</p>
        </div>
      </div>
    </div>
  );
}
