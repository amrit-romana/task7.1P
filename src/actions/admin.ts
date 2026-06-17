"use server";
import { revalidatePath, updateTag, unstable_cache } from "next/cache";
import sql from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────────────────

type NavLink        = { id: string; name: string; href: string };
type CarouselItem   = { id: string; imageSrc: string; title: string; subtitle: string };
type Testimonial    = { id: string; quote: string; name: string; title: string };
type FooterSettings = Record<string, any>;
type SiteSettings   = { siteTitle: string; metaDescription: string };

type DbData = {
  navLinks:       NavLink[];
  carouselItems:  CarouselItem[];
  testimonials:   Testimonial[];
  footerSettings: FooterSettings;
  siteSettings:   SiteSettings;
};

// ── Read all data (used by the home page / layout) ─────────────────────────

const _getDbData = async (): Promise<DbData> => {
  try {
    const [navLinks, carouselItems, testimonials, footerRows, siteRows] = await Promise.all([
      sql`SELECT id, name, href FROM nav_links ORDER BY sort_order`,
      sql`SELECT id, image_src as "imageSrc", title, subtitle FROM carousel_items ORDER BY sort_order`,
      sql`SELECT id, quote, name, title FROM testimonials ORDER BY sort_order`,
      sql`SELECT data FROM footer_settings WHERE id = 1`,
      sql`SELECT data FROM site_settings WHERE id = 1`,
    ]);

    return {
      navLinks:       navLinks       as NavLink[],
      carouselItems:  carouselItems  as CarouselItem[],
      testimonials:   testimonials   as Testimonial[],
      footerSettings: footerRows[0]?.data ?? {},
      siteSettings:   siteRows[0]?.data   ?? { siteTitle: "", metaDescription: "" },
    };
  } catch (error) {
    console.error("getDbData failed:", error);
    return { navLinks: [], carouselItems: [], testimonials: [], footerSettings: {}, siteSettings: { siteTitle: "", metaDescription: "" } };
  }
};

export const getDbData = unstable_cache(_getDbData, ["db-data"], {
  tags: ["db-data"],
  revalidate: 3600,
});

// ── NAV LINKS ──────────────────────────────────────────────────────────────

export async function addNavLink(formData: FormData) {
  const name = formData.get("name") as string;
  const href = formData.get("href") as string;
  if (!name || !href) return;

  const id = Date.now().toString();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM nav_links`;
  const sortOrder = (maxOrder[0].m as number) + 1;

  await sql`INSERT INTO nav_links (id, name, href, sort_order) VALUES (${id}, ${name}, ${href}, ${sortOrder})`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function updateNavLink(id: string, name: string, href: string) {
  await sql`UPDATE nav_links SET name = ${name}, href = ${href} WHERE id = ${id}`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function deleteNavLink(id: string) {
  await sql`DELETE FROM nav_links WHERE id = ${id}`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/links");
}

// ── CAROUSEL ITEMS ─────────────────────────────────────────────────────────

function sanitizeImageUrl(url: string): string {
  if (!url) return "";
  let clean = url.trim();

  // If it's a full HTML snippet containing <img src="...">, extract the src
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/i;
  const match = clean.match(imgRegex);
  if (match && match[1]) {
    clean = match[1];
  }

  // Try to find the first occurrence of http:// or https://
  const httpIdx = clean.indexOf("http://");
  const httpsIdx = clean.indexOf("https://");
  if (httpsIdx !== -1) {
    clean = clean.substring(httpsIdx);
  } else if (httpIdx !== -1) {
    clean = clean.substring(httpIdx);
  }

  // Terminate at the first character that shouldn't be in a clean URL
  const endIdx = clean.search(/["'\s<>\[\]]/);
  if (endIdx !== -1) {
    clean = clean.substring(0, endIdx);
  }

  return clean;
}

export async function addCarouselItem(formData: FormData) {
  const rawImageSrc = formData.get("imageSrc") as string;
  const title    = formData.get("title")    as string ?? "";
  const subtitle = formData.get("subtitle") as string ?? "";
  if (!rawImageSrc) return;

  const imageSrc = sanitizeImageUrl(rawImageSrc);
  const id = Date.now().toString();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM carousel_items`;
  const sortOrder = (maxOrder[0].m as number) + 1;

  await sql`INSERT INTO carousel_items (id, image_src, title, subtitle, sort_order) VALUES (${id}, ${imageSrc}, ${title}, ${subtitle}, ${sortOrder})`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/carousel");
}

export async function updateCarouselItem(id: string, imageSrc: string, title: string, subtitle: string) {
  const cleanImageSrc = sanitizeImageUrl(imageSrc);
  await sql`UPDATE carousel_items SET image_src = ${cleanImageSrc}, title = ${title}, subtitle = ${subtitle} WHERE id = ${id}`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/carousel");
}

export async function deleteCarouselItem(id: string) {
  await sql`DELETE FROM carousel_items WHERE id = ${id}`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/carousel");
}

// ── TESTIMONIALS ───────────────────────────────────────────────────────────

export async function addTestimonial(formData: FormData) {
  const quote = formData.get("quote") as string;
  const name  = formData.get("name")  as string;
  const title = formData.get("title") as string ?? "";
  if (!quote || !name) return;

  const id = Date.now().toString();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM testimonials`;
  const sortOrder = (maxOrder[0].m as number) + 1;

  await sql`INSERT INTO testimonials (id, quote, name, title, sort_order) VALUES (${id}, ${quote}, ${name}, ${title}, ${sortOrder})`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(id: string, quote: string, name: string, title: string) {
  await sql`UPDATE testimonials SET quote = ${quote}, name = ${name}, title = ${title} WHERE id = ${id}`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await sql`DELETE FROM testimonials WHERE id = ${id}`;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

// ── FOOTER SETTINGS ────────────────────────────────────────────────────────

export async function saveFooterSettings(formData: FormData) {
  const data = {
    address:     formData.get("address")     as string,
    addressNote: formData.get("addressNote") as string,
    phone:       formData.get("phone")       as string,
    openingHours:formData.get("openingHours")as string,
    abn:         formData.get("abn")         as string,
    director: {
      name:  formData.get("director_name")  as string,
      email: formData.get("director_email") as string,
    },
    marketing: {
      name:  formData.get("marketing_name")  as string,
      email: formData.get("marketing_email") as string,
    },
    socials: {
      instagram: formData.get("instagram") as string,
      facebook:  formData.get("facebook")  as string,
      pinterest: formData.get("pinterest") as string,
      tiktok:    formData.get("tiktok")    as string,
      linkedin:  formData.get("linkedin")  as string,
    },
    copyrightName: formData.get("copyrightName") as string,
  };

  await sql`
    INSERT INTO footer_settings (id, data) VALUES (1, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/footer");
}

// ── SITE SETTINGS ──────────────────────────────────────────────────────────

export async function saveSiteSettings(formData: FormData) {
  const data = {
    siteTitle:       formData.get("siteTitle")       as string,
    metaDescription: formData.get("metaDescription") as string,
  };

  await sql`
    INSERT INTO site_settings (id, data) VALUES (1, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  updateTag("db-data");
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function saveNavLinks(links: NavLink[]): Promise<void> {
  try {
    for (const [i, link] of links.entries()) {
      await sql`UPDATE nav_links SET sort_order = ${i} WHERE id = ${link.id}`;
    }
    updateTag("db-data");
    revalidatePath("/");
    revalidatePath("/admin/links");
  } catch (error) {
    console.error("saveNavLinks failed:", error);
  }
}

export async function saveCarouselItems(items: CarouselItem[]): Promise<void> {
  try {
    for (const [i, item] of items.entries()) {
      await sql`UPDATE carousel_items SET sort_order = ${i} WHERE id = ${item.id}`;
    }
    updateTag("db-data");
    revalidatePath("/");
    revalidatePath("/admin/carousel");
  } catch (error) {
    console.error("saveCarouselItems failed:", error);
  }
}
