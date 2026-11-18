import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnquirySection } from "@/components/home/EnquirySection";
import { getFinishes } from "@/actions/finishes";
import { toSlug } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { incrementPageView } from "@/actions/analytics";
import { after } from "next/server";

export const metadata: Metadata = {
  title: "Our Services | Decorative Finishes Melbourne — Renaissance Decor",
  description:
    "Renaissance Decor's services span Venetian plaster, microcement, clay plaster, tadelakt, metal coatings and textured plaster — hand-applied by Melbourne's artisan specialists for residential and commercial interiors.",
  alternates: { canonical: "/services" },
};

const SERVICE_COPY: Record<string, { eyebrow: string; desc: string }> = {
  "Venetian Plaster": {
    eyebrow: "Light & Depth",
    desc: "Our most requested service begins with slaked lime putty and marble dust, built up in several hand-burnished layers until the surface takes on a soft, marble-like luminosity. Because each layer is worked by hand rather than sprayed, the finish reads differently under every light — which is exactly the point. We tint on-site to match a joinery sample, a stone benchtop, or a single swatch pulled from a mood board, and can deliver either a high polish or a soft matte depending on the room.",
  },
  "Microcement": {
    eyebrow: "Seamless Surfaces",
    desc: "A seamless, ultra-thin cement overlay for floors, walls, showers and joinery — applied with no grout lines or joins. We regularly apply microcement directly over existing tile, which reduces demolition time considerably on renovation projects, and we seal every installation to a standard suited to wet areas, kitchens and high-traffic commercial floors.",
  },
  "Clay Plaster": {
    eyebrow: "Natural & Breathable",
    desc: "A natural, low-VOC finish with genuine humidity-regulating and acoustic properties, favoured in bedrooms and living spaces by clients who want warmth without synthetic coatings. The matte, earthen texture is built up by hand in multiple passes, giving each wall a soft, tactile character that paint cannot replicate.",
  },
  "Tadelakt": {
    eyebrow: "Waterproof Lime Plaster",
    desc: "Traditional Moroccan lime plaster, hand-burnished to a soft sheen and sealed to a fully waterproof standard — our specification of choice for showers, bathrooms and other wet areas. Once cured, tadelakt forms a seamless surface with no grout lines to maintain, resisting mould and mildew far better than tiled alternatives.",
  },
  "Metal Coatings": {
    eyebrow: "Sculptural & Industrial",
    desc: "Decorative metallic and oxidised coatings — from brushed steel to living copper and rust patinas — applied to bring an architectural, sculptural edge to feature walls. We are one of the few Melbourne applicators working in true decorative metal and clay, and these finishes suit both statement residential walls and commercial fit-outs.",
  },
  "Textured Plaster": {
    eyebrow: "Custom Texture & Colour",
    desc: "Bespoke texture and colour combinations, hand-applied and worked in layers to create sculptural depth that paint and wallpaper cannot achieve. Every textured finish is custom-built to a brief, giving each wall a genuinely one-of-a-kind character.",
  },
};

const DEFAULT_COPY = {
  eyebrow: "Hand-Applied Finish",
  desc: "A bespoke decorative finish, hand-applied in multiple layers by our Melbourne-based artisan team to suit the architecture, lighting and character of the space.",
};

export default async function ServicesPage() {
  after(() => incrementPageView("/services"));
  const finishes = await getFinishes();

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      {/* Intro */}
      <section className="pt-36 md:pt-48 pb-20 px-6 md:px-12 w-full max-w-[1000px] mx-auto flex flex-col items-center text-center">
        <FadeIn direction="up" duration={1.2}>
          <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-[#000000] tracking-widest uppercase mb-10">
            Our Services
          </h1>
        </FadeIn>
        <FadeIn delay={0.15} direction="up">
          <p className="font-futura text-sm md:text-base text-[#000000]/70 leading-relaxed font-light max-w-2xl">
            Wall finishes have enriched architecture for centuries — not as decoration applied after the fact, but as part of the architecture itself. Every service below is hand-applied on-site by our Braeside-based team, who work directly with homeowners, interior designers, architects and builders to specify the right material for each surface, lighting condition and design brief.
          </p>
        </FadeIn>
      </section>

      {/* Alternating service sections */}
      <section className="w-full flex flex-col">
        {finishes.map((finish, idx) => {
          const copy = SERVICE_COPY[finish.name] ?? DEFAULT_COPY;
          const reverse = idx % 2 === 1;
          return (
            <div
              key={finish.id}
              className={`w-full py-16 md:py-24 px-6 md:px-12 ${idx % 2 === 1 ? "bg-[var(--color-linen)]" : ""}`}
            >
              <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
                <div className={`lg:col-span-7 order-1 ${reverse ? "lg:order-2" : "lg:order-1"}`}>
                  <FadeIn direction={reverse ? "right" : "left"} duration={1.1}>
                    <div className="relative w-full aspect-[16/11] overflow-hidden bg-[var(--color-stone)]">
                      <Image
                        src={finish.image}
                        alt={finish.name}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </div>
                  </FadeIn>
                </div>

                <div className={`lg:col-span-5 order-2 ${reverse ? "lg:order-1" : "lg:order-2"} flex flex-col gap-6`}>
                  <FadeIn direction="up" delay={0.1}>
                    <span className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)]">
                      {copy.eyebrow}
                    </span>
                  </FadeIn>
                  <FadeIn direction="up" delay={0.15}>
                    <h2 className="font-futura font-bold text-2xl md:text-3xl text-[#000000] uppercase tracking-[0.1em]">
                      {finish.name}
                    </h2>
                  </FadeIn>
                  <FadeIn direction="up" delay={0.2}>
                    <p className="font-futura font-light text-sm md:text-base text-[#000000]/75 leading-relaxed">
                      {copy.desc}
                    </p>
                  </FadeIn>
                  <FadeIn direction="up" delay={0.25}>
                    <Link
                      href={`/materials/${toSlug(finish.name)}`}
                      className="inline-block mt-2 font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[#000000] border-b border-[#000000] pb-1 hover:opacity-50 transition-opacity w-fit"
                    >
                      Explore {finish.name} →
                    </Link>
                  </FadeIn>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Why Renaissance Decor */}
      <section className="w-full bg-[#000000] text-parchment py-28 md:py-32 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto flex flex-col items-center text-center gap-10">
          <FadeIn direction="up">
            <span className="font-futura text-[10px] uppercase tracking-[0.3em] text-parchment/50">
              Why Renaissance Decor
            </span>
          </FadeIn>
          <FadeIn delay={0.15} direction="up" duration={1.2}>
            <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl leading-snug">
              &ldquo;Every surface is a canvas, and our heritage is simply knowing how to let the architecture speak.&rdquo;
            </p>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="font-futura font-light text-sm md:text-base text-parchment/70 leading-relaxed max-w-2xl">
              Over 20 years of practice across Melbourne and the Mornington Peninsula, every finish is applied by hand by our own team of artisan plasterers — never subcontracted — so the standard on-site is the standard we specify.
            </p>
          </FadeIn>
        </div>
      </section>

      <EnquirySection />
    </main>
  );
}
