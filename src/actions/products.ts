"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export interface ProductData {
  id: string;
  name: string;
  url: string;
  image: string;
  sortOrder?: number;
}

export async function getProducts(): Promise<ProductData[]> {
  try {
    const rows = await sql`
      SELECT id, name, url, image, sort_order AS "sortOrder"
      FROM products
      ORDER BY sort_order ASC
    `;
    return rows as ProductData[];
  } catch (error) {
    console.error("getProducts failed:", error);
    return [];
  }
}

export async function saveProduct(product: Partial<ProductData>): Promise<{ success: boolean; error?: string }> {
  try {
    if (product.id) {
      await sql`
        UPDATE products SET
          name = ${product.name ?? ""},
          url = ${product.url ?? ""},
          image = ${product.image ?? ""}
        WHERE id = ${product.id}
      `;
    } else {
      const id = Date.now().toString();
      const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM products`;
      const sortOrder = (maxOrder[0].m as number) + 1;

      await sql`
        INSERT INTO products (id, name, url, image, sort_order)
        VALUES (${id}, ${product.name ?? ""}, ${product.url ?? ""}, ${product.image ?? ""}, ${sortOrder})
      `;
    }
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("saveProduct failed:", error);
    return { success: false, error: error.message };
  }
}

export async function saveProducts(products: ProductData[]): Promise<void> {
  try {
    for (const [i, p] of products.entries()) {
      await sql`
        UPDATE products SET
          name = ${p.name},
          url = ${p.url},
          image = ${p.image},
          sort_order = ${i}
        WHERE id = ${p.id}
      `;
    }
    revalidatePath("/shop");
    revalidatePath("/");
  } catch (error) {
    console.error("saveProducts reorder failed:", error);
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}
