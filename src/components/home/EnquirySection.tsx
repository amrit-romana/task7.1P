import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

export function EnquirySection() {
  return (
    <section className="w-full bg-[var(--color-parchment)] text-[var(--color-charcoal)] py-24 md:py-48 px-6 md:px-12 flex flex-col items-center justify-center relative border-t border-[var(--color-charcoal)]/10 overflow-hidden">
      <div className=" text-center flex flex-col items-center gap-8">
        <FadeIn direction="up">
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">
            Connect
          </span>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up" duration={1.2}>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.3] text-[var(--color-charcoal)]">
            Bespoke decorative finishes for exceptional homes and commercial spaces. Crafted by hand. Designed to endure
          </h2>
        </FadeIn>
        
        <FadeIn delay={0.4} direction="up">
          <Link 
            href="/enquire" 
            className="mt-8 font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] border border-[#000000] px-12 py-4 hover:bg-[#000000] hover:text-[var(--color-parchment)] transition-colors duration-500 block"
          >
            Enquire
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
