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

  const lcpImageSrc = db.carouselItems[0]?.imageSrc;

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      {lcpImageSrc && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="preload" as="image" href={lcpImageSrc} fetchPriority="high" />
      )}
      <h1 className="sr-only">Venetian Plaster &amp; Decorative Finishes Melbourne</h1>
      <Header navLinks={db.navLinks} />
      <Hero carouselItems={db.carouselItems} />
      <section className="py-24 md:py-36 px-6 md:px-12 w-full flex justify-center">
        <h2 className="font-serif text-xl md:text-xl lg:text-xl max-w-4xl text-[var(--color-charcoal)] leading-[1.4] text-center">
          We work with Interior Designers, Builders and Architects who value exceptional craftsmanship and attention to detail. Every surface is an opportunity to create something lasting.
        </h2>
      </section>
      {/* SEO body copy — below fold */}
      <section className="py-16 md:py-24 px-6 md:px-12 w-full bg-[var(--color-charcoal)] text-[var(--color-parchment)] mb-16 md:mb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-[var(--color-parchment)]/50 mb-4">Melbourne &amp; Mornington Peninsula</p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight mb-6">
              Venetian Plaster &amp; Decorative Finishes, Crafted for Lasting Interiors
            </h2>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--color-parchment)]/75">
              Renaissance Decor specialises in bespoke Venetian plaster, micro cement, and artisan surface finishes across Melbourne, the Mornington Peninsula, and greater Victoria. We work directly with interior designers, builders, and architects to bring technically precise and visually stunning results to every project.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--color-parchment)]/75 mt-6">
              Every finish is built up in multiple hand-applied layers rather than rolled on like paint, which is why Venetian plaster, tadelakt, and microcement surfaces develop a depth, luminosity, and tactile quality that flat paint simply cannot replicate — and why they continue to look as good in ten years as they do on day one.
            </p>
          </div>
          <div className="flex flex-col gap-8 font-sans text-sm md:text-base leading-relaxed text-[var(--color-parchment)]/75">
            <p>
              Our finishes include polished plaster, clay plaster, tadelakt, micro cement, textured plaster, concrete, metal coatings, and oxidation — each applied by hand using traditional European techniques and modern materials.
            </p>
            <p>
              Whether you are specifying a single statement wall or an entire residential development, our team delivers consistent, high-quality results. Phone <a href="tel:0468326303" className="text-[var(--color-parchment)] underline underline-offset-2">0468 326 303</a> or visit our showroom at Unit 5 / 314 Governor Road, Braeside 3195 — by appointment.
            </p>
            <p>
              We service Melbourne&apos;s inner and bayside suburbs — including South Yarra, Toorak, Brighton, Armadale, and Hawthorn — as well as the Mornington Peninsula from Mount Eliza through to Portsea, Sorrento, and Rye, plus surrounding regional Victoria. Our team travels to your site for an on-the-ground assessment before any project begins.
            </p>
          </div>
        </div>
      </section>

       <ProjectStack projects={projects} />
      <FinishesSection finishes={finishes} />
     

      {/* Process & why choose us */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-10 text-center">Why Choose Renaissance Decor</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {[
              {
                title: "Hand-Applied Craftsmanship",
                desc: "Every wall is finished by hand using traditional European lime-plastering techniques, layer by layer, rather than sprayed or rolled on.",
              },
              {
                title: "Direct Trade Collaboration",
                desc: "We work directly alongside interior designers, architects, and builders from concept through to final sign-off, keeping every project on schedule.",
              },
              {
                title: "Melbourne-Wide Service",
                desc: "Based in Braeside, our team services residential and commercial projects across Melbourne metro and the Mornington Peninsula.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3 text-center items-center">
                <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-charcoal)]">{title}</h3>
                <p className="font-futura font-light text-sm text-[var(--color-charcoal)]/70 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Process */}
      <section className="w-full bg-[var(--color-linen)] py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-6 text-center">Our Process</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-charcoal)] mb-12 text-center max-w-2xl mx-auto">
            From First Consultation to Finished Surface
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "We visit your site to assess the substrate, discuss finish, colour, and sheen, and provide a detailed written quote." },
              { step: "02", title: "Preparation", desc: "Surfaces are primed, patched, and levelled so every subsequent layer of plaster bonds evenly and reads true under light." },
              { step: "03", title: "Application", desc: "Our artisans hand-apply multiple thin coats using traditional European techniques, building the depth unique to each finish." },
              { step: "04", title: "Finishing", desc: "Each surface is burnished or sealed as required, leaving a durable, low-maintenance finish ready for daily life." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="font-futura font-bold text-2xl text-[var(--color-stone)]">{step}</span>
                <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-charcoal)]">{title}</h3>
                <p className="font-futura font-light text-sm text-[var(--color-charcoal)]/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials at a glance */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-futura tracking-[0.25em] uppercase text-[var(--color-bark)] mb-6 text-center">Our Decorative Finishes</p>
          <p className="font-futura font-light text-sm md:text-base text-center max-w-2xl mx-auto text-[var(--color-charcoal)]/70 leading-relaxed mb-14">
            From Venetian plaster to microcement, tadelakt, and clay plaster, every finish we offer is hand-applied by our Melbourne team and can be tailored in colour, texture, and sheen to suit your space.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: "Venetian Plaster", desc: "Slaked lime and marble dust, burnished to a smooth, marble-like sheen for feature walls and hallways." },
              { name: "Microcement", desc: "Seamless, ultra-thin cement overlay for floors, walls, and joinery with no grout lines." },
              { name: "Tadelakt", desc: "Waterproof Moroccan lime plaster, the finish of choice for bathrooms and wet areas." },
              { name: "Clay Plaster", desc: "Natural, breathable finish with acoustic and humidity-regulating properties for bedrooms and living spaces." },
              { name: "Textured Plaster", desc: "Custom texture and colour combinations, hand-applied for sculptural depth on feature walls." },
              { name: "Metal Coatings", desc: "Decorative metallic and oxidised finishes for an industrial, architectural edge." },
            ].map(({ name, desc }) => (
              <div key={name} className="flex flex-col gap-2">
                <h3 className="font-futura font-bold text-[11px] uppercase tracking-[0.2em] text-[var(--color-charcoal)]">{name}</h3>
                <p className="font-futura font-light text-sm text-[var(--color-charcoal)]/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       <TestimonialSection testimonials={db.testimonials} />
     
      <EnquirySection />
    </main>
  );
}
