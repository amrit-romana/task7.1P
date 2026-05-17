"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export interface FinishData {
  id: string;
  name: string;
  image: string;
  showOnHome: boolean;
  description?: string;
  galleryImages?: string[];
}

// ── Read ───────────────────────────────────────────────────────────────────

export async function getFinishes(): Promise<FinishData[]> {
  try {
    const rows = await sql`
      SELECT
        id,
        name,
        image,
        show_on_home   AS "showOnHome",
        description,
        gallery_images AS "galleryImages"
      FROM finishes
      ORDER BY sort_order
    `;
    return rows as FinishData[];
  } catch (error) {
    console.error("getFinishes failed:", error);
    return [];
  }
}

export async function getFinishById(id: string): Promise<FinishData | null> {
  try {
    const rows = await sql`
      SELECT
        id,
        name,
        image,
        show_on_home   AS "showOnHome",
        description,
        gallery_images AS "galleryImages"
      FROM finishes
      WHERE id = ${id}
    `;
    return (rows[0] as FinishData) ?? null;
  } catch {
    return null;
  }
}

// ── Save (create or update) ────────────────────────────────────────────────

export async function saveFinish(finish: Partial<FinishData>): Promise<{ success: boolean; error?: string }> {
  try {
    if (finish.id) {
      // Check if it already exists
      const existing = await sql`SELECT id FROM finishes WHERE id = ${finish.id}`;
      if (existing.length > 0) {
        await sql`
          UPDATE finishes SET
            name           = ${finish.name          ?? ""},
            image          = ${finish.image         ?? ""},
            show_on_home   = ${finish.showOnHome    ?? false},
            description    = ${finish.description   ?? ""},
            gallery_images = ${JSON.stringify(finish.galleryImages ?? [])}::jsonb
          WHERE id = ${finish.id}
        `;
      } else {
        const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM finishes`;
        const sortOrder = (maxOrder[0].m as number) + 1;
        await sql`
          INSERT INTO finishes (id, name, image, show_on_home, description, gallery_images, sort_order)
          VALUES (
            ${finish.id},
            ${finish.name         ?? ""},
            ${finish.image        ?? ""},
            ${finish.showOnHome   ?? false},
            ${finish.description  ?? ""},
            ${JSON.stringify(finish.galleryImages ?? [])}::jsonb,
            ${sortOrder}
          )
        `;
      }
    } else {
      const id = Date.now().toString();
      const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM finishes`;
      const sortOrder = (maxOrder[0].m as number) + 1;
      await sql`
        INSERT INTO finishes (id, name, image, show_on_home, description, gallery_images, sort_order)
        VALUES (
          ${id},
          ${finish.name        ?? ""},
          ${finish.image       ?? ""},
          ${finish.showOnHome  ?? false},
          ${finish.description ?? ""},
          ${JSON.stringify(finish.galleryImages ?? [])}::jsonb,
          ${sortOrder}
        )
      `;
    }
    revalidatePath("/materials");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("saveFinish failed:", error);
    return { success: false, error: error.message };
  }
}

// ── Bulk save (used by the admin panel for batch updates / reordering) ─────

export async function saveFinishes(finishes: FinishData[]): Promise<void> {
  for (const [i, f] of finishes.entries()) {
    await sql`
      UPDATE finishes SET
        name           = ${f.name},
        image          = ${f.image},
        show_on_home   = ${f.showOnHome},
        description    = ${f.description   ?? ""},
        gallery_images = ${JSON.stringify(f.galleryImages ?? [])}::jsonb,
        sort_order     = ${i}
      WHERE id = ${f.id}
    `;
  }
  revalidatePath("/materials");
  revalidatePath("/");
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteFinish(id: string): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM finishes WHERE id = ${id}`;
    revalidatePath("/materials");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}
