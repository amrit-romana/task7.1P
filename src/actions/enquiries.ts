"use server";
import sql from "@/lib/db";

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

// ── Submit (called from the enquire form) ──────────────────────────────────

export async function submitEnquiry(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name    = (formData.get("name")    as string)?.trim();
  const email   = (formData.get("email")   as string)?.trim();
  const phone   = (formData.get("phone")   as string)?.trim() ?? "";
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    await sql`
      INSERT INTO enquiries (name, email, phone, message)
      VALUES (${name}, ${email}, ${phone}, ${message})
    `;
    return { success: true };
  } catch (error: any) {
    console.error("submitEnquiry failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ── Read (used by admin panel) ─────────────────────────────────────────────

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const rows = await sql`SELECT * FROM enquiries ORDER BY created_at DESC`;
    return rows as Enquiry[];
  } catch (error) {
    console.error("getEnquiries failed:", error);
    return [];
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteEnquiry(id: number): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM enquiries WHERE id = ${id}`;
    return { success: true };
  } catch {
    return { success: false };
  }
}
