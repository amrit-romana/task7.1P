"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getFaqs,
  saveFaq,
  saveFaqsOrder,
  deleteFaq,
  FaqData,
} from "@/actions/faqs";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await getFaqs();
    setFaqs(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    const result = await saveFaq({ question: "New Question", answer: "" });
    if (result.success) {
      await load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await deleteFaq(id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleSave = async (faq: FaqData) => {
    await saveFaq(faq);
  };

  const updateField = <K extends keyof FaqData>(id: string, field: K, value: FaqData[K]) => {
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, [field]: value } : f));
  };

  const persist = async (updated: FaqData[]) => {
    setFaqs(updated);
    await saveFaqsOrder(updated);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...faqs];
    [updated[idx], updated[idx - 1]] = [updated[idx - 1], updated[idx]];
    persist(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === faqs.length - 1) return;
    const updated = [...faqs];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    persist(updated);
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
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage frequently asked questions shown on the homepage.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add FAQ
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = expandedId === faq.id;
          return (
            <div key={faq.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(isOpen ? null : faq.id)}
              >
                {/* Number badge */}
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {faq.question || <span className="text-gray-400 italic">Untitled question</span>}
                  </p>
                  {faq.answer && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{faq.answer}</p>
                  )}
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  <button onClick={() => moveDown(index)} disabled={index === faqs.length - 1} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  <button onClick={() => setExpandedId(isOpen ? null : faq.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition">
                    <svg className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                </div>
              </div>

              {/* Expanded editor */}
              {isOpen && (
                <div className="border-t border-gray-100 p-5 flex flex-col gap-4 bg-[#FCFCFA]">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Question</label>
                    <input
                      value={faq.question}
                      onChange={(e) => updateField(faq.id, "question", e.target.value)}
                      onBlur={() => handleSave(faq)}
                      placeholder="e.g. What areas do you service?"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateField(faq.id, "answer", e.target.value)}
                      onBlur={() => handleSave(faq)}
                      rows={4}
                      placeholder="Write a clear, helpful answer..."
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none bg-white leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => { handleSave(faq); setExpandedId(null); }}
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

        {faqs.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No FAQs yet</p>
            <p className="text-gray-400 text-xs mt-1">Click "Add FAQ" to create your first question.</p>
          </div>
        )}
      </div>

      {/* Preview note */}
      {faqs.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-xs text-blue-700">
            FAQs appear as an interactive accordion on the homepage above the Enquire button. Changes are live immediately after saving.
          </p>
        </div>
      )}
    </div>
  );
}
