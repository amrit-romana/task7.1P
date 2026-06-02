"use client";

import { useEffect, useState, useTransition } from "react";
import { getDbData, addCarouselItem, updateCarouselItem, deleteCarouselItem, saveCarouselItems } from "@/actions/admin";

type Slide = { id: string; imageSrc: string; title: string; subtitle: string };

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ imageSrc: "", title: "", subtitle: "" });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getDbData().then(db => { setSlides(db.carouselItems); setLoading(false); });
  }, []);

  const moveSlideUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...slides];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setSlides(updated);
    startTransition(async () => {
      await saveCarouselItems(updated);
    });
  };

  const moveSlideDown = (idx: number) => {
    if (idx === slides.length - 1) return;
    const updated = [...slides];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setSlides(updated);
    startTransition(async () => {
      await saveCarouselItems(updated);
    });
  };

  const handleEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setEditData({ imageSrc: slide.imageSrc, title: slide.title, subtitle: slide.subtitle });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    startTransition(async () => {
      await updateCarouselItem(editingId, editData.imageSrc, editData.title, editData.subtitle);
      setSlides(prev => prev.map(s => s.id === editingId ? { ...s, ...editData } : s));
      setEditingId(null);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteCarouselItem(id);
      setSlides(prev => prev.filter(s => s.id !== id));
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
        <h1 className="text-2xl font-bold text-gray-900">Hero Carousel</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the full-screen background slides on the homepage. Use direct image URLs.</p>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide, idx) => (
          <div key={slide.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {/* Image Preview */}
            <div className="relative h-44 bg-gray-100 flex-shrink-0">
              <img src={slide.imageSrc} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format"; }} />
              <div className="absolute top-2 left-2">
                <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Slide {idx + 1}</span>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 bg-black/60 rounded-lg p-0.5 backdrop-blur-sm">
                <button
                  onClick={() => moveSlideUp(idx)}
                  disabled={idx === 0}
                  className="p-1 text-white hover:text-gray-300 disabled:opacity-30 disabled:hover:text-white transition flex items-center justify-center"
                  title="Move Up"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <button
                  onClick={() => moveSlideDown(idx)}
                  disabled={idx === slides.length - 1}
                  className="p-1 text-white hover:text-gray-300 disabled:opacity-30 disabled:hover:text-white transition flex items-center justify-center"
                  title="Move Down"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>
            </div>

            {editingId === slide.id ? (
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Image URL</label>
                  <input value={editData.imageSrc} onChange={e => setEditData(d => ({...d, imageSrc: e.target.value}))} className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Title (HTML ok)</label>
                  <input value={editData.title} onChange={e => setEditData(d => ({...d, title: e.target.value}))} className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Subtitle</label>
                  <input value={editData.subtitle} onChange={e => setEditData(d => ({...d, subtitle: e.target.value}))} className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div className="flex gap-2 mt-auto pt-2">
                  <button onClick={handleSaveEdit} disabled={isPending} className="flex-1 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50">Save Changes</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-2 text-gray-500 hover:text-gray-700 text-xs font-medium transition">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex flex-col flex-1">
                <p className="font-semibold text-gray-900 text-sm leading-snug" dangerouslySetInnerHTML={{ __html: slide.title }} />
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{slide.subtitle}</p>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                  <button onClick={() => handleEdit(slide)} className="flex-1 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Edit</button>
                  <button onClick={() => handleDelete(slide.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition border border-red-100 disabled:opacity-50">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Slide Card */}
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col">
          <p className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </span>
            Add New Slide
          </p>
          <form action={async (formData: FormData) => {
            await addCarouselItem(formData);
            const db = await getDbData();
            setSlides(db.carouselItems);
          }} className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Image URL *</label>
              <input name="imageSrc" required placeholder="https://images.unsplash.com/..." className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Title (HTML ok) *</label>
              <input name="title" required placeholder="Bespoke Finishes.<br/>Custom text." className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Subtitle *</label>
              <input name="subtitle" required placeholder="Venetian Plaster · Micro Cement" className="px-2.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <button type="submit" className="mt-auto py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition">
              Add Slide
            </button>
          </form>
        </div>
      </div>

      {slides.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-xs text-amber-700">
          No slides yet — add your first hero slide above to populate the homepage carousel.
        </div>
      )}
    </div>
  );
}
