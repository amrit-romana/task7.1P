"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import sql from "@/lib/db";

const ADMIN_PASSWORD_ENV = process.env.ADMIN_PASSWORD || "admin123";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const derived = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, derived);
}

async function verifyPassword(password: string): Promise<boolean> {
  try {
    const rows = await sql`SELECT data FROM site_settings WHERE id = 1`;
    const data = rows[0]?.data ?? {};
    if (data.adminPasswordHash) {
      return verifyPasswordHash(password, data.adminPasswordHash);
    }
  } catch {}
  return password === ADMIN_PASSWORD_ENV;
}

export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;

  if (await verifyPassword(password)) {
    (await cookies()).set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return redirect("/admin");
  }

  return { error: "Invalid password" };
}

export async function changePasswordAction(prevState: any, formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  if (!(await verifyPassword(currentPassword))) {
    return { error: "Current password is incorrect" };
  }

  const hash = hashPassword(newPassword);
  const rows = await sql`SELECT data FROM site_settings WHERE id = 1`;
  const existing = rows[0]?.data ?? {};
  const updated = { ...existing, adminPasswordHash: hash };

  await sql`
    INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(updated)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;

  return { success: "Password changed successfully" };
}

export async function logoutAction() {
  (await cookies()).delete("admin_session");
  return redirect("/admin/login");
}
