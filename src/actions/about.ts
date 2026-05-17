"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export type AboutData = {
  intro: {
    title: string;
    paragraphs: string[];
    awards: string[];
    image: string;
  };
  team: {
    title: string;
    quote: string;
    bio: string;
    image: string;
    members: { name: string; role: string }[];
  };
  process: {
    title: string;
    steps: {
      id: string;
      title: string;
      description: string;
      image: string;
    }[];
  };
};

const EMPTY_ABOUT: AboutData = {
  intro:   { title: "", paragraphs: [], awards: [], image: "" },
  team:    { title: "", quote: "", bio: "", image: "", members: [] },
  process: { title: "", steps: [] },
};

// ── Read ───────────────────────────────────────────────────────────────────

export async function getAbout(): Promise<AboutData> {
  try {
    const rows = await sql`SELECT data FROM about WHERE id = 1`;
    return (rows[0]?.data as AboutData) ?? EMPTY_ABOUT;
  } catch (error) {
    console.error("getAbout failed:", error);
    return EMPTY_ABOUT;
  }
}

// ── Save ───────────────────────────────────────────────────────────────────

export async function saveAbout(data: AboutData): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      INSERT INTO about (id, data)
      VALUES (1, ${JSON.stringify(data)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
    `;
    revalidatePath("/about");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("saveAbout failed:", error);
    return { success: false, error: error.message };
  }
}
