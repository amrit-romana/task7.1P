import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { getFinishes, getFinishById } from "@/actions/finishes";
import { toSlug } from "@/utils";
import { getDbData } from "@/actions/admin";
import { incrementPageView } from "@/actions/analytics";
import { after } from "next/server";

export const metadata: Metadata = {
  title: "Venetian Plaster Melbourne | Polished Plaster Specialists",
  description: "Renaissance Decor are Melbourne's leading Venetian plaster specialists. Handcrafted polished plaster walls for residential and commercial interiors across Melbourne and the Mornington Peninsula.",
  alternates: { canonical: "/venetian-plaster" },
};

const FAQS = [
  {
    q: "How long does Venetian plaster last?",
    a: "Properly applied Venetian plaster can last decades. Unlike paint, it is a mineral-based finish that hardens over time and does not peel or crack under normal conditions.",
  },
  {
    q: "Is Venetian plaster suitable for wet areas?",
    a: "Yes — when sealed correctly, Venetian plaster and tadelakt are highly water-resistant and commonly used in bathrooms, showers, and laundries.",
  },
  {
    q: "What suburbs in Melbourne do you service?",
    a: "We service all Melbourne metropolitan suburbs as well as the Mornington Peninsula, Geelong, and regional Victoria. Contact us to confirm availability for your location.",
  },
  {
    q: "How much does Venetian plaster cost?",
    a: "Cost varies based on surface area, finish complexity, and accessibility. We provide a detailed written quote after a site visit. Contact us on 0468 326 303 to arrange a consultation.",
  },
  {
    q: "Can Venetian plaster be applied over existing walls?",
    a: "In most cases, yes. Walls need to be structurally sound, primed, and free of moisture. Our team assesses each substrate before application to ensure the best result.",
  },
];

const SUBURBS = [
  "Melbourne CBD", "South Yarra", "Toorak", "Brighton", "Hawthorn",
  "Prahran", "Richmond", "Fitzroy", "Collingwood", "St Kilda",
  "Armadale", "Malvern", "Glen Waverley", "Frankston", "Mornington",
  "Mount Eliza", "Portsea", "Sorrento", "Rosebud", "Rye",
];

export default async function VenetianPlasterPage() {
  after(() => incrementPageView("/venetian-plaster"));
  const db = await getDbData();
  const allFinishes = await getFinishes();

  // Try to get the polished plaster finish for imagery
  const polishedPlaster = await getFinishById("f1").catch(() => null);
  const relatedFinishes = allFinishes.filter((f) => ["f1", "f2", "f7", "f6"].includes(f.id)).slice(0, 4);

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" navLinks={db.navLinks} />

      {/* Hero */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[var(--color-stone)]">
        {polishedPlaster?.image && (
          <Image
            src={polishedPlaster.image}
            alt="Venetian plaster wall Melbourne"
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
            Venetian<br />Plaster
          </h1>
          <p className="font-futura font-light text-sm md:text-base text-white/80 mt-5 max-w-xl leading-relaxed">
            Handcrafted polished plaster and decorative wall finishes by Melbourne&apos;s artisan specialists.
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
        <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-5">What is Venetian Plaster?</p>
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[var(--color-charcoal)] leading-snug mb-8">
          A mineral finish with centuries of heritage — now in Melbourne homes and commercial spaces.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-futura font-light text-base text-[var(--color-charcoal)] leading-relaxed">
          <p>
            Venetian plaster is a wall and ceiling finish made from slaked lime putty mixed with marble dust. Applied in multiple thin layers and burnished to a smooth or textured surface, it creates depth, luminosity, and a tactile quality that no paint can replicate.
          </p>
          <p>
            At Renaissance Decor, every application is carried out by hand using traditional techniques refined over decades. We work with interior designers, builders, and private clients across Melbourne and the Mornington Peninsula.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="w-full bg-[var(--color-linen)] py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-10">Our Plaster Services</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: "Polished Venetian Plaster", desc: "High-gloss marble-dust finish. Ideal for feature walls, hallways, and luxury interiors." },
              { title: "Matte Venetian Plaster", desc: "A softer, wax-finished texture with the same depth and warmth as its polished counterpart." },
              { title: "Tadelakt", desc: "Traditional Moroccan lime plaster — waterproof and perfect for bathrooms and wet areas." },
              { title: "Clay Plaster", desc: "Natural, breathable finish with excellent acoustic and humidity-regulating properties." },
              { title: "Textured Plaster", desc: "Custom texture and colour combinations for feature walls with sculptural presence." },
              { title: "Micro Cement", desc: "Seamless, ultra-thin cement overlay for floors, walls, and joinery — no grout lines." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3 p-6 bg-white border border-[var(--color-stone)]/40">
                <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-charcoal)]">{title}</h3>
                <p className="font-futura font-light text-sm text-[var(--color-charcoal)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suburb list */}
      <section className="w-full max-w-5xl mx-auto px-8 md:px-16 py-20">
        <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-6">Areas We Service</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-charcoal)] mb-10">
          Venetian Plaster Across Melbourne &amp; Beyond
        </h2>
        <div className="flex flex-wrap gap-3">
          {SUBURBS.map((suburb) => (
            <span key={suburb} className="font-futura text-xs text-[var(--color-charcoal)] border border-[var(--color-stone)] px-3 py-1.5">
              {suburb}
            </span>
          ))}
        </div>
        <p className="font-futura font-light text-sm text-[var(--color-bark)] mt-8 leading-relaxed max-w-2xl">
          Don&apos;t see your suburb? We travel throughout Victoria. <Link href="/enquire" className="underline underline-offset-2 hover:opacity-60 transition-opacity">Contact us</Link> to confirm availability.
        </p>
      </section>

      {/* FAQ */}
      <section className="w-full bg-[var(--color-charcoal)] text-[var(--color-parchment)] py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-parchment)]/50 mb-10">FAQs</p>
          <h2 className="font-serif text-2xl md:text-3xl mb-12 text-[var(--color-parchment)]">
            Common Questions About Venetian Plaster
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
          Ready to bring Venetian plaster into your space?
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
