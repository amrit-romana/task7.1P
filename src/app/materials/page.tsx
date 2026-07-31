import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { getFinishes } from "@/actions/finishes";
import { toSlug } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { incrementPageView } from "@/actions/analytics";
import { after } from "next/server";

export const metadata: Metadata = {
  title: "Decorative Wall Finishes Melbourne | Venetian Plaster, Microcement & More",
  description:
    "Explore Renaissance Decor's full range of decorative wall finishes — Venetian plaster, microcement, clay plaster, tadelakt, textured plaster and metal coatings — handcrafted for Melbourne homes and commercial interiors.",
  alternates: { canonical: "/materials" },
};

const MATERIAL_HIGHLIGHTS = [
  {
    name: "Venetian Plaster",
    desc: "Our signature finish: slaked lime putty and marble dust, hand-burnished in multiple thin layers to a smooth, luminous, marble-like surface. Ideal for feature walls, hallways and living areas.",
  },
  {
    name: "Microcement",
    desc: "A seamless, ultra-thin cement overlay applied to floors, walls and joinery with no grout lines. Popular in Melbourne kitchens and bathrooms for its clean, contemporary look.",
  },
  {
    name: "Clay Plaster",
    desc: "A natural, breathable finish with excellent humidity-regulating and acoustic properties, prized for its warm, earthy texture in bedrooms and living spaces.",
  },
  {
    name: "Tadelakt",
    desc: "Traditional waterproof Moroccan lime plaster, hand-burnished to a soft sheen — the finish of choice for showers, bathrooms and other wet areas.",
  },
  {
    name: "Metal Coatings",
    desc: "Decorative metallic and oxidised finishes that bring an industrial, sculptural edge to feature walls and architectural surfaces.",
  },
  {
    name: "Textured Plaster",
    desc: "Custom texture and colour combinations, hand-applied to create sculptural depth that paint and wallpaper cannot replicate.",
  },
];

export default async function MaterialsPage() {
  after(() => incrementPageView("/materials"));
  const finishes = await getFinishes();

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      <section className="pt-36 md:pt-48 pb-12 px-6 md:px-12 w-full flex flex-col items-center">
        <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-[#000000] tracking-widest uppercase mb-12">
          Decorative Wall Finishes
        </h1>
        <p className="font-futura text-sm md:text-base text-center max-w-2xl text-[#000000]/70 leading-relaxed mb-24 font-light">
          Choose from our extensive range of Venetian plaster, microcement, clay plaster, tadelakt, metal coatings and textured plaster finishes, or alternatively we can create custom finishes to suit your requirements. For bespoke finishes please contact us and provide images and details from which sample boards can be created.
          <br />
          Visit our showroom by appointment or browse our online gallery to explore the wide range of finishes and textures available.
        </p>
      </section>

      {/* Grid of Finishes */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {finishes.map((finish) => (
            <Link
              key={finish.id}
              href={`/materials/${toSlug(finish.name)}`}
              className="group cursor-pointer flex flex-col gap-6"
            >
              <div className="relative w-full overflow-hidden bg-[var(--color-stone)] aspect-[4/5]">
                <Image
                  src={finish.image}
                  alt={finish.name}
                  fill
                  className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col text-center">
                <span className="font-futura font-bold text-sm md:text-base text-[#000000] uppercase tracking-[0.2em]">
                  {finish.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Material descriptions for SEO depth */}
      <section className="w-full bg-[var(--color-linen)] py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-10">About Our Finishes</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MATERIAL_HIGHLIGHTS.map(({ name, desc }) => (
              <div key={name} className="flex flex-col gap-2 p-6 bg-white border border-[var(--color-stone)]/40">
                <h2 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[#000000]">{name}</h2>
                <p className="font-futura font-light text-sm text-[#000000]/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
