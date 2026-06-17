import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { ProjectStack } from "@/components/home/ProjectStack";
import { FinishesSection } from "@/components/home/FinishesSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { EnquirySection } from "@/components/home/EnquirySection";
import { getProjects } from "@/actions/projects";
import { getFinishes } from "@/actions/finishes";
import { getDbData } from "@/actions/admin";
import { incrementPageView } from "@/actions/analytics";
import { after } from "next/server";

export default async function Home() {
  after(() => incrementPageView("/"));
  const [projects, finishes, db] = await Promise.all([
    getProjects(),
    getFinishes(),
    getDbData(),
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <h1 className="sr-only">Venetian Plaster &amp; Decorative Finishes Melbourne</h1>
      <Header navLinks={db.navLinks} />
      <Hero carouselItems={db.carouselItems} />
      <section className="py-24 md:py-36 px-6 md:px-12 w-full flex justify-center">
        <h2 className="font-serif text-xl md:text-xl lg:text-xl max-w-4xl text-[var(--color-charcoal)] leading-[1.4] text-center">
          We work with Interior Designers, Builders and Architects who value exceptional craftsmanship and attention to detail. Every surface is an opportunity to create something lasting.
        </h2>
      </section>
      {/* SEO body copy — below fold */}
      {/* <section className="py-16 md:py-24 px-6 md:px-12 w-full bg-charcoal text-parchment">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-parchment/50 mb-4">Melbourne &amp; Mornington Peninsula</p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight mb-6">
              Venetian Plaster &amp; Decorative Finishes, Crafted for Lasting Interiors
            </h2>
            <p className="font-sans text-sm md:text-base leading-relaxed text-parchment/75">
              Renaissance Decor specialises in bespoke Venetian plaster, micro cement, and artisan surface finishes across Melbourne, the Mornington Peninsula, and greater Victoria. We work directly with interior designers, builders, and architects to bring technically precise and visually stunning results to every project.
            </p>
          </div>
          <div className="flex flex-col gap-8 font-sans text-sm md:text-base leading-relaxed text-parchment/75">
            <p>
              Our finishes include polished plaster, clay plaster, tadelakt, micro cement, textured plaster, concrete, metal coatings, and oxidation — each applied by hand using traditional European techniques and modern materials.
            </p>
            <p>
              Whether you are specifying a single statement wall or an entire residential development, our team delivers consistent, high-quality results. Phone <a href="tel:0468326303" className="text-parchment underline underline-offset-2">0468 326 303</a> or visit our showroom at Unit 5 / 314 Governor Road, Braeside 3195 — by appointment.
            </p>
          </div>
        </div>
      </section> */}
      <ProjectStack projects={projects} />
      <FinishesSection finishes={finishes} />
      <TestimonialSection testimonials={db.testimonials} />
      <EnquirySection />
    </main>
  );
}
