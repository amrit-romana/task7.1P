"use server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export interface CourseData {
  id: string;
  title: string;
  price: string;
  duration: string;
  location: string;
  date: string;
  image: string;
  description: string;
  inclusions: string[];
  enquirySubject: string;
  sortOrder?: number;
}

export async function getCourses(): Promise<CourseData[]> {
  try {
    const rows = await sql`
      SELECT 
        id, 
        title, 
        price, 
        duration, 
        location, 
        date, 
        image, 
        description, 
        inclusions, 
        enquiry_subject AS "enquirySubject", 
        sort_order AS "sortOrder"
      FROM courses
      ORDER BY sort_order ASC
    `;
    return rows as CourseData[];
  } catch (error) {
    console.error("getCourses failed:", error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<CourseData | null> {
  try {
    const rows = await sql`
      SELECT 
        id, 
        title, 
        price, 
        duration, 
        location, 
        date, 
        image, 
        description, 
        inclusions, 
        enquiry_subject AS "enquirySubject", 
        sort_order AS "sortOrder"
      FROM courses
      WHERE id = ${id}
    `;
    return (rows[0] as CourseData) ?? null;
  } catch {
    return null;
  }
}

export async function saveCourse(course: Partial<CourseData>): Promise<{ success: boolean; error?: string }> {
  try {
    if (course.id) {
      await sql`
        UPDATE courses SET
          title = ${course.title ?? ""},
          price = ${course.price ?? "TBC"},
          duration = ${course.duration ?? "1 Day"},
          location = ${course.location ?? "Unit 5 / 314 Governor Road, Braeside 3195"},
          date = ${course.date ?? "TBC"},
          image = ${course.image ?? ""},
          description = ${course.description ?? ""},
          inclusions = ${JSON.stringify(course.inclusions ?? [])}::jsonb,
          enquiry_subject = ${course.enquirySubject ?? ""}
        WHERE id = ${course.id}
      `;
    } else {
      const id = "c-" + Date.now().toString();
      const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as m FROM courses`;
      const sortOrder = (maxOrder[0].m as number) + 1;

      await sql`
        INSERT INTO courses (id, title, price, duration, location, date, image, description, inclusions, enquiry_subject, sort_order)
        VALUES (
          ${id},
          ${course.title ?? ""},
          ${course.price ?? "TBC"},
          ${course.duration ?? "1 Day"},
          ${course.location ?? "Unit 5 / 314 Governor Road, Braeside 3195"},
          ${course.date ?? "TBC"},
          ${course.image ?? ""},
          ${course.description ?? ""},
          ${JSON.stringify(course.inclusions ?? [])}::jsonb,
          ${course.enquirySubject ?? ""},
          ${sortOrder}
        )
      `;
    }
    revalidatePath("/courses");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("saveCourse failed:", error);
    return { success: false, error: error.message };
  }
}

export async function saveCourses(courses: CourseData[]): Promise<void> {
  try {
    for (const [i, c] of courses.entries()) {
      await sql`
        UPDATE courses SET
          title = ${c.title},
          price = ${c.price},
          duration = ${c.duration},
          location = ${c.location},
          date = ${c.date},
          image = ${c.image},
          description = ${c.description},
          inclusions = ${JSON.stringify(c.inclusions ?? [])}::jsonb,
          enquiry_subject = ${c.enquirySubject},
          sort_order = ${i}
        WHERE id = ${c.id}
      `;
    }
    revalidatePath("/courses");
    revalidatePath("/");
  } catch (error) {
    console.error("saveCourses reorder failed:", error);
  }
}

export async function deleteCourse(id: string): Promise<{ success: boolean }> {
  try {
    await sql`DELETE FROM courses WHERE id = ${id}`;
    revalidatePath("/courses");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}
