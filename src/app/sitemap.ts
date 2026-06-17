import type { MetadataRoute } from "next";
import { getFinishes } from "@/actions/finishes";
import { toSlug } from "@/utils";
import { getProjects } from "@/actions/projects";

const BASE = "https://renaissancedecor.com.au";

const LOCATION_SLUGS = [
  "portsea","sorrento","flinders","blairgowrie","rye","mornington",
  "mount-eliza","mount-martha","red-hill","balnarring",
  "toorak","south-yarra","brighton","brighton-east","hampton",
  "sandringham","beaumaris","black-rock","malvern","armadale",
  "hawthorn","kew","camberwell","canterbury","balwyn",
  "middle-park","albert-park","st-kilda","elwood","port-melbourne",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [finishes, projects] = await Promise.all([getFinishes(), getProjects()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/materials`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/projects`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/about`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/enquire`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/courses`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/shop`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/venetian-plaster`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const finishRoutes: MetadataRoute.Sitemap = finishes.map((f: any) => ({
    url: `${BASE}/materials/${toSlug(f.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p: any) => ({
    url: `${BASE}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const locationRoutes: MetadataRoute.Sitemap = LOCATION_SLUGS.map((slug) => ({
    url: `${BASE}/venetian-plaster/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...finishRoutes, ...projectRoutes, ...locationRoutes];
}
