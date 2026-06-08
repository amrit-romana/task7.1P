"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Read ───────────────────────────────────────────────────────────────────

export async function getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
  try {
    const rows = publishedOnly
      ? await sql`SELECT id, slug, title, excerpt, content, cover_image AS "coverImage", published, published_at AS "publishedAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM blog_posts WHERE published = true ORDER BY published_at DESC NULLS LAST`
      : await sql`SELECT id, slug, title, excerpt, content, cover_image AS "coverImage", published, published_at AS "publishedAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM blog_posts ORDER BY created_at DESC`;
    return rows as BlogPost[];
  } catch (error) {
    console.error("getBlogPosts failed:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const rows = await sql`SELECT id, slug, title, excerpt, content, cover_image AS "coverImage", published, published_at AS "publishedAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM blog_posts WHERE slug = ${slug}`;
    return (rows[0] as BlogPost) ?? null;
  } catch {
    return null;
  }
}

// ── Create ────────────────────────────────────────────────────────────────

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const publishedAt = data.published ? now : null;

    await sql`
      INSERT INTO blog_posts (id, slug, title, excerpt, content, cover_image, published, published_at, created_at, updated_at)
      VALUES (
        ${id},
        ${data.slug},
        ${data.title},
        ${data.excerpt},
        ${data.content},
        ${data.coverImage},
        ${data.published},
        ${publishedAt},
        ${now},
        ${now}
      )
    `;

    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true, id };
  } catch (error: any) {
    console.error("createBlogPost failed:", error);
    return { success: false, error: error.message };
  }
}

// ── Update ────────────────────────────────────────────────────────────────

export async function updateBlogPost(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString();

    // Get current post to check if it was previously unpublished
    const existing = await sql`SELECT published, published_at FROM blog_posts WHERE id = ${id}`;
    const wasPublished = existing[0]?.published;
    const publishedAt = data.published && !wasPublished ? now : (existing[0]?.published_at ?? null);

    await sql`
      UPDATE blog_posts SET
        title        = ${data.title},
        slug         = ${data.slug},
        excerpt      = ${data.excerpt},
        content      = ${data.content},
        cover_image  = ${data.coverImage},
        published    = ${data.published},
        published_at = ${publishedAt},
        updated_at   = ${now}
      WHERE id = ${id}
    `;

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("updateBlogPost failed:", error);
    return { success: false, error: error.message };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────

export async function deleteBlogPost(id: string): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}

// ── Create DB table (run once) ────────────────────────────────────────────

export async function ensureBlogTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id           TEXT PRIMARY KEY,
      slug         TEXT UNIQUE NOT NULL,
      title        TEXT NOT NULL DEFAULT '',
      excerpt      TEXT DEFAULT '',
      content      TEXT DEFAULT '',
      cover_image  TEXT DEFAULT '',
      published    BOOLEAN DEFAULT false,
      published_at TIMESTAMPTZ,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
