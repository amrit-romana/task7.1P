"use client";

import { useEffect, useState, useTransition } from "react";
import { getDbData, addNavLink, updateNavLink, deleteNavLink, saveNavLinks } from "@/actions/admin";

type NavLink = { id: string; name: string; href: string };

export default function AdminLinksPage() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editHref, setEditHref] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getDbData().then(db => { setLinks(db.navLinks); setLoading(false); });
  }, []);

  const moveLinkUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...links];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setLinks(updated);
    startTransition(async () => {
      await saveNavLinks(updated);
    });
  };

  const moveLinkDown = (idx: number) => {
    if (idx === links.length - 1) return;
    const updated = [...links];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setLinks(updated);
    startTransition(async () => {
      await saveNavLinks(updated);
    });
  };

  const handleEdit = (link: NavLink) => {
    setEditingId(link.id);
    setEditName(link.name);
    setEditHref(link.href);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    startTransition(async () => {
      await updateNavLink(editingId, editName, editHref);
      setLinks(prev => prev.map(l => l.id === editingId ? { ...l, name: editName, href: editHref } : l));
      setEditingId(null);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteNavLink(id);
      setLinks(prev => prev.filter(l => l.id !== id));
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Navbar Links</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the links that appear in the top navigation bar. Changes apply globally.</p>
      </div>

      {/* Current Links Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Current Links</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{links.length} links</span>
        </div>

        {links.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No links added yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {links.map((link, index) => (
              <div key={link.id} className="px-6 py-3">
                {editingId === link.id ? (
                  <div className="flex items-center gap-3">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Display Name"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      value={editHref}
                      onChange={e => setEditHref(e.target.value)}
                      placeholder="/url"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
                    />
                    <button onClick={handleSaveEdit} disabled={isPending} className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-2 text-gray-500 hover:text-gray-700 text-xs font-medium transition">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-4">
                      <span className="font-medium text-sm text-gray-900 w-32 truncate">{link.name}</span>
                      <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{link.href}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveLinkUp(index)}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition flex items-center justify-center"
                        title="Move Up"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                      </button>
                      <button
                        onClick={() => moveLinkDown(index)}
                        disabled={index === links.length - 1}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition flex items-center justify-center"
                        title="Move Down"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      <div className="w-px h-4 bg-gray-200 mx-1" />
                      <button onClick={() => handleEdit(link)} className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(link.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition border border-red-100 disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Link */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 text-sm mb-4">Add New Link</h2>
        <form
          action={async (formData: FormData) => {
            const name = formData.get("name") as string;
            const href = formData.get("href") as string;
            if (!name || !href) return;
            await addNavLink(formData);
            const db = await getDbData();
            setLinks(db.navLinks);
          }}
          className="flex gap-3 items-end"
        >
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Name</label>
            <input name="name" required placeholder="e.g. Services" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL Path</label>
            <input name="href" required placeholder="/services" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition" />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Link
          </button>
        </form>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <svg className="text-amber-500 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-xs text-amber-700">Changes to navbar links apply site-wide and take effect immediately on page refresh.</p>
      </div>
    </div>
  );
}
