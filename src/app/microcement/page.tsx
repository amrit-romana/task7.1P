import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { getFinishes, getFinishBySlug } from "@/actions/finishes";
import { getProjects } from "@/actions/projects";
import { toSlug } from "@/utils";
import { getDbData } from "@/actions/admin";
import { incrementPageView } from "@/actions/analytics";
import { after } from "next/server";

export const metadata: Metadata = {
  title: "Microcement Melbourne | Seamless Concrete-Look Finishes",
  description:
    "Renaissance Decor are Melbourne's microcement specialists. Seamless, grout-free microcement flooring, walls, bathrooms and joinery for residential and commercial interiors.",
  alternates: { canonical: "/microcement" },
};

const FAQS = [
  {
    q: "What is microcement?",
    a: "Microcement is an ultra-thin, cement-based decorative coating applied in multiple layers directly over most existing substrates — including tiles — to create a smooth, continuous, seamless surface with no grout lines or joins.",
  },
  {
    q: "How much does microcement cost in Melbourne?",
    a: "Cost depends on the surface area, substrate condition, and whether floors, walls, or wet areas are involved. Because microcement can often be applied over existing tile, it can reduce demolition costs compared to a full re-tile. We provide a detailed written quote after a site visit — contact us on 0468 326 303.",
  },
  {
    q: "Is microcement waterproof and suitable for bathrooms?",
    a: "Yes. When sealed correctly, microcement forms a fully waterproof, seamless membrane, making it a popular choice for showers, bathroom floors and walls, and wet-area joinery where grout lines are otherwise prone to mould.",
  },
  {
    q: "Can microcement be applied over existing tiles?",
    a: "In most cases, yes, provided the existing tiles are sound, well-bonded, and free of movement. This avoids the cost, mess, and disruption of a full tile removal, though our team assesses each substrate on-site before confirming suitability.",
  },
  {
    q: "How durable is a microcement finish?",
    a: "Microcement is highly durable and resistant to everyday wear when properly sealed. It is regularly used in both residential homes and high-traffic commercial spaces. Resealing every few years helps maintain its water resistance and appearance long-term.",
  },
];

export default async function MicrocementPage() {
  after(() => incrementPageView("/microcement"));
  const db = await getDbData();
  const allFinishes = await getFinishes();
  const microcement = await getFinishBySlug("microcement").catch(() => null);
  const projects = await getProjects();
  const microcementProject = projects.find((p) => p.id === "1781001918552") ?? null;

  const relatedFinishes = allFinishes.filter((f) => toSlug(f.name) !== "microcement").slice(0, 4);

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" navLinks={db.navLinks} />

      {/* Hero */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[var(--color-stone)]">
        {microcement?.image && (
          <Image
            src={microcement.image}
            alt="Microcement floor and wall finish Melbourne"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
        <div className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-14 md:pb-20">
          <p className="font-futura text-[10px] tracking-[0.3em] text-white/60 uppercase mb-3">
            Melbourne &amp; Mornington Peninsula
          </p>
          <h1 className="font-futura font-bold text-4xl md:text-6xl lg:text-7xl text-white tracking-widest uppercase leading-none">
            Microcement
            <span className="block font-futura font-light normal-case text-lg md:text-2xl lg:text-3xl tracking-[0.08em] mt-3">
              Melbourne – Seamless, Grout-Free Surfaces
            </span>
          </h1>
          <p className="font-futura font-light text-sm md:text-base text-white/80 mt-5 max-w-xl leading-relaxed">
            Ultra-thin, hand-applied microcement flooring, walls and joinery by Melbourne&apos;s decorative finish specialists.
          </p>
          <Link
            href="/enquire"
            className="inline-block mt-8 font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-white border-b border-white pb-1 hover:opacity-60 transition-opacity"
          >
            Request a Free Quote →
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className="w-full max-w-4xl mx-auto px-8 md:px-16 py-20 md:py-28">
        <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-5">What is Microcement?</p>
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[var(--color-charcoal)] leading-snug mb-8">
          A seamless, contemporary surface for floors, walls and everything in between.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-futura font-light text-base text-[var(--color-charcoal)] leading-relaxed">
          <p>
            Microcement is an ultra-thin decorative cement coating, applied by hand in several fine layers to create a continuous, monolithic surface with no grout lines, joins, or seams. Unlike traditional tiling, it flows across floors, walls, showers, and joinery as a single unbroken plane.
          </p>
          <p>
            Because it can often be applied directly over existing tiles, concrete, or timber substrates, microcement is a popular choice for renovations — reducing demolition time while delivering a clean, architectural, minimalist look that suits both contemporary and heritage interiors.
          </p>
          <p>
            At Renaissance Decor, every microcement application is carried out by hand, layer by layer, and finished with a protective sealer to achieve a durable, water-resistant surface. We work with interior designers, builders, and private clients across Melbourne and the Mornington Peninsula.
          </p>
          <p>
            Available in a wide range of colours and textures, from soft matte greys to warm, tactile neutrals, microcement can be tailored to almost any interior brief — whether it&apos;s a single ensuite floor or an entire open-plan kitchen and living space.
          </p>
        </div>
      </section>

      {/* Applications */}
      <section className="w-full bg-[var(--color-linen)] py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-10">Applications</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: "Flooring", desc: "Seamless microcement flooring across living areas, hallways, and entire homes — no grout lines to collect dirt." },
              { title: "Feature Walls", desc: "A continuous, architectural wall surface that reads as a single plane rather than individual panels or tiles." },
              { title: "Bathrooms & Showers", desc: "Fully waterproof when sealed, ideal for shower bases, walls, and floors without a single grout line." },
              { title: "Kitchen Benchtops", desc: "A durable, seamless benchtop and splashback surface that resists everyday wear in high-use kitchens." },
              { title: "Joinery & Cabinetry", desc: "Custom-finished cabinetry and joinery surfaces for a cohesive, monolithic look throughout a space." },
              { title: "Commercial Spaces", desc: "Hard-wearing microcement flooring and walls for retail, hospitality, and office fit-outs across Melbourne." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3 p-6 bg-white border border-[var(--color-stone)]/40">
                <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-charcoal)]">{title}</h3>
                <p className="font-futura font-light text-sm text-[var(--color-charcoal)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="w-full max-w-4xl mx-auto px-8 md:px-16 py-20">
        <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-6">Cost</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-charcoal)] mb-8">
          What Does Microcement Cost in Melbourne?
        </h2>
        <div className="font-futura font-light text-base text-[var(--color-charcoal)] leading-relaxed flex flex-col gap-6 max-w-2xl">
          <p>
            Microcement pricing depends on the total surface area, the condition of the existing substrate, and whether the project covers floors, walls, wet areas, or a combination of all three. Because microcement can frequently be applied directly over sound existing tiles or concrete, it can work out more cost-effective than a full strip-out and re-tile — particularly on bathroom and kitchen renovations.
          </p>
          <p>
            As with all our finishes, we provide a detailed written quote following an on-site assessment, so you know exactly what&apos;s included before work begins. Call us on <a href="tel:0468326303" className="text-[var(--color-charcoal)] font-bold">0468 326 303</a> or submit an enquiry to arrange a consultation.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="w-full bg-[var(--color-charcoal)] text-[var(--color-parchment)] py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-parchment)]/50 mb-6">Comparison</p>
          <h2 className="font-serif text-2xl md:text-3xl mb-12 text-[var(--color-parchment)]">
            Microcement vs Venetian Plaster
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-parchment)]">Microcement</h3>
              <p className="font-futura font-light text-sm text-[var(--color-parchment)]/70 leading-relaxed">
                A cement-based coating suited to floors, benchtops, and wet areas as well as walls. It creates a flatter, more industrial, architectural surface and is typically the stronger choice where floor-level durability and full waterproofing are the priority.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-parchment)]">Venetian Plaster</h3>
              <p className="font-futura font-light text-sm text-[var(--color-parchment)]/70 leading-relaxed">
                A lime-and-marble-dust finish used on walls and ceilings, prized for its depth, movement, and luminous, marble-like surface. It suits feature walls and living spaces where visual texture and warmth are the priority over floor-level wear resistance.
              </p>
            </div>
          </div>
          <p className="font-futura font-light text-sm text-[var(--color-parchment)]/70 leading-relaxed mt-10 max-w-2xl">
            Many of our Melbourne clients combine both — microcement flooring paired with a Venetian plaster feature wall — for a cohesive, seamless interior. <Link href="/venetian-plaster" className="underline underline-offset-2 hover:opacity-80 transition-opacity">Explore our Venetian plaster service</Link> or contact us to discuss which finish suits your project.
          </p>
        </div>
      </section>

      {/* Melbourne project example */}
      {microcementProject && (
        <section className="w-full py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-10">A Melbourne Microcement Project</p>
            <Link href={`/projects/${microcementProject.id}`} className="group flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-full md:w-[420px] aspect-[4/5] overflow-hidden bg-[var(--color-stone)] shrink-0">
                <Image
                  src={microcementProject.image}
                  alt={microcementProject.title}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
              <div className="flex flex-col gap-4 pt-2">
                <h3 className="font-futura font-bold text-lg uppercase tracking-[0.15em] text-[var(--color-charcoal)] group-hover:opacity-60 transition-opacity">
                  {microcementProject.title}
                </h3>
                <p className="font-futura font-light text-sm text-[var(--color-charcoal)] leading-relaxed max-w-md">
                  Seamless microcement flooring and wall surfaces completed for a Melbourne client, applied by hand to create a continuous, grout-free finish throughout the space.
                </p>
                <span className="font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 w-fit">
                  View Project →
                </span>
              </div>
            </Link>
            <div className="mt-14">
              <Link href="/projects" className="font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:opacity-50 transition-opacity">
                View All Melbourne Projects →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="w-full bg-[var(--color-charcoal)] text-[var(--color-parchment)] py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-parchment)]/50 mb-10">FAQs</p>
          <h2 className="font-serif text-2xl md:text-3xl mb-12 text-[var(--color-parchment)]">
            Common Questions About Microcement
          </h2>
          <div className="flex flex-col divide-y divide-[var(--color-parchment)]/10">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="py-7">
                <h3 className="font-futura font-bold text-sm md:text-base text-[var(--color-parchment)] mb-3">{q}</h3>
                <p className="font-futura font-light text-sm text-[var(--color-parchment)]/70 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related finishes */}
      {relatedFinishes.length > 0 && (
        <section className="w-full py-20 px-6 md:px-12">
          <div className="max-w-[1600px] mx-auto">
            <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-10">Explore Related Finishes</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedFinishes.map((f) => (
                <Link key={f.id} href={`/materials/${toSlug(f.name)}`} className="group flex flex-col gap-3">
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[var(--color-stone)]">
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <span className="font-futura font-bold text-[9px] uppercase tracking-[0.2em] text-[var(--color-charcoal)] group-hover:opacity-60 transition-opacity">
                    {f.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-14 flex justify-center">
              <Link href="/materials" className="font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:opacity-50 transition-opacity">
                View All Finishes →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="w-full bg-[var(--color-linen)] py-20 px-6 md:px-12 text-center">
        <p className="text-[10px] font-futura tracking-[0.3em] uppercase text-[var(--color-bark)] mb-4">Get Started</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-charcoal)] mb-6 max-w-xl mx-auto">
          Ready to bring microcement into your space?
        </h2>
        <p className="font-futura font-light text-sm text-[var(--color-bark)] mb-10 max-w-md mx-auto leading-relaxed">
          Call us on <a href="tel:0468326303" className="text-[var(--color-charcoal)] font-bold">0468 326 303</a> or submit an enquiry and our team will be in touch within one business day.
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
