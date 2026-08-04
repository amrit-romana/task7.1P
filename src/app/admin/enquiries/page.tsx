"use client";

import { useEffect, useState, useCallback } from "react";
import { getEnquiries, deleteEnquiry, Enquiry } from "@/actions/enquiries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      setLoadError("Couldn't load enquiries. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
      alert("Couldn't delete this enquiry. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="bg-white border border-red-100 rounded-xl p-12 text-center">
      <p className="text-red-500 text-sm font-medium">{loadError}</p>
      <button
        onClick={load}
        className="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">
            Submissions from the /enquire contact form.
          </p>
        </div>
        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
          {enquiries.length} total
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {enquiries.map((enquiry) => {
          const isOpen = expandedId === enquiry.id;
          return (
            <div key={enquiry.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(isOpen ? null : enquiry.id)}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {enquiry.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{enquiry.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{enquiry.email}</p>
                </div>

                <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                  {formatDate(enquiry.created_at)}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); setExpandedId(isOpen ? null : enquiry.id); }}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition"
                >
                  <svg className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-gray-100 p-5 flex flex-col gap-4 bg-[#FCFCFA]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                      <a href={`mailto:${enquiry.email}`} className="text-gray-900 hover:underline">{enquiry.email}</a>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                      {enquiry.phone ? (
                        <a href={`tel:${enquiry.phone}`} className="text-gray-900 hover:underline">{enquiry.phone}</a>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Received</p>
                      <span className="text-gray-900">{formatDate(enquiry.created_at)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message</p>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap bg-white border border-gray-200 rounded-lg p-3">
                      {enquiry.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition"
                    >
                      Delete
                    </button>
                    <a
                      href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: Your enquiry to Renaissance Decor`)}`}
                      className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition"
                    >
                      Reply by Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {enquiries.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No enquiries yet</p>
            <p className="text-gray-400 text-xs mt-1">Submissions from the /enquire form will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
