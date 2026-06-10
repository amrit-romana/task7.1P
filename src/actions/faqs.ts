"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export interface FaqData {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id         TEXT PRIMARY KEY,
      question   TEXT NOT NULL DEFAULT '',
      answer     TEXT NOT NULL DEFAULT '',
      sort_order INTEGER DEFAULT 0
    )
  `;
}

export async function getFaqs(): Promise<FaqData[]> {
  try {
    await ensureTable();
    const rows = await sql`
      SELECT id, question, answer, sort_order AS "sortOrder"
      FROM faqs
      ORDER BY sort_order ASC
    `;
    return rows as FaqData[];
  } catch (error) {
    console.error("getFaqs failed:", error);
    return [];
  }
}

export async function saveFaq(faq: Partial<FaqData>): Promise<{ success: boolean; error?: string }> {
  try {
    await ensureTable();
    if (faq.id) {
      await sql`
        UPDATE faqs SET question = ${faq.question ?? ""}, answer = ${faq.answer ?? ""}
        WHERE id = ${faq.id}
      `;
    } else {
      const id = "faq-" + Date.now();
      const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) AS m FROM faqs`;
      const sortOrder = (maxOrder[0].m as number) + 1;
      await sql`
        INSERT INTO faqs (id, question, answer, sort_order)
        VALUES (${id}, ${faq.question ?? ""}, ${faq.answer ?? ""}, ${sortOrder})
      `;
    }
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveFaqsOrder(faqs: FaqData[]): Promise<void> {
  try {
    for (const [i, f] of faqs.entries()) {
      await sql`UPDATE faqs SET sort_order = ${i} WHERE id = ${f.id}`;
    }
    revalidatePath("/");
  } catch (error) {
    console.error("saveFaqsOrder failed:", error);
  }
}

export async function deleteFaq(id: string): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM faqs WHERE id = ${id}`;
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}
