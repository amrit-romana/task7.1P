"use client";

import { useEffect, useState, useRef, useCallback, useTransition } from "react";
import {
  getCourses,
  saveCourse,
  saveCourses,
  deleteCourse,
  CourseData,
} from "@/actions/courses";

// ─── Upload helper ──────────────────────────────────────────────────────────
async function uploadFiles(files: FileList | File[], folder: string): Promise<string[]> {
  const formData = new FormData();
  formData.append("folder", folder);
  Array.from(files).forEach((f) => formData.append("files", f));
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.paths || [];
}

function DropZone({ onUpload, folder, className = "" }: {
  onUpload: (paths: string[]) => void;
  folder: string;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setProgress("Uploading…");
    try {
      const paths = await uploadFiles(files, folder);
      setProgress("✓ Uploaded");
      onUpload(paths);
      setTimeout(() => setProgress(""), 3000);
    } catch {
      setProgress("Upload failed.");
    } finally {
      setUploading(false);
    }
  }, [folder, onUpload]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-2 p-4 cursor-pointer text-center ${dragging ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"} ${className}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      {uploading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      ) : (
        <>
          <svg className="text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p className="text-[10px] text-gray-500">Drop or click</p>
          {progress && <p className="text-[10px] text-emerald-600 font-semibold">{progress}</p>}
        </>
      )}
    </div>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    const data = await getCourses();
    setCourses(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const persist = async (updated: CourseData[]) => {
    setCourses(updated);
    await saveCourses(updated);
  };

  const handleAdd = async () => {
    const result = await saveCourse({
      title: "New Course",
      price: "TBC",
      duration: "1 Day",
      location: "Unit 5 / 314 Governor Road, Braeside 3195",
      date: "TBC",
      image: "",
      description: "",
      inclusions: ["Certificate of completion"],
      enquirySubject: "Course Enquiry",
    });
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = async (course: CourseData) => {
    await saveCourse(course);
    await load();
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...courses];
    [updated[idx], updated[idx - 1]] = [updated[idx - 1], updated[idx]];
    persist(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === courses.length - 1) return;
    const updated = [...courses];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    persist(updated);
  };

  const updateField = <K extends keyof CourseData>(id: string, field: K, value: CourseData[K]) => {
    setCourses((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateInclusion = (courseId: string, idx: number, value: string) => {
    setCourses((prev) => prev.map((c) => {
      if (c.id !== courseId) return c;
      const inclusions = [...(c.inclusions || [])];
      inclusions[idx] = value;
      return { ...c, inclusions };
    }));
  };

  const addInclusion = (courseId: string) => {
    setCourses((prev) => prev.map((c) => c.id === courseId ? { ...c, inclusions: [...(c.inclusions || []), ""] } : c));
  };

  const removeInclusion = (courseId: string, idx: number) => {
    setCourses((prev) => prev.map((c) => {
      if (c.id !== courseId) return c;
      const inclusions = (c.inclusions || []).filter((_, i) => i !== idx);
      return { ...c, inclusions };
    }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage training courses shown on the Courses page.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Course
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {courses.map((course, index) => {
          const isOpen = expandedId === course.id;
          return (
            <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(isOpen ? null : course.id)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {course.image
                    ? <img src={course.image} className="w-full h-full object-cover" alt="" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-400">{course.price} · {course.duration} · {course.date}</p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                  </button>
                  <button onClick={() => moveDown(index)} disabled={index === courses.length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <button onClick={() => setExpandedId(isOpen ? null : course.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition">
                    <svg className={`transition-transform ${isOpen ? "rotate-180" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-gray-100 p-5 flex flex-col gap-5 bg-[#FCFCFA]">
                  {/* Core fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Title</label>
                      <input value={course.title} onChange={(e) => updateField(course.id, "title", e.target.value)} onBlur={() => handleSave(course)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price</label>
                      <input value={course.price} onChange={(e) => updateField(course.id, "price", e.target.value)} onBlur={() => handleSave(course)} placeholder="e.g. $750.00 or TBC" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</label>
                      <input value={course.duration} onChange={(e) => updateField(course.id, "duration", e.target.value)} onBlur={() => handleSave(course)} placeholder="e.g. 1 Day" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Next Date</label>
                      <input value={course.date} onChange={(e) => updateField(course.id, "date", e.target.value)} onBlur={() => handleSave(course)} placeholder="e.g. 15 July 2026 or TBC" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                      <input value={course.location} onChange={(e) => updateField(course.id, "location", e.target.value)} onBlur={() => handleSave(course)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enquiry Subject</label>
                      <input value={course.enquirySubject} onChange={(e) => updateField(course.id, "enquirySubject", e.target.value)} onBlur={() => handleSave(course)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                      <textarea value={course.description} onChange={(e) => updateField(course.id, "description", e.target.value)} onBlur={() => handleSave(course)} rows={3} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
                    </div>
                  </div>

                  {/* Inclusions editor */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Inclusions</label>
                      <button onClick={() => addInclusion(course.id)} className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50 transition">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add item
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {(course.inclusions || []).map((inc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm">•</span>
                          <input
                            value={inc}
                            onChange={(e) => updateInclusion(course.id, i, e.target.value)}
                            onBlur={() => handleSave(course)}
                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <button onClick={() => { removeInclusion(course.id, i); }} className="text-gray-300 hover:text-red-500 transition">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image upload */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Image</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DropZone
                        folder={`courses/${course.id}`}
                        onUpload={(paths) => {
                          if (paths[0]) {
                            updateField(course.id, "image", paths[0]);
                            handleSave({ ...course, image: paths[0] });
                          }
                        }}
                        className="h-24"
                      />
                      {course.image && (
                        <div className="relative h-24 rounded-xl overflow-hidden bg-gray-100">
                          <img src={course.image} className="w-full h-full object-cover" alt="" />
                        </div>
                      )}
                    </div>
                    <input
                      value={course.image}
                      onChange={(e) => updateField(course.id, "image", e.target.value)}
                      onBlur={() => handleSave(course)}
                      placeholder="https://... or paste URL"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button onClick={() => handleDelete(course.id)} className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition">
                      Delete Course
                    </button>
                    <button onClick={() => { handleSave(course); setExpandedId(null); }} className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition">
                      Save & Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {courses.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-400 text-sm">
            No courses yet. Click "Add Course" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
