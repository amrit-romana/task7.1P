"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export interface ProjectData {
  id: string;
  title: string;
  image: string;
  aspect?: string;
  showOnHome: boolean;
  galleryImages?: string[];
  description?: string;
}

// ── Read ───────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const rows = await sql`
      SELECT
        id,
        title,
        image,
        aspect,
        show_on_home  AS "showOnHome",
        gallery_images AS "galleryImages",
        description
      FROM projects
      ORDER BY sort_order
    `;
    return rows as ProjectData[];
  } catch (error) {
    console.error("getProjects failed:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectData | null> {
  try {
    const rows = await sql`
      SELECT
        id,
        title,
        image,
        aspect,
        show_on_home  AS "showOnHome",
        gallery_images AS "galleryImages",
        description
      FROM projects
      WHERE id = ${id}
    `;
    return (rows[0] as ProjectData) ?? null;
  } catch {
    return null;
  }
}

// ── Save (create or update) ────────────────────────────────────────────────

export async function saveProject(project: Partial<ProjectData>): Promise<{ success: boolean; error?: string }> {
  try {
    if (project.id) {
      // Update existing
      await sql`
        UPDATE projects SET
          title          = ${project.title          ?? "Untitled"},
          image          = ${project.image          ?? ""},
          aspect         = ${project.aspect         ?? "3/4"},
          show_on_home   = ${project.showOnHome     ?? false},
          gallery_images = ${JSON.stringify(project.galleryImages ?? [])}::jsonb,
          description    = ${project.description    ?? ""}
        WHERE id = ${project.id}
      `;
    } else {
      // Insert new
      const id = Date.now().toString();
      const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM projects`;
      const sortOrder = (maxOrder[0].m as number) + 1;

      await sql`
        INSERT INTO projects (id, title, image, aspect, show_on_home, gallery_images, description, sort_order)
        VALUES (
          ${id},
          ${project.title       ?? "Untitled"},
          ${project.image       ?? ""},
          ${project.aspect      ?? "3/4"},
          ${project.showOnHome  ?? false},
          ${JSON.stringify(project.galleryImages ?? [])}::jsonb,
          ${project.description ?? ""},
          ${sortOrder}
        )
      `;
    }
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("saveProject failed:", error);
    return { success: false, error: error.message };
  }
}

// ── Bulk save (used for reordering) ───────────────────────────────────────

export async function saveProjects(projects: ProjectData[]): Promise<void> {
  try {
    const existingRows = await sql`SELECT id FROM projects`;
    const existingIds = existingRows.map((r: any) => r.id);
    const incomingIds = projects.map(p => p.id);

    // Delete missing
    for (const id of existingIds) {
      if (!incomingIds.includes(id)) {
        await sql`DELETE FROM projects WHERE id = ${id}`;
      }
    }

    // Upsert remaining
    for (const [i, p] of projects.entries()) {
      await sql`
        INSERT INTO projects (id, title, image, aspect, show_on_home, gallery_images, description, sort_order)
        VALUES (
          ${p.id},
          ${p.title ?? "Untitled"},
          ${p.image ?? ""},
          ${p.aspect ?? "3/4"},
          ${p.showOnHome ?? false},
          ${JSON.stringify(p.galleryImages ?? [])}::jsonb,
          ${p.description ?? ""},
          ${i}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          image = EXCLUDED.image,
          aspect = EXCLUDED.aspect,
          show_on_home = EXCLUDED.show_on_home,
          gallery_images = EXCLUDED.gallery_images,
          description = EXCLUDED.description,
          sort_order = EXCLUDED.sort_order
      `;
    }

    revalidatePath("/projects");
    revalidatePath("/");
  } catch (error) {
    console.error("saveProjects bulk save failed:", error);
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM projects WHERE id = ${id}`;
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}
