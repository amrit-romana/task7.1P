"use server";

import fs from "fs/promises";
import path from "path";

const aboutFilePath = path.join(process.cwd(), "src", "data", "about.json");

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

export async function getAbout(): Promise<AboutData> {
  try {
    const data = await fs.readFile(aboutFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read about.json", error);
    // Return empty defaults if file not found
    return {
      intro: { title: "", paragraphs: [], awards: [], image: "" },
      team: { title: "", quote: "", bio: "", image: "", members: [] },
      process: { title: "", steps: [] }
    };
  }
}

export async function saveAbout(data: AboutData): Promise<{ success: boolean; error?: string }> {
  try {
    // In actual production without local write access, this would write to Vercel Postgres or similar.
    await fs.writeFile(aboutFilePath, JSON.stringify(data, null, 2), "utf8");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save about.json", error);
    return { success: false, error: error.message };
  }
}
