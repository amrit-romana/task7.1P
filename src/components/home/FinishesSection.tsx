import Image from "next/image";
import Link from "next/link";
import { FinishData } from "@/actions/finishes";
import { toSlug } from "@/utils";
import { FadeIn } from "@/components/ui/FadeIn";

export function FinishesSection({ finishes }: { finishes: FinishData[] }) {
  if (!finishes || finishes.length === 0) return null;

  const displayFinishes = finishes.filter(f => f.showOnHome).slice(0, 4);

  return (
    <section className="w-full bg-[var(--color-parchment)] py-12 md:py-32 px-6 md:px-12 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-[1400px] flex flex-col items-center">
        <FadeIn direction="up" duration={1.2}>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-charcoal)] mb-16 text-center">
            Our Finishes
          </h2>
        </FadeIn>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full mb-16">
          {displayFinishes.map((finish, idx) => (
            <FadeIn key={finish.id} delay={0.15 * idx} direction="up" className="w-full">
              <Link href={`/materials/${toSlug(finish.name)}`} className="flex flex-col gap-4 group cursor-pointer">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[var(--color-stone)]">
                  <Image
                    src={finish.image}
                    alt={finish.name}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-charcoal)] ml-2 transition-transform duration-700 group-hover:translate-x-2">
                  {finish.name}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} direction="up">
          <Link 
            href="/materials" 
            className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 pt-2 hover:opacity-60 transition-opacity mt-4 block"
          >
            Explore more finishes
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
