import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // ── Old com.au URLs → new slug-based material pages ──────────────────
      { source: "/venetian-plaster",       destination: "/venetian-plaster",          permanent: true },
      { source: "/polished-plasters",      destination: "/materials/polished-plaster", permanent: true },
      { source: "/polished-plasters/",     destination: "/materials/polished-plaster", permanent: true },
      { source: "/finishes/microcement",   destination: "/materials/micro-cement",     permanent: true },
      { source: "/finishes/microcement/",  destination: "/materials/micro-cement",     permanent: true },
      { source: "/microcement",            destination: "/materials/micro-cement",     permanent: true },
      { source: "/microcement/",           destination: "/materials/micro-cement",     permanent: true },
      { source: "/clay-plaster",           destination: "/materials/clay-plaster",     permanent: true },
      { source: "/clay-plaster/",          destination: "/materials/clay-plaster",     permanent: true },
      { source: "/metal-coatings",         destination: "/materials/metal-coatings",   permanent: true },
      { source: "/metal-coatings/",        destination: "/materials/metal-coatings",   permanent: true },
      { source: "/tadelakt",               destination: "/materials/tadelakt",         permanent: true },
      { source: "/tadelakt/",              destination: "/materials/tadelakt",         permanent: true },
      { source: "/textured-plaster",       destination: "/materials/textured-plaster", permanent: true },
      { source: "/textured-plaster/",      destination: "/materials/textured-plaster", permanent: true },
      { source: "/concrete",               destination: "/materials/concrete",          permanent: true },
      { source: "/concrete/",              destination: "/materials/concrete",          permanent: true },
      { source: "/oxidation",              destination: "/materials/oxidation",         permanent: true },
      { source: "/oxidation/",             destination: "/materials/oxidation",         permanent: true },
      { source: "/flooring",               destination: "/materials/flooring",          permanent: true },
      { source: "/flooring/",              destination: "/materials/flooring",          permanent: true },
      { source: "/finishes",               destination: "/materials",                   permanent: true },
      { source: "/finishes/",              destination: "/materials",                   permanent: true },
      // ── Old ID-based material URLs (Vercel) → slug-based ─────────────────
      { source: "/materials/f1",  destination: "/materials/polished-plaster", permanent: true },
      { source: "/materials/f2",  destination: "/materials/textured-plaster", permanent: true },
      { source: "/materials/f3",  destination: "/materials/concrete",          permanent: true },
      { source: "/materials/f4",  destination: "/materials/oxidation",         permanent: true },
      { source: "/materials/f5",  destination: "/materials/metal-coatings",   permanent: true },
      { source: "/materials/f6",  destination: "/materials/tadelakt",         permanent: true },
      { source: "/materials/f7",  destination: "/materials/clay-plaster",     permanent: true },
      { source: "/materials/f8",  destination: "/materials/flooring",          permanent: true },
      { source: "/materials/f9",  destination: "/materials/micro-cement",     permanent: true },
      // ── Site structure ────────────────────────────────────────────────────
      { source: "/our-projects",  destination: "/projects", permanent: true },
      { source: "/our-projects/", destination: "/projects", permanent: true },
      { source: "/about-us",      destination: "/about",    permanent: true },
      { source: "/about-us/",     destination: "/about",    permanent: true },
      { source: "/contact",       destination: "/enquire",  permanent: true },
      { source: "/contact/",      destination: "/enquire",  permanent: true },
      { source: "/products",      destination: "/shop",     permanent: true },
      { source: "/products/",     destination: "/shop",     permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "renaissancedecor.com.au",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Allow locally uploaded images from public/uploads without optimization
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/images/**" },
      { pathname: "/fonts/**" },
    ],
  },
};

export default nextConfig;
