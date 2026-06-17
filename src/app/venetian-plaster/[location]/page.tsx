import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { FinishesSection } from "@/components/home/FinishesSection";
import { getFinishes, getFinishById } from "@/actions/finishes";
import { getDbData } from "@/actions/admin";
import { incrementPageView } from "@/actions/analytics";
import { after } from "next/server";

// ── Suburb data ─────────────────────────────────────────────────────────────

type SuburbData = {
  name: string;
  slug: string;
  postcode: string;
  region: string;
  blurb: string;
  nearby: string[];
};

const SUBURBS: SuburbData[] = [
  // Mornington Peninsula
  {
    name: "Portsea",
    slug: "portsea",
    postcode: "3944",
    region: "Mornington Peninsula",
    blurb: "Portsea is one of Australia's most prestigious coastal addresses, home to estate-scale residences and architectural holiday homes. Renaissance Decor regularly works with interior designers and architects on high-specification projects throughout the Peninsula tip.",
    nearby: ["Sorrento", "Blairgowrie", "Rye"],
  },
  {
    name: "Sorrento",
    slug: "sorrento",
    postcode: "3943",
    region: "Mornington Peninsula",
    blurb: "Sorrento's heritage streetscapes and luxury coastal homes demand finishes of the highest calibre. From polished Venetian plaster to tadelakt wet areas, we bring old-world craftsmanship to Sorrento's most discerning properties.",
    nearby: ["Portsea", "Blairgowrie", "Mount Eliza"],
  },
  {
    name: "Flinders",
    slug: "flinders",
    postcode: "3929",
    region: "Mornington Peninsula",
    blurb: "The rural-coastal character of Flinders attracts architects who favour natural, textural interiors. Clay plaster, micro cement, and matte Venetian finishes pair perfectly with the earthy palette of Flinders' premium homes.",
    nearby: ["Red Hill", "Balnarring", "Mornington"],
  },
  {
    name: "Blairgowrie",
    slug: "blairgowrie",
    postcode: "3942",
    region: "Mornington Peninsula",
    blurb: "Blairgowrie sits between ocean and bay, home to a growing number of architect-designed residences. We supply and apply bespoke surface finishes that complement the coastal light and open-plan living characteristic of the area.",
    nearby: ["Sorrento", "Portsea", "Rye"],
  },
  {
    name: "Rye",
    slug: "rye",
    postcode: "3941",
    region: "Mornington Peninsula",
    blurb: "Rye's evolving luxury market has seen a wave of high-end renovations and new builds. Renaissance Decor provides the full range of decorative wall and floor finishes to Rye's growing portfolio of premium properties.",
    nearby: ["Blairgowrie", "Sorrento", "Rosebud"],
  },
  {
    name: "Mornington",
    slug: "mornington",
    postcode: "3931",
    region: "Mornington Peninsula",
    blurb: "As the commercial heart of the Peninsula, Mornington supports a strong residential and hospitality sector. From boutique hotel lobbies to executive homes, our finishes are trusted by Mornington's leading builders and designers.",
    nearby: ["Mount Eliza", "Mount Martha", "Frankston"],
  },
  {
    name: "Mount Eliza",
    slug: "mount-eliza",
    postcode: "3930",
    region: "Mornington Peninsula",
    blurb: "Mount Eliza is synonymous with established wealth and large-scale estate living. Our team has delivered Venetian plaster, micro cement, and polished plaster finishes to some of the suburb's most significant residential projects.",
    nearby: ["Mornington", "Mount Martha", "Frankston"],
  },
  {
    name: "Mount Martha",
    slug: "mount-martha",
    postcode: "3934",
    region: "Mornington Peninsula",
    blurb: "Mount Martha's elevated bay views attract discerning homeowners who invest in quality interiors. Venetian plaster and decorative lime finishes are a natural choice for the light-filled, coastal-contemporary homes of the area.",
    nearby: ["Mornington", "Mount Eliza", "Safety Beach"],
  },
  {
    name: "Red Hill",
    slug: "red-hill",
    postcode: "3937",
    region: "Mornington Peninsula",
    blurb: "Red Hill's wine country setting inspires interiors that are warm, tactile, and connected to the land. Clay plaster, limewash, and natural lime finishes are popular choices for Red Hill's rural retreats and cellar-door venues.",
    nearby: ["Flinders", "Merricks", "Balnarring"],
  },
  {
    name: "Balnarring",
    slug: "balnarring",
    postcode: "3926",
    region: "Mornington Peninsula",
    blurb: "Balnarring's acreage properties and rural character call for finishes that are both durable and beautiful. We work with builders throughout the Southern Peninsula to deliver hand-applied plaster and cement finishes.",
    nearby: ["Flinders", "Red Hill", "Merricks"],
  },
  // Melbourne inner south
  {
    name: "Toorak",
    slug: "toorak",
    postcode: "3142",
    region: "Melbourne",
    blurb: "Toorak is Melbourne's most prestigious suburb, home to grand estates and architect-designed residences that set the benchmark for interior luxury. Renaissance Decor is trusted by Toorak's leading interior designers for Venetian plaster, polished plaster, and micro cement applications.",
    nearby: ["South Yarra", "Armadale", "Malvern"],
  },
  {
    name: "South Yarra",
    slug: "south-yarra",
    postcode: "3141",
    region: "Melbourne",
    blurb: "South Yarra's blend of heritage apartments and contemporary new builds creates a diverse canvas for decorative finishes. Our team delivers polished plaster, micro cement, and textured wall finishes to South Yarra's most sought-after properties.",
    nearby: ["Toorak", "Prahran", "Richmond"],
  },
  {
    name: "Brighton",
    slug: "brighton",
    postcode: "3186",
    region: "Melbourne",
    blurb: "Brighton's bayside estates and double-fronted Victorian homes are a natural home for Venetian plaster. We work with Brighton's most respected builders and interior designers to deliver finishes that stand the test of time.",
    nearby: ["Hampton", "Sandringham", "Elwood"],
  },
  {
    name: "Brighton East",
    slug: "brighton-east",
    postcode: "3187",
    region: "Melbourne",
    blurb: "Brighton East's premium residential market is supported by a strong network of interior designers who specify decorative plaster and cement finishes. Renaissance Decor services all Brighton East projects from our Braeside base.",
    nearby: ["Brighton", "Bentleigh", "Hampton"],
  },
  {
    name: "Hampton",
    slug: "hampton",
    postcode: "3188",
    region: "Melbourne",
    blurb: "Hampton's coastal setting and upscale village appeal attract homeowners who value quality over convenience. Venetian plaster and micro cement are increasingly popular choices in Hampton's renovated Federation homes and new builds.",
    nearby: ["Brighton", "Sandringham", "Beaumaris"],
  },
  {
    name: "Sandringham",
    slug: "sandringham",
    postcode: "3191",
    region: "Melbourne",
    blurb: "Sandringham's established bayside suburb combines heritage charm with modern luxury renovation. Renaissance Decor has completed Venetian plaster and micro cement projects throughout Sandringham for over a decade.",
    nearby: ["Hampton", "Beaumaris", "Black Rock"],
  },
  {
    name: "Beaumaris",
    slug: "beaumaris",
    postcode: "3193",
    region: "Melbourne",
    blurb: "Beaumaris is renowned for its mid-century modernist architecture — interiors that pair beautifully with smooth polished plaster and micro cement. Our finishes complement the clean lines and natural materials that define Beaumaris style.",
    nearby: ["Sandringham", "Black Rock", "Mentone"],
  },
  {
    name: "Black Rock",
    slug: "black-rock",
    postcode: "3193",
    region: "Melbourne",
    blurb: "Black Rock's cliff-top homes and bayside character attract architects who demand finishes of exceptional quality. Renaissance Decor delivers bespoke Venetian plaster, tadelakt, and micro cement to Black Rock's premium residential projects.",
    nearby: ["Beaumaris", "Sandringham", "Mentone"],
  },
  {
    name: "Malvern",
    slug: "malvern",
    postcode: "3144",
    region: "Melbourne",
    blurb: "Malvern's grand Victorian and Edwardian homes provide the perfect backdrop for classic Venetian plaster. We work with Malvern's interior designers and builders to honour the heritage character of these significant properties.",
    nearby: ["Armadale", "Toorak", "Malvern East"],
  },
  {
    name: "Armadale",
    slug: "armadale",
    postcode: "3143",
    region: "Melbourne",
    blurb: "Armadale's tree-lined streets and premium shopping village reflect the suburb's high expectations for craftsmanship and design. Our plaster and cement finishes are specified by leading Armadale interior designers and architects.",
    nearby: ["Malvern", "Toorak", "South Yarra"],
  },
  {
    name: "Hawthorn",
    slug: "hawthorn",
    postcode: "3122",
    region: "Melbourne",
    blurb: "Hawthorn's blue-chip residential market combines heritage character with contemporary renovation. Venetian plaster is among the most requested finishes for Hawthorn's renovated Victorian terrace homes and riverside mansions.",
    nearby: ["Kew", "Camberwell", "South Yarra"],
  },
  {
    name: "Kew",
    slug: "kew",
    postcode: "3101",
    region: "Melbourne",
    blurb: "Kew's substantial family homes and established gardens reflect the suburb's long history of investment in quality. Renaissance Decor has completed polished plaster, clay plaster, and micro cement projects in Kew for discerning homeowners.",
    nearby: ["Hawthorn", "Camberwell", "Balwyn"],
  },
  {
    name: "Camberwell",
    slug: "camberwell",
    postcode: "3124",
    region: "Melbourne",
    blurb: "Camberwell's premium residential market values quality craftsmanship and timeless materials. Our Venetian plaster and decorative surface finishes are trusted by Camberwell's most respected builders and interior designers.",
    nearby: ["Canterbury", "Hawthorn", "Kew"],
  },
  {
    name: "Canterbury",
    slug: "canterbury",
    postcode: "3126",
    region: "Melbourne",
    blurb: "Canterbury's grand estates and prestigious addresses demand the finest interior finishes. Renaissance Decor delivers Venetian plaster and polished lime finishes that complement Canterbury's heritage architecture.",
    nearby: ["Camberwell", "Balwyn", "Surrey Hills"],
  },
  {
    name: "Balwyn",
    slug: "balwyn",
    postcode: "3103",
    region: "Melbourne",
    blurb: "Balwyn's substantial family homes are a canvas for exceptional surface finishes. We deliver polished plaster, micro cement, and clay plaster to Balwyn's growing number of high-specification renovation and new-build projects.",
    nearby: ["Canterbury", "Kew", "Balwyn North"],
  },
  {
    name: "Middle Park",
    slug: "middle-park",
    postcode: "3206",
    region: "Melbourne",
    blurb: "Middle Park's Victorian terrace homes and art deco apartments lend themselves to polished plaster and limewash finishes. Renaissance Decor works with Middle Park's design-forward homeowners to create interiors of lasting quality.",
    nearby: ["Albert Park", "South Melbourne", "St Kilda"],
  },
  {
    name: "Albert Park",
    slug: "albert-park",
    postcode: "3206",
    region: "Melbourne",
    blurb: "Albert Park's heritage homes and proximity to the city attract design professionals who specify premium interior finishes. Venetian plaster and micro cement are popular choices for Albert Park's renovated Victorian and Edwardian properties.",
    nearby: ["Middle Park", "St Kilda", "South Melbourne"],
  },
  {
    name: "St Kilda",
    slug: "st-kilda",
    postcode: "3182",
    region: "Melbourne",
    blurb: "St Kilda's cosmopolitan mix of apartments, heritage buildings, and boutique hospitality venues creates diverse opportunities for decorative wall and floor finishes. Renaissance Decor delivers micro cement and polished plaster throughout the St Kilda precinct.",
    nearby: ["Elwood", "Albert Park", "South Yarra"],
  },
  {
    name: "Elwood",
    slug: "elwood",
    postcode: "3184",
    region: "Melbourne",
    blurb: "Elwood's art deco apartments and renovated bungalows are increasingly specified with Venetian plaster and micro cement. Our finishes complement the coastal, creative character that defines the Elwood lifestyle.",
    nearby: ["St Kilda", "Brighton", "Hampton"],
  },
  {
    name: "Port Melbourne",
    slug: "port-melbourne",
    postcode: "3207",
    region: "Melbourne",
    blurb: "Port Melbourne's waterfront apartments and converted warehouses provide an ideal setting for micro cement floors and polished plaster walls. Renaissance Decor works across Port Melbourne's residential and commercial interior sectors.",
    nearby: ["Albert Park", "South Melbourne", "Williamstown"],
  },
];

export async function generateStaticParams() {
  return SUBURBS.map((s) => ({ location: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  const suburb = SUBURBS.find((s) => s.slug === location);
  if (!suburb) return {};
  return {
    title: `Venetian Plaster ${suburb.name} | Renaissance Decor`,
    description: `Premium Venetian plaster and decorative surface finishes in ${suburb.name} ${suburb.postcode}. Handcrafted by Renaissance Decor — Melbourne and ${suburb.region}'s artisan plaster specialists.`,
    alternates: { canonical: `/venetian-plaster/${suburb.slug}` },
  };
}

export default async function VenetianPlasterLocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const suburb = SUBURBS.find((s) => s.slug === location);
  if (!suburb) notFound();

  after(() => incrementPageView(`/venetian-plaster/${location}`));

  const db = await getDbData();
  const allFinishes = await getFinishes();
  const polishedPlaster = await getFinishById("f1").catch(() => null);

  const nearbyPages = suburb.nearby.map((name) => {
    const s = SUBURBS.find((x) => x.name === name);
    return s ?? null;
  }).filter(Boolean) as SuburbData[];

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" navLinks={db.navLinks} />

      {/* Hero */}
      <section className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden bg-[var(--color-stone)]">
        {polishedPlaster?.image && (
          <Image
            src="https://i.ibb.co/3mCjZV22/Screenshot-2025-04-02-at-11-47-51-AM.jpg"
            alt={`Venetian plaster ${suburb.name}`}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
        <div className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-14 md:pb-20">
          <p className="font-futura text-[10px] tracking-[0.3em] text-white/60 uppercase mb-3">
            <Link href="/venetian-plaster" className="hover:text-white/80 transition-colors">
              Venetian Plaster
            </Link>
            {" "}/ {suburb.region}
          </p>
          <h1 className="font-futura font-bold text-4xl md:text-6xl lg:text-7xl text-white tracking-widest uppercase leading-none">
            Venetian Plaster<br />{suburb.name}
          </h1>
          <p className="font-futura font-light text-sm md:text-base text-white/80 mt-5 max-w-xl leading-relaxed">
            Handcrafted decorative wall finishes for {suburb.name}&apos;s finest homes and interiors.
          </p>
          <Link
            href="/enquire"
            className="inline-block mt-8 font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-white border-b border-white pb-1 hover:opacity-60 transition-opacity"
          >
            Get in Touch →
          </Link>
        </div>
      </section>

      {/* Suburb intro */}
      <section className="w-full max-w-4xl mx-auto px-8 md:px-16 py-20 md:py-28">
        <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-5">
          {suburb.region} — {suburb.postcode}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-charcoal)] leading-snug mb-8">
          Venetian Plaster Specialists Serving {suburb.name}
        </h2>
        <p className="font-futura font-light text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed mb-6">
          {suburb.blurb}
        </p>
        <p className="font-futura font-light text-base text-[var(--color-charcoal)] leading-relaxed">
          Based in Braeside, Renaissance Decor travels throughout {suburb.region} to deliver polished plaster, micro cement, clay plaster, tadelakt, and other decorative surface finishes. Call us on{" "}
          <a href="tel:0468326303" className="font-bold text-[var(--color-charcoal)]">0468 326 303</a>{" "}
          to discuss your {suburb.name} project.
        </p>
      </section>

      {/* Finishes grid */}
      <section className="w-full bg-[var(--color-linen)] py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-10">
            Finishes Available in {suburb.name}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: "Polished Venetian Plaster", desc: "Classic marble-dust finish burnished to a high sheen. The finish of choice for {suburb}'s most prestigious addresses.", slug: "polished-plaster" },
              { title: "Matte Venetian Plaster", desc: "Soft wax-finished lime plaster with depth and warmth — ideal for living areas, bedrooms, and studies.", slug: "polished-plaster" },
              { title: "Tadelakt", desc: "Waterproof Moroccan lime plaster for bathrooms, showers, and wet areas. Seamless and highly durable.", slug: "tadelakt" },
              { title: "Micro Cement", desc: "Seamless, ultra-thin cement overlay for floors and walls with no grout lines. Ideal for kitchens and bathrooms.", slug: "micro-cement" },
              { title: "Clay Plaster", desc: "Natural, breathable wall finish with excellent humidity-regulating properties and a warm, earthy tone.", slug: "clay-plaster" },
              { title: "Textured Plaster", desc: "Custom texture and colour for feature walls — sculptural depth that paints and renders cannot replicate.", slug: "textured-plaster" },
            ].map(({ title, desc, slug }) => (
              <Link key={title} href={`/materials/${slug}`} className="group flex flex-col gap-3 p-6 bg-white border border-[var(--color-stone)]/40 hover:border-[var(--color-charcoal)]/20 transition-colors">
                <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-charcoal)]">{title}</h3>
                <p className="font-futura font-light text-sm text-[var(--color-charcoal)] leading-relaxed">{desc.replace("{suburb}", suburb.name)}</p>
                <span className="font-futura text-[10px] uppercase tracking-[0.2em] text-[var(--color-bark)] mt-auto group-hover:opacity-60 transition-opacity">View finish →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby suburbs */}
      {nearbyPages.length > 0 && (
        <section className="w-full max-w-4xl mx-auto px-8 md:px-16 py-20">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-6">
            Nearby Areas We Service
          </p>
          <div className="flex flex-wrap gap-4">
            {nearbyPages.map((s) => (
              <Link
                key={s.slug}
                href={`/venetian-plaster/${s.slug}`}
                className="font-futura text-sm text-[var(--color-charcoal)] border border-[var(--color-stone)] px-4 py-2 hover:bg-[var(--color-charcoal)] hover:text-[var(--color-parchment)] hover:border-[var(--color-charcoal)] transition-colors"
              >
                Venetian Plaster {s.name} →
              </Link>
            ))}
          </div>
        </section>
      )}

      <FinishesSection finishes={allFinishes} />

      {/* CTA */}
      <section className="w-full bg-[var(--color-linen)] py-20 px-6 md:px-12 text-center">
        <p className="text-[10px] font-futura tracking-[0.3em] uppercase text-[var(--color-bark)] mb-4">Get Started</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-charcoal)] mb-6 max-w-xl mx-auto">
          Venetian plaster for your {suburb.name} property
        </h2>
        <p className="font-futura font-light text-sm text-[var(--color-bark)] mb-10 max-w-md mx-auto leading-relaxed">
          Call <a href="tel:0468326303" className="text-[var(--color-charcoal)] font-bold">0468 326 303</a> or submit an enquiry. We service all {suburb.region} suburbs and travel throughout greater Victoria.
        </p>
        <Link
          href="/enquire"
          className="inline-block font-futura font-bold text-[10px] uppercase tracking-[0.3em] text-[var(--color-parchment)] bg-[var(--color-charcoal)] px-10 py-4 hover:opacity-80 transition-opacity"
        >
          Make an Enquiry
        </Link>
      </section>
    </main>
  );
}
