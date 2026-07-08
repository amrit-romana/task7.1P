import { getDbData } from "@/actions/admin";

const SITE_URL = "https://renaissancedecor.com.au";
const LOGO_URL = `${SITE_URL}/images/logo-dark-v2.png`;

// Suburbs mirrored from the /venetian-plaster/[location] location pages —
// keep in sync with SUBURBS in src/app/venetian-plaster/[location]/page.tsx.
const AREA_SERVED = [
  // Mornington Peninsula
  "Portsea", "Sorrento", "Flinders", "Blairgowrie", "Rye", "Mornington",
  "Mount Eliza", "Mount Martha", "Red Hill", "Balnarring",
  // South East / bayside Melbourne
  "Toorak", "South Yarra", "Brighton", "Brighton East", "Hampton",
  "Sandringham", "Beaumaris", "Black Rock", "Malvern", "Armadale",
  "Hawthorn", "Kew", "Camberwell", "Canterbury", "Balwyn",
  "Middle Park", "Albert Park", "St Kilda", "Elwood", "Port Melbourne",
];

// Service → representative page. Marmarino plaster is a fine Italian
// polished-lime finish covered under the general Venetian plaster service
// page, since there is no standalone /materials page for it yet.
const SERVICES = [
  {
    name: "Venetian Plastering",
    description:
      "Hand-applied, multi-layer polished and matte Venetian plaster finishes with a smooth, marble-like depth for feature walls, hallways, and luxury interiors.",
    url: `${SITE_URL}/venetian-plaster`,
  },
  {
    name: "Clay Plastering",
    description:
      "Natural, breathable clay plaster finishes with humidity-regulating and acoustic properties for healthy, textured interiors.",
    url: `${SITE_URL}/materials/clay-plaster`,
  },
  {
    name: "Metal Coating",
    description:
      "Decorative metallic and oxidised metal coating finishes for feature walls and architectural surfaces.",
    url: `${SITE_URL}/materials/metal-coatings`,
  },
  {
    name: "Tadelakt",
    description:
      "Traditional waterproof Moroccan lime plaster, hand-burnished for bathrooms, showers, and wet areas.",
    url: `${SITE_URL}/materials/tadelakt`,
  },
  {
    name: "Microcement Flooring",
    description:
      "Seamless, ultra-thin microcement overlay for floors, walls, and joinery with no grout lines.",
    url: `${SITE_URL}/materials/microcement`,
  },
  {
    name: "Marmarino Plaster",
    description:
      "Fine Italian lime-and-marble plaster finish prized for its smooth, stone-like surface and depth of colour.",
    url: `${SITE_URL}/venetian-plaster`,
  },
];

const DESCRIPTION = `Renaissance Decor specialises in luxury decorative finishes in Melbourne, creating bespoke interior surfaces including Venetian plaster, polished plaster, microcement, clay plaster, and premium textured wall finishes for residential, architectural, and commercial spaces across Victoria.

Combining European-inspired craftsmanship with contemporary interior design, Renaissance Decor delivers Venetian plaster Melbourne clients choose for its timeless elegance, depth, texture, and natural stone-like appearance. Every finish is carefully applied with precision, creating unique feature walls, statement surfaces, and refined interiors that enhance the character of each space.

With expertise in decorative plaster finishes, polished plaster applications, microcement surfaces, and architectural wall finishes, Renaissance Decor works closely with homeowners, architects, builders, and interior designers to create customised solutions tailored to each project's vision.

Every project begins with a detailed understanding of the architecture, lighting, colour palette, and surrounding materials. From sophisticated Italian plaster finishes and traditional Venetian techniques to modern seamless microcement finishes, each surface is crafted to achieve the perfect balance of beauty, durability, and functionality.

Our experience extends beyond application. We understand how different decorative finishes perform across various environments, including feature walls, bathrooms, kitchens, living areas, retail spaces, and luxury residential interiors. This allows us to recommend the ideal material, texture, and finish for each project.

Serving Melbourne and surrounding areas including Victoria's premium residential suburbs, Renaissance Decor is recognised for delivering high-end interior finishes, bespoke wall treatments, and luxury decorative plaster solutions with exceptional attention to detail.

Renaissance Decor represents craftsmanship, premium materials, and specialist knowledge in Venetian plaster, microcement, polished plaster, and architectural decorative finishes across Melbourne and Victoria.`;

function toE164(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  return digits.startsWith("0") ? `+61${digits.slice(1)}` : `+${digits}`;
}

export default async function BusinessSchema() {
  const db = await getDbData();
  const f = db.footerSettings || {};

  const phone = f.phone || "0468 326 303";
  const socials: Record<string, string> = f.socials || {};
  const sameAs = Object.values(socials).filter(
    (url): url is string => typeof url === "string" && url.trim() !== "" && url.trim() !== "#"
  );

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Renaissance Decor",
    url: SITE_URL,
    logo: LOGO_URL,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Renaissance Decor",
    image: LOGO_URL,
    url: SITE_URL,
    telephone: toE164(phone),
    description: DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 5 / 314 Governor Road",
      addressLocality: "Braeside",
      addressRegion: "VIC",
      postalCode: "3195",
      addressCountry: "AU",
    },
    areaServed: AREA_SERVED.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Decorative Finishes Services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          url: s.url,
        },
      })),
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
