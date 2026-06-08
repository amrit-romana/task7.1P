"use client";

import { useEffect, useState, useRef, useTransition, useCallback } from "react";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  BlogPost,
} from "@/actions/blog";

// ─── Upload Helper ──────────────────────────────────────────────────────────
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

// ─── Drop Zone Component ────────────────────────────────────────────────────
function DropZone({
  onUpload,
  label,
  multiple = false,
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
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
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
          <svg
            className="text-gray-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-xs font-semibold text-gray-600">{label}</p>
          <p className="text-[10px] text-gray-400">Drop file here or click to browse</p>
          {progress && <p className="text-[10px] text-emerald-600 font-semibold">{progress}</p>}
        </>
      )}
    </div>
  );
}

// ─── Main Admin Blog Page ───────────────────────────────────────────────────
export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load posts on mount
  const loadPosts = useCallback(async () => {
    const data = await getBlogPosts(false); // get published + drafts
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Create auto slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Add new blank blog post
  const handleAddNewPost = async () => {
    const defaultTitle = "Untitled Post";
    const defaultSlug = `untitled-post-${Date.now()}`;
    const newPostData = {
      title: defaultTitle,
      slug: defaultSlug,
      excerpt: "Enter a brief summary of your blog post...",
      content: "Start writing your article content here...",
      coverImage: "",
      published: false,
    };

    const result = await createBlogPost(newPostData);
    if (result.success && result.id) {
      await loadPosts();
      setExpandedId(result.id);
    } else {
      alert("Failed to create blog post: " + (result.error || "unknown error"));
    }
  };

  // Handle local state edit changes
  const handleFieldChange = (id: string, field: keyof BlogPost, value: any) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          // Auto-generate slug if title changes and user hasn't customized slug
          if (field === "title") {
            const defaultOldSlug = generateSlug(p.title);
            if (!p.slug || p.slug === defaultOldSlug || p.slug.startsWith("untitled-post")) {
              updated.slug = generateSlug(value);
            }
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Save changes via Server Action
  const handleSavePost = async (post: BlogPost) => {
    startTransition(async () => {
      const result = await updateBlogPost(post.id, {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        published: post.published,
      });

      if (!result.success) {
        alert("Failed to save post: " + (result.error || "unknown error"));
      } else {
        await loadPosts();
      }
    });
  };

  // Delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const result = await deleteBlogPost(id);
    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (expandedId === id) setExpandedId(null);
    } else {
      alert("Failed to delete post.");
    }
  };

  // Thumbnail upload handler
  const handleThumbnailUpload = (id: string, paths: string[]) => {
    if (paths[0]) {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, coverImage: paths[0] } : p))
      );
      // Automatically save the cover image update
      const updatedPost = posts.find((p) => p.id === id);
      if (updatedPost) {
        handleSavePost({ ...updatedPost, coverImage: paths[0] });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Write, edit, and publish SEO-optimized blog posts/journal articles.
          </p>
        </div>
        <button
          onClick={handleAddNewPost}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Post
        </button>
      </div>

      {/* Main List */}
      <div className="flex flex-col gap-3">
        {posts.map((post) => {
          const isOpen = expandedId === post.id;
          return (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Header block (collapsed view) */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(isOpen ? null : post.id)}
              >
                {/* Image thumb */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                  {post.coverImage ? (
                    <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {post.title || "Untitled Post"}
                    </p>
                    {post.published ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Published
                      </span>
                    ) : (
                      <span className="bg-gray-50 text-gray-500 border border-gray-150 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    /{post.slug || "no-slug"} ·{" "}
                    {post.publishedAt
                      ? `Published on ${new Date(post.publishedAt).toLocaleDateString("en-AU")}`
                      : "Not published"}
                  </p>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  {/* Publish Quick Toggle */}
                  <button
                    onClick={async () => {
                      const nextPublished = !post.published;
                      handleFieldChange(post.id, "published", nextPublished);
                      await updateBlogPost(post.id, {
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                        coverImage: post.coverImage,
                        published: nextPublished,
                      });
                      await loadPosts();
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      post.published
                        ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        : "bg-gray-900 text-white border-transparent hover:bg-gray-800"
                    }`}
                  >
                    {post.published ? "Revert to Draft" : "Publish"}
                  </button>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : post.id)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900 transition flex items-center justify-center"
                  >
                    <svg
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Editor drawer (expanded) */}
              {isOpen && (
                <div className="border-t border-gray-100 p-5 flex flex-col gap-6 bg-[#FCFCFA]">
                  {/* Title and Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Post Title
                      </label>
                      <input
                        value={post.title}
                        onChange={(e) => handleFieldChange(post.id, "title", e.target.value)}
                        onBlur={() => handleSavePost(post)}
                        placeholder="e.g. Masterclass Venetian Finishes 2026"
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        SEO Slug
                      </label>
                      <input
                        value={post.slug}
                        onChange={(e) => handleFieldChange(post.id, "slug", e.target.value)}
                        onBlur={() => handleSavePost(post)}
                        placeholder="e.g. masterclass-venetian-finishes-2026"
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Excerpt / Summary (SEO Meta Description)
                    </label>
                    <textarea
                      value={post.excerpt || ""}
                      onChange={(e) => handleFieldChange(post.id, "excerpt", e.target.value)}
                      onBlur={() => handleSavePost(post)}
                      rows={2}
                      placeholder="Write a brief, enticing summary for social sharing and search results..."
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none font-light leading-relaxed"
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      Cover Image
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DropZone
                        label="Drop cover image here (1 image)"
                        multiple={false}
                        folder={`blog/${post.id}`}
                        onUpload={(paths) => handleThumbnailUpload(post.id, paths)}
                        className="h-28"
                      />
                      {post.coverImage ? (
                        <div className="relative h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                          <button
                            onClick={() => {
                              handleFieldChange(post.id, "coverImage", "");
                              const updatedPost = posts.find((p) => p.id === post.id);
                              if (updatedPost) {
                                handleSavePost({ ...updatedPost, coverImage: "" });
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-200 rounded-xl flex items-center justify-center p-6 bg-gray-50 text-xs text-gray-400 font-light">
                          No cover image uploaded yet.
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">Or paste custom image URL:</p>
                    <input
                      value={post.coverImage}
                      onChange={(e) => handleFieldChange(post.id, "coverImage", e.target.value)}
                      onBlur={() => handleSavePost(post)}
                      placeholder="https://example.com/image.jpg"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Article Content (supports Markdown / formatting by spacing)
                    </label>
                    <textarea
                      value={post.content || ""}
                      onChange={(e) => handleFieldChange(post.id, "content", e.target.value)}
                      onBlur={() => handleSavePost(post)}
                      rows={14}
                      placeholder="Write the full post contents here..."
                      className="px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 font-light leading-relaxed font-mono text-xs"
                    />
                  </div>

                  {/* Live link preview */}
                  {post.published && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <p className="text-xs text-gray-600">Public article URL:</p>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 font-mono hover:text-gray-900 transition flex items-center gap-1"
                      >
                        /blog/{post.slug}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>
                  )}

                  {/* Actions footer inside editor */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition border border-red-100"
                    >
                      Delete Post
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={async () => {
                          const nextPublished = !post.published;
                          handleFieldChange(post.id, "published", nextPublished);
                          await updateBlogPost(post.id, {
                            title: post.title,
                            slug: post.slug,
                            excerpt: post.excerpt,
                            content: post.content,
                            coverImage: post.coverImage,
                            published: nextPublished,
                          });
                          await loadPosts();
                          setExpandedId(null);
                        }}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                          post.published
                            ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            : "bg-emerald-600 text-white border-transparent hover:bg-emerald-700"
                        }`}
                      >
                        {post.published ? "Unpublish & Close" : "Publish & Close"}
                      </button>
                      <button
                        onClick={async () => {
                          await handleSavePost(post);
                          setExpandedId(null);
                        }}
                        className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition"
                      >
                        Save & Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-400 text-sm">
            No blog posts written yet. Click "Add New Post" to generate your first article.
          </div>
        )}
      </div>
    </div>
  );
}
