"use client";

import { useEffect, useState, useRef, useTransition, useCallback } from "react";
import { getProjects, saveProjects, ProjectData } from "@/actions/projects";
import { getFinishes, saveFinishes, FinishData } from "@/actions/finishes";

type UploadSection = "thumbnail" | "gallery";

// ─── upload helper ──────────────────────────────────────────────────────────
async function uploadFiles(
  files: FileList | File[],
  folder: string
): Promise<string[]> {
  const formData = new FormData();
  formData.append("folder", folder);
  Array.from(files).forEach((f) => formData.append("files", f));
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.paths || [];
}

// ─── Drop Zone ──────────────────────────────────────────────────────────────
function DropZone({
  onUpload,
  label,
  multiple = true,
  folder,
  className = "",
  disabled = false,
}: {
  onUpload: (paths: string[]) => void;
  label: string;
  multiple?: boolean;
  folder: string;
  className?: string;
  disabled?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      setProgress(`Uploading ${files.length} file${files.length > 1 ? "s" : ""}…`);
      try {
        const paths = await uploadFiles(files, folder);
        setProgress(`✓ ${paths.length} file${paths.length > 1 ? "s" : ""} uploaded`);
        onUpload(paths);
        setTimeout(() => setProgress(""), 3000);
      } catch {
        setProgress("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [folder, onUpload]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 p-6 cursor-pointer text-center ${
        dragging
          ? "border-gray-900 bg-gray-50"
          : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
      } ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-xs text-gray-500">{progress}</p>
        </div>
      ) : (
        <>
          <svg className="text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p className="text-xs font-semibold text-gray-600">{label}</p>
          <p className="text-[10px] text-gray-400">Drop files here or click to browse</p>
          {progress && <p className="text-[10px] text-emerald-600 font-semibold">{progress}</p>}
        </>
      )}
    </div>
  );
}

// ─── Image Preview Grid ──────────────────────────────────────────────────────
function ImageGrid({
  images,
  onRemove,
  emptyLabel = "No images yet",
}: {
  images: string[];
  onRemove: (idx: number) => void;
  emptyLabel?: string;
}) {
  if (images.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
        <p className="text-xs text-gray-400">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
      {images.map((src, idx) => (
        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img src={src} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => onRemove(idx)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminPortfolioPage() {
  const [activeTab, setActiveTab] = useState<"projects" | "finishes">("projects");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [finishes, setFinishes] = useState<FinishData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([getProjects(), getFinishes()]).then(([p, f]) => {
      setProjects(p);
      setFinishes(f);
      setLoading(false);
    });
  }, []);

  // ── Project helpers ─────────────────────────────────────────────────────
  // ── Project helpers ─────────────────────────────────────────────────────
  const persistProjects = async (updated: ProjectData[]) => {
    setProjects(updated);
    await saveProjects(updated);
  };

  const addProject = () => {
    const newItem: ProjectData = { id: Date.now().toString(), title: "New Project", image: "", aspect: "3/4", showOnHome: false, galleryImages: [] };
    const updated = [newItem, ...projects];
    persistProjects(updated);
    setExpandedId(newItem.id);
  };

  const removeProject = (id: string) => persistProjects(projects.filter(p => p.id !== id));

  const updateProject = <K extends keyof ProjectData>(id: string, field: K, value: ProjectData[K]) => {
    const updated = projects.map(p => p.id === id ? { ...p, [field]: value } : p);
    setProjects(updated);
    return updated;
  };

  const saveProject = (id: string) => persistProjects(projects);

  const handleProjectThumbnailUpload = (id: string, paths: string[]) => {
    if (paths[0]) {
      const updated = projects.map(p => p.id === id ? { ...p, image: paths[0] } : p);
      persistProjects(updated);
    }
  };

  const handleProjectGalleryUpload = (id: string, paths: string[]) => {
    const updated = projects.map(p =>
      p.id === id ? { ...p, galleryImages: [...(p.galleryImages || []), ...paths] } : p
    );
    persistProjects(updated);
  };

  const removeProjectGalleryImage = (id: string, idx: number) => {
    const updated = projects.map(p =>
      p.id === id ? { ...p, galleryImages: p.galleryImages?.filter((_, i) => i !== idx) } : p
    );
    persistProjects(updated);
  };

  // ── Finish helpers ─────────────────────────────────────────────────────
  // ── Finish helpers ─────────────────────────────────────────────────────
  const persistFinishes = async (updated: FinishData[]) => {
    setFinishes(updated);
    await saveFinishes(updated);
  };

  const addFinish = () => {
    const newItem: FinishData = { id: `f${Date.now()}`, name: "New Finish", image: "", showOnHome: false, galleryImages: [], description: "" };
    const updated = [newItem, ...finishes];
    persistFinishes(updated);
    setExpandedId(newItem.id);
  };

  const removeFinish = (id: string) => persistFinishes(finishes.filter(f => f.id !== id));

  const updateFinish = <K extends keyof FinishData>(id: string, field: K, value: FinishData[K]) => {
    const updated = finishes.map(f => f.id === id ? { ...f, [field]: value } : f);
    setFinishes(updated);
    return updated;
  };

  const saveFinish = (id: string) => persistFinishes(finishes);

  const handleFinishThumbnailUpload = (id: string, paths: string[]) => {
    if (paths[0]) {
      const updated = finishes.map(f => f.id === id ? { ...f, image: paths[0] } : f);
      persistFinishes(updated);
    }
  };

  const handleFinishGalleryUpload = (id: string, paths: string[]) => {
    const updated = finishes.map(f =>
      f.id === id ? { ...f, galleryImages: [...(f.galleryImages || []), ...paths] } : f
    );
    persistFinishes(updated);
  };

  const removeFinishGalleryImage = (id: string, idx: number) => {
    const updated = finishes.map(f =>
      f.id === id ? { ...f, galleryImages: f.galleryImages?.filter((_, i) => i !== idx) } : f
    );
    persistFinishes(updated);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload thumbnails and gallery images for projects and finishes. Images are stored locally.
          </p>
        </div>
        <button
          onClick={activeTab === "projects" ? addProject : addFinish}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add {activeTab === "projects" ? "Project" : "Finish"}
        </button>
      </div>

      {/* Upload hint banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <svg className="text-blue-500 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p className="text-xs text-blue-700">
          <strong>Bulk Upload:</strong> Click any card to expand it. Drop your thumbnail (1 photo) first, then drop all gallery images at once. Files are saved to <code className="font-mono bg-blue-100 px-1 rounded">public/uploads/</code> automatically.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["projects", "finishes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setExpandedId(null); }}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition capitalize ${activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab}{" "}
            <span className={`ml-1 text-xs ${activeTab === tab ? "text-gray-400" : "text-gray-300"}`}>
              ({tab === "projects" ? projects.length : finishes.length})
            </span>
          </button>
        ))}
      </div>

      {/* ── PROJECTS ── */}
      {activeTab === "projects" && (
        <div className="flex flex-col gap-3">
          {projects.map((project) => {
            const isOpen = expandedId === project.id;
            return (
              <div key={project.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Collapsed header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedId(isOpen ? null : project.id)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {project.image
                      ? <img src={project.image} className="w-full h-full object-cover" alt="" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{project.title || "Untitled Project"}</p>
                    <p className="text-xs text-gray-400">{(project.galleryImages?.length || 0)} gallery image{(project.galleryImages?.length || 0) !== 1 ? "s" : ""} · {project.showOnHome ? "On Homepage" : "Hidden"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={(e) => { e.stopPropagation(); persistProjects(projects.map(p => p.id === project.id ? { ...p, showOnHome: !p.showOnHome } : p)); }}
                      className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${project.showOnHome ? "bg-gray-900" : "bg-gray-200"}`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: project.showOnHome ? "18px" : "2px" }} />
                    </div>
                    <svg className={`transition-transform ${isOpen ? "rotate-180" : ""} text-gray-400`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

                {/* Expanded editor */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5 flex flex-col gap-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Title</label>
                        <input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, "title", e.target.value)}
                          onBlur={() => saveProject(project.id)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aspect Ratio</label>
                        <select
                          value={project.aspect || "3/4"}
                          onChange={(e) => { const u = updateProject(project.id, "aspect", e.target.value); persistProjects(u); }}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="16/9">Landscape 16:9</option>
                          <option value="1/1">Square 1:1</option>
                          <option value="3/4">Portrait 3:4</option>
                          <option value="4/5">Portrait 4:5</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                        <textarea
                          value={project.description || ""}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                          onBlur={() => saveProject(project.id)}
                          rows={3}
                          placeholder="Describe this project..."
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        />
                      </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-[10px]">1</span>
                        Cover / Thumbnail Image
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <DropZone
                          label="Drop thumbnail here (1 image)"
                          multiple={false}
                          folder={`projects/${project.id}`}
                          onUpload={(paths) => handleProjectThumbnailUpload(project.id, paths)}
                          className="h-28"
                        />
                        {project.image && (
                          <div className="relative h-28 rounded-xl overflow-hidden bg-gray-100">
                            <img src={project.image} className="w-full h-full object-cover" alt="Thumbnail" />
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold">Current</div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Or paste a URL directly:</p>
                      <input
                        value={project.image}
                        onChange={(e) => updateProject(project.id, "image", e.target.value)}
                        onBlur={() => saveProject(project.id)}
                        placeholder="https://... or /uploads/projects/{id}/photo.jpg"
                        className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Gallery Upload */}
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-[10px]">2</span>
                        Gallery Images (Bulk Upload)
                      </label>
                      <DropZone
                        label="Drop all gallery images here (select multiple at once)"
                        multiple={true}
                        folder={`projects/${project.id}`}
                        onUpload={(paths) => handleProjectGalleryUpload(project.id, paths)}
                        className="h-24"
                      />
                      <ImageGrid
                        images={project.galleryImages || []}
                        onRemove={(idx) => removeProjectGalleryImage(project.id, idx)}
                        emptyLabel="No gallery images yet — upload above"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button
                        onClick={() => removeProject(project.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition border border-red-100"
                      >
                        Delete Project
                      </button>
                      <button
                        onClick={() => { saveProject(project.id); setExpandedId(null); }}
                        className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition"
                      >
                        Save & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-400 text-sm">
              No projects yet. Click "Add Project" to create your first one.
            </div>
          )}
        </div>
      )}

      {/* ── FINISHES ── */}
      {activeTab === "finishes" && (
        <div className="flex flex-col gap-3">
          {finishes.map((finish) => {
            const isOpen = expandedId === finish.id;
            return (
              <div key={finish.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Collapsed header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedId(isOpen ? null : finish.id)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {finish.image
                      ? <img src={finish.image} className="w-full h-full object-cover" alt="" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                        </div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{finish.name || "Untitled Finish"}</p>
                    <p className="text-xs text-gray-400">{(finish.galleryImages?.length || 0)} gallery image{(finish.galleryImages?.length || 0) !== 1 ? "s" : ""} · {finish.showOnHome ? "On Homepage" : "Hidden"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={(e) => { e.stopPropagation(); persistFinishes(finishes.map(f => f.id === finish.id ? { ...f, showOnHome: !f.showOnHome } : f)); }}
                      className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${finish.showOnHome ? "bg-gray-900" : "bg-gray-200"}`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: finish.showOnHome ? "18px" : "2px" }} />
                    </div>
                    <svg className={`transition-transform ${isOpen ? "rotate-180" : ""} text-gray-400`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

                {/* Expanded editor */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5 flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Finish Name</label>
                        <input
                          value={finish.name}
                          onChange={(e) => updateFinish(finish.id, "name", e.target.value)}
                          onBlur={() => saveFinish(finish.id)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description (shown on finish detail page)</label>
                        <textarea
                          value={finish.description || ""}
                          onChange={(e) => updateFinish(finish.id, "description", e.target.value)}
                          onBlur={() => saveFinish(finish.id)}
                          rows={3}
                          placeholder="Describe this finish technique..."
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        />
                      </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-[10px]">1</span>
                        Cover / Thumbnail Image
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <DropZone
                          label="Drop thumbnail here (1 image)"
                          multiple={false}
                          folder={`finishes/${finish.id}`}
                          onUpload={(paths) => handleFinishThumbnailUpload(finish.id, paths)}
                          className="h-28"
                        />
                        {finish.image && (
                          <div className="relative h-28 rounded-xl overflow-hidden bg-gray-100">
                            <img src={finish.image} className="w-full h-full object-cover" alt="Thumbnail preview" />
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold">Current</div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Or paste an image URL directly:</p>
                      <input
                        value={finish.image}
                        onChange={(e) => updateFinish(finish.id, "image", e.target.value)}
                        onBlur={() => saveFinish(finish.id)}
                        placeholder="https://... or /uploads/finishes/{id}/photo.jpg"
                        className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    {/* Gallery Upload */}
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-[10px]">2</span>
                        Gallery Images (Bulk Upload)
                      </label>
                      <DropZone
                        label="Drop all gallery images here — select multiple at once from your PC"
                        multiple={true}
                        folder={`finishes/${finish.id}`}
                        onUpload={(paths) => handleFinishGalleryUpload(finish.id, paths)}
                        className="h-24"
                      />
                      <ImageGrid
                        images={finish.galleryImages || []}
                        onRemove={(idx) => removeFinishGalleryImage(finish.id, idx)}
                        emptyLabel="No gallery images yet — upload above to populate the finish detail page"
                      />
                    </div>

                    {/* Footer link preview */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <p className="text-xs text-gray-600">Public page:</p>
                      <a
                        href={`/materials/${finish.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 font-mono hover:text-gray-900 transition flex items-center gap-1"
                      >
                        /materials/{finish.id}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button
                        onClick={() => removeFinish(finish.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition border border-red-100"
                      >
                        Delete Finish
                      </button>
                      <button
                        onClick={() => { saveFinish(finish.id); setExpandedId(null); }}
                        className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition"
                      >
                        Save & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {finishes.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-400 text-sm">
              No finishes yet. Click "Add Finish" to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
