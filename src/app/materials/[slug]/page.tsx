import { getFinishes, getFinishBySlug } from "@/actions/finishes";
import { toSlug } from "@/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { incrementPageView } from "@/actions/analytics";
import { after } from "next/server";

export async function generateStaticParams() {
  const finishes = await getFinishes();
  return finishes.map((f) => ({ slug: toSlug(f.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const finish = await getFinishBySlug(slug);
  if (!finish) return {};
  return {
    title: `${finish.name} Melbourne | Renaissance Decor`,
    description: finish.description
      ? `${finish.description.slice(0, 140)}…`
      : `Bespoke ${finish.name} finishes for Melbourne homes and commercial interiors. Handcrafted by Renaissance Decor's artisan specialists.`,
    alternates: { canonical: `/materials/${toSlug(finish.name)}` },
  };
}

export default async function FinishDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const finish = await getFinishBySlug(slug);

  if (!finish) notFound();

  after(() => incrementPageView("/materials/" + slug));

  const allFinishes = await getFinishes();
  const otherFinishes = allFinishes.filter((f) => toSlug(f.name) !== slug).slice(0, 4);

  const galleryImages = finish.galleryImages && finish.galleryImages.length > 0
    ? finish.galleryImages
    : [];

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      {/* Hero */}
      <section className="relative w-full h-[55vh] md:h-[80vh] overflow-hidden bg-[var(--color-stone)]">
        <Image
          src={finish.image}
          alt={finish.name}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
        <div className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-12 md:pb-16">
          <p className="font-futura text-[10px] md:text-xs tracking-[0.25em] text-white/70 uppercase mb-3">
            <Link href="/materials" className="hover:text-white transition-colors">Finishes</Link>
            {" "}/{" "}{finish.name}
          </p>
          <h1 className="font-futura font-bold text-3xl md:text-5xl lg:text-6xl text-white tracking-widest uppercase">
            {finish.name}
          </h1>
        </div>
      </section>

      {/* Description */}
      {finish.description && (
        <section className="w-full max-w-[1000px] mx-auto px-8 md:px-16 pt-20 pb-16">
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
            <div className="flex-1">
              <span className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)] mb-6 block">
                About this Finish
              </span>
              <p className="font-futura font-light text-base md:text-lg text-[var(--color-charcoal)] leading-relaxed">
                {finish.description}
              </p>
              <div className="mt-12">
                <Link
                  href="/enquire"
                  className="inline-block font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:opacity-50 transition-opacity"
                >
                  Enquire About This Finish →
                </Link>
              </div>
            </div>
            <div className="w-full md:w-56 shrink-0">
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-[var(--color-stone)]">
                <Image
                  src={finish.image}
                  alt={`${finish.name} detail`}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 ? (
        <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-24">
          <span className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)] mb-12 block ml-1">
            Gallery
          </span>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                className="relative w-full break-inside-avoid mb-4 md:mb-6 overflow-hidden bg-[var(--color-stone)] group"
              >
                <Image
                  src={src}
                  alt={`${finish.name} sample ${idx + 1}`}
                  width={800}
                  height={1000}
                  className="w-full h-auto object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full max-w-[1000px] mx-auto px-8 md:px-16 pb-24">
          <div className="border border-[var(--color-stone)] rounded p-12 text-center">
            <p className="font-futura text-sm text-[var(--color-bark)] font-light">
              Gallery images for this finish are coming soon.
            </p>
            <Link href="/enquire" className="inline-block mt-6 font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:opacity-50 transition-opacity">
              Contact Us for Samples →
            </Link>
          </div>
        </section>
      )}

      {/* Other Finishes */}
      <section className="w-full bg-[var(--color-linen)] py-20 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <span className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)] mb-10 block">
            Explore Other Finishes
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {otherFinishes.map((f) => (
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
            <Link
              href="/materials"
              className="font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:opacity-50 transition-opacity"
            >
              View All Finishes →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
