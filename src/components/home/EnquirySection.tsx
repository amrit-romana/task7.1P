import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { getFaqs } from "@/actions/faqs";
import { FaqAccordion } from "@/components/home/FaqAccordion";

export async function EnquirySection() {
  const faqs = await getFaqs();

  return (
    <section className="w-full bg-[var(--color-parchment)] text-[var(--color-charcoal)] py-24 md:py-32 px-6 md:px-12 border-t border-[var(--color-charcoal)]/10 overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col gap-20">

        {/* FAQ block */}
        {faqs.length > 0 && (
          <div className="flex flex-col gap-10">
            <FadeIn direction="up">
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">
                  FAQ
                </span>
                <h2 className="font-futura font-light text-3xl md:text-4xl tracking-wide uppercase text-[var(--color-charcoal)]">
                  Frequently Asked Questions
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.15} direction="up">
              <FaqAccordion faqs={faqs} />
            </FadeIn>
          </div>
        )}

        {/* Enquire CTA */}
        <div className={`flex flex-col items-center gap-8 text-center ${faqs.length > 0 ? "pt-10 border-t border-[var(--color-charcoal)]/10" : ""}`}>
          <FadeIn direction="up">
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">
              Connect
            </span>
          </FadeIn>

          <FadeIn delay={0.2} direction="up" duration={1.2}>
            <p className="font-serif text-2xl md:text-4xl leading-[1.4] text-[var(--color-charcoal)]">
              {faqs.length > 0
                ? "Still have a question? We’d love to hear from you."
                : "Bespoke decorative finishes for exceptional homes and commercial spaces. Crafted by hand. Designed to endure."}
            </p>
          </FadeIn>

          <FadeIn delay={0.4} direction="up">
            <Link
              href="/enquire"
              className="mt-4 font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] border border-[#000000] px-12 py-4 hover:bg-[#000000] hover:text-[var(--color-parchment)] transition-colors duration-500 block"
            >
              Enquire
            </Link>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
