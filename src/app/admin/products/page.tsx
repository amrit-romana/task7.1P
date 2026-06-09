"use client";

import { useEffect, useState, useRef, useCallback, useTransition } from "react";
import {
  getProducts,
  saveProduct,
  saveProducts,
  deleteProduct,
  ProductData,
} from "@/actions/products";

// ─── Upload helper ──────────────────────────────────────────────────────────
async function uploadFiles(files: FileList | File[], folder: string): Promise<string[]> {
  const formData = new FormData();
  formData.append("folder", folder);
  Array.from(files).forEach((f) => formData.append("files", f));
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.paths || [];
}

// ─── Drop Zone ──────────────────────────────────────────────────────────────
function DropZone({ onUpload, folder, className = "", disabled = false }: {
  onUpload: (paths: string[]) => void;
  folder: string;
  className?: string;
  disabled?: boolean;
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
      className={`relative border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-2 p-4 cursor-pointer text-center ${dragging ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
    >
      <input ref={inputRef} type="file" accept="image/*" multiple={false} className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      {uploading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      ) : (
        <>
          <svg className="text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p className="text-[10px] text-gray-500">Drop image or click</p>
          {progress && <p className="text-[10px] text-emerald-600 font-semibold">{progress}</p>}
        </>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const persist = async (updated: ProductData[]) => {
    setProducts(updated);
    await saveProducts(updated);
  };

  const handleAdd = async () => {
    const result = await saveProduct({ name: "New Product", url: "https://", image: "" });
    await load();
    // Expand the newly created product
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = async (product: ProductData) => {
    await saveProduct(product);
    await load();
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...products];
    [updated[idx], updated[idx - 1]] = [updated[idx - 1], updated[idx]];
    persist(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === products.length - 1) return;
    const updated = [...products];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    persist(updated);
  };

  const updateField = (id: string, field: keyof ProductData, value: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product categories shown on the Products page.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((product, index) => {
          const isOpen = expandedId === product.id;
          return (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(isOpen ? null : product.id)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {product.image
                    ? <img src={product.image} className="w-full h-full object-cover" alt="" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{product.name || "Untitled Product"}</p>
                  <p className="text-xs text-gray-400 truncate">{product.url || "No URL set"}</p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                  </button>
                  <button onClick={() => moveDown(index)} disabled={index === products.length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <button onClick={() => setExpandedId(isOpen ? null : product.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition">
                    <svg className={`transition-transform ${isOpen ? "rotate-180" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-gray-100 p-5 flex flex-col gap-5 bg-[#FCFCFA]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</label>
                      <input
                        value={product.name}
                        onChange={(e) => updateField(product.id, "name", e.target.value)}
                        onBlur={() => handleSave(product)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">External URL</label>
                      <input
                        value={product.url}
                        onChange={(e) => updateField(product.id, "url", e.target.value)}
                        onBlur={() => handleSave(product)}
                        placeholder="https://..."
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Image</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DropZone
                        folder={`products/${product.id}`}
                        onUpload={(paths) => {
                          if (paths[0]) {
                            updateField(product.id, "image", paths[0]);
                            handleSave({ ...product, image: paths[0] });
                          }
                        }}
                        className="h-24"
                      />
                      {product.image && (
                        <div className="relative h-24 rounded-xl overflow-hidden bg-gray-100">
                          <img src={product.image} className="w-full h-full object-cover" alt="" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">Or paste image URL:</p>
                    <input
                      value={product.image}
                      onChange={(e) => updateField(product.id, "image", e.target.value)}
                      onBlur={() => handleSave(product)}
                      placeholder="https://..."
                      className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition"
                    >
                      Delete Product
                    </button>
                    <button
                      onClick={() => { handleSave(product); setExpandedId(null); }}
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

        {products.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-400 text-sm">
            No products yet. Click "Add Product" to get started.
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-start gap-3">
        <svg className="text-blue-500 flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-xs text-blue-700">
          Products link to external URLs (e.g. LustreFX shop). Use the URL field to set where each product card links to.
        </p>
      </div>
    </div>
  );
}
