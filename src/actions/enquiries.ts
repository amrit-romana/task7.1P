"use server";
import sql from "@/lib/db";
import { Resend } from "resend";
import { put } from "@vercel/blob";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = "info@renaissancedecor.com.au";
const FROM_ADDRESS = "Renaissance Decor <enquiries@renaissancedecor.com.au>";

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

export async function submitEnquiry(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const projectAddress = (formData.get("projectAddress") as string)?.trim() ?? "";
  const wallLength = (formData.get("wallLength") as string)?.trim() ?? "";
  const wallHeight = (formData.get("wallHeight") as string)?.trim() ?? "";
  const message = (formData.get("message") as string)?.trim();
  const imageFile = formData.get("image") as File | null;

  if (!firstName || !lastName || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  const name = `${firstName} ${lastName}`;

  let imageUrl: string | undefined;
  if (imageFile && imageFile.size > 0) {
    try {
      const { url } = await put(`enquiries/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });
      imageUrl = url;
    } catch {
      // Non-fatal — proceed without image
    }
  }

  try {
    await sql`
      INSERT INTO enquiries (name, email, phone, message)
      VALUES (${name}, ${email}, ${phone}, ${message})
    `;
  } catch (error: unknown) {
    console.error("submitEnquiry db insert failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  const optionalRows = [
    phone && `<tr><td style="padding:8px 0;color:#666;width:160px">Telephone</td><td style="padding:8px 0">${phone}</td></tr>`,
    projectAddress && `<tr><td style="padding:8px 0;color:#666">Project address</td><td style="padding:8px 0">${projectAddress}</td></tr>`,
    wallLength && `<tr><td style="padding:8px 0;color:#666">Wall length</td><td style="padding:8px 0">${wallLength}</td></tr>`,
    wallHeight && `<tr><td style="padding:8px 0;color:#666">Wall height</td><td style="padding:8px 0">${wallHeight}</td></tr>`,
    imageUrl && `<tr><td style="padding:8px 0;color:#666">Image</td><td style="padding:8px 0"><a href="${imageUrl}" style="color:#000">View attachment</a></td></tr>`,
  ]
    .filter(Boolean)
    .join("");

  const notificationHtml = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#888;margin-bottom:32px">New Enquiry</p>
      <h1 style="font-weight:300;font-size:28px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 32px">${name}</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:32px">
        <tr><td style="padding:8px 0;color:#666;width:160px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#000">${email}</a></td></tr>
        ${optionalRows}
      </table>
      <div style="border-top:1px solid #eee;padding-top:24px;margin-top:24px">
        <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#888;margin-bottom:12px">Message</p>
        <p style="font-size:15px;line-height:1.7;white-space:pre-wrap">${message}</p>
      </div>
    </div>`;

  const confirmationHtml = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#888;margin-bottom:32px">Renaissance Decor</p>
      <h1 style="font-weight:300;font-size:28px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 24px">Thank You, ${firstName}</h1>
      <p style="font-size:15px;line-height:1.8;color:#444">We've received your enquiry and will be in touch shortly with bespoke recommendations for your project.</p>
      <p style="font-size:15px;line-height:1.8;color:#444;margin-top:16px">In the meantime, feel free to explore our <a href="https://renaissancedecor.com.au/projects" style="color:#000">project gallery</a> or reach us directly at <a href="tel:0468326303" style="color:#000">0468 326 303</a>.</p>
      <div style="margin-top:48px;padding-top:24px;border-top:1px solid #eee;font-size:12px;color:#999">
        <p>Unit 5 / 314 Governor Road, Braeside 3195<br>Mon – Fri, 9:00am – 5:00pm</p>
      </div>
    </div>`;

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: NOTIFY_EMAIL,
        replyTo: email,
        subject: `New Enquiry — ${name}`,
        html: notificationHtml,
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: "Your enquiry has been received — Renaissance Decor",
        html: confirmationHtml,
      }),
    ]);
  } catch (error: unknown) {
    console.error("submitEnquiry email send failed:", error);
    // Enquiry is already saved — don't surface email errors to the user
  }

  return { success: true };
}

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const rows = await sql`SELECT * FROM enquiries ORDER BY created_at DESC`;
    return rows as Enquiry[];
  } catch (error) {
    console.error("getEnquiries failed:", error);
    return [];
  }
}

export async function deleteEnquiry(id: number): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM enquiries WHERE id = ${id}`;
    return { success: true };
  } catch {
    return { success: false };
  }
}
