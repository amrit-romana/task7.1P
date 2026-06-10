import { Header } from "@/components/layout/Header";
import { FadeIn } from "@/components/ui/FadeIn";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />
      
      {/* 1. Foundation & Accolades */}
      <section className="pt-48 pb-24 px-6 md:px-12 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 overflow-hidden">
        <div className="lg:col-span-5 flex flex-col gap-12">
          <FadeIn delay={0.1} direction="up" duration={1.2}>
            <h1 className="font-futura font-light text-5xl md:text-6xl text-[#000000] tracking-widest uppercase">
              About Us
            </h1>
          </FadeIn>
          
          <div className="flex flex-col gap-6 font-sans text-sm md:text-base text-[#000000]/80 leading-loose">
            <FadeIn delay={0.2} direction="up">
              <p>
              Founded by Adam McCann, Renaissance Décor is a
Melbourne-based team of skilled artisans specialising in
handcrafted luxury finishes. With over 20 years of experience,
some international, we create bespoke surfaces that bring
depth, texture and character to residential and commercial
spaces throughout Melbourne and the Mornington Peninsula.  
              </p>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <p>
              Trained in the art of Venetian plastering in London, Adam
brought his expertise to Australia in 2017 and has since built
Renaissance Décor into one of Melbourne&#39;s leading decorative
finish specialists. We currently work closely with High End
Builders, Architects, Interior designers and Homeowners to
deliver exceptional Venetian Plaster, Micro cement, Clay and
Metal finishes in high end Hotels, Spas, Restaurants, Bars and exclusive Residencies. 
              </p>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <p>
              Known for our integrity, craftsmanship and attention to detail,
we are passionate about transforming spaces and bringing our
clients&#39; vision to life. We are one of the few suppliers and
applicators of decorative Metal and Clay finishes in
Melbourne, we proudly use and stock a unique range of
Australian-made products and bespoke surface solutions. 
              </p>
            </FadeIn>

            
          </div>

        
        </div>
        
        <div className="lg:col-span-7 flex flex-col justify-center">
          <FadeIn delay={0.5} direction="left" className="w-full">
            <div className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ibb.co/4RB4m7TB/IMG-9936-2.jpg"
                alt="Renaissance Decor Application"
                className="w-full block"
                style={{ height: "auto", marginTop: "-25%", marginBottom: "-25%" }}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. About Team (Dark Section) */}
      <section className="py-32 px-6 md:px-12 w-full bg-[#000000] text-[var(--color-parchment)] overflow-hidden">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="w-full">
            <FadeIn delay={0.1} direction="right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ibb.co/QFs773sm/IMG-4352.jpg"
                alt="The Renaissance Decor Team"
                className="w-full h-auto block filter grayscale contrast-125 brightness-90"
              />
            </FadeIn>
          </div>

          <div className="flex flex-col gap-12 lg:pl-12">
            <FadeIn delay={0.2} direction="up" duration={1.2}>
              <h2 className="font-futura font-light text-4xl md:text-5xl tracking-widest uppercase">
                About Team
              </h2>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <p className="font-serif italic text-3xl md:text-4xl leading-snug">
                "Every surface is a canvas, and our heritage is simply knowing how to let the architecture speak."
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4} direction="up">
              <div className="flex flex-col gap-6 font-sans text-sm md:text-base text-[var(--color-parchment)]/80 leading-loose max-w-xl">
                <p>
                The people behind Renaissance Décor. A close-knit team of
Skilled artisans who are committed to delivering exceptional
finishes, outstanding service and quality workmanship on
every project we deliver. 
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.5} direction="up">
              <div className="mt-8">
                <h3 className="font-futura font-bold text-lg uppercase tracking-widest mb-6">
                  Meet the Team
                </h3>
                <ul className="flex flex-col gap-2 font-sans text-sm text-[var(--color-parchment)]/70 max-w-md">
                  <li className="grid grid-cols-[1fr_2fr] border-b border-[var(--color-parchment)]/20 pb-3">
                    <span className="font-bold text-[var(--color-parchment)] tracking-wide">Adam McCann</span>
                    <span>Director</span>
                  </li>
                   <li className="grid grid-cols-[1fr_2fr] border-b border-[var(--color-parchment)]/20 pb-3">
                    <span className="font-bold text-[var(--color-parchment)] tracking-wide">Toni McCann</span>
                    <span>Marketing Director</span>
                  </li>
                  <li className="grid grid-cols-[1fr_2fr] border-b border-[var(--color-parchment)]/20 pb-3 pt-3">
                    <span className="font-bold text-[var(--color-parchment)] tracking-wide">Master Artisans</span>
                    <span>Certified Venetian Applicators</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. How We Work Timeline */}
      <section className="py-32 px-6 md:px-12 w-full max-w-[1400px] mx-auto flex flex-col relative overflow-hidden">
        <FadeIn direction="up" duration={1.2}>
          <h2 className="text-center font-futura font-light text-4xl md:text-5xl text-[#000000] tracking-widest uppercase mb-32">
            How We Work
          </h2>
        </FadeIn>
        
        {/* Absolute vertical line */}
        <div className="absolute left-1/2 top-48 bottom-0 w-[1px] bg-[#000000]/20 hidden md:block transform -translate-x-1/2" />
        
        <div className="flex flex-col gap-32">
          {/* Step 01 */}
          <div className="flex flex-col md:flex-row items-center w-full relative z-10 w-full justify-between">
            <div className="md:w-1/2 flex justify-end md:pr-24 w-full">
              <FadeIn direction="right" className="w-full max-w-[400px]">
                <div className="relative w-full aspect-[4/5] bg-stone-200">
                  <Image src="https://i.ibb.co/zVwfty39/SHOWROOM.jpg" alt="Consultation" fill className="object-cover" />
                </div>
              </FadeIn>
            </div>
            
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#000000]" />
            
            <div className="md:w-1/2 flex flex-col gap-4 md:pl-24 mt-8 md:mt-0 w-full">
              <FadeIn delay={0.2} direction="up">
                <span className="font-serif text-6xl text-[#000000]/20">01</span>
                <h3 className="font-futura font-bold text-xl uppercase tracking-widest text-[#000000] mt-4">Consultation</h3>
                <p className="font-sans text-sm text-[#000000]/80 leading-loose max-w-sm mt-4">We begin by understanding your vision, desired finish, budget and timeframe, while assessing the substrate and application area to determine the most suitable solution for your project.

</p>
              </FadeIn>
            </div>
          </div>

          {/* Step 02 */}
          <div className="flex flex-col md:flex-row-reverse items-center w-full relative z-10 justify-between">
            <div className="md:w-1/2 flex justify-start md:pl-24 w-full">
              <FadeIn direction="left" className="w-full max-w-[400px]">
                <div className="relative w-full aspect-[4/3] bg-stone-200">
                  <Image src="https://i.ibb.co/8yh5XrF/494208455-1273030034823090-647951896159338908-n.jpg" alt="Sampling" fill className="object-cover" />
                </div>
              </FadeIn>
            </div>
            
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#000000]" />
            
            <div className="md:w-1/2 flex flex-col gap-4 md:pr-24 items-start md:items-end text-left flex-end md:text-right mt-8 md:mt-0 w-full">
              <FadeIn delay={0.2} direction="up" className="flex flex-col items-start md:items-end w-full">
                <span className="font-serif text-6xl text-[#000000]/20">02</span>
                <h3 className="font-futura font-bold text-xl uppercase tracking-widest text-[#000000] mt-4">SAMPLES & APPROVAL</h3>
                <p className="font-sans text-sm text-[#000000]/80 leading-loose max-w-sm mt-4">Bespoke sample boards are created for you to view in your home or project space, allowing you to experience the texture, colour and finish before making a final selection.</p>
              </FadeIn>
            </div>
          </div>

          {/* Step 03 */}
          <div className="flex flex-col md:flex-row items-center w-full relative z-10 justify-between">
            <div className="md:w-1/2 flex justify-end md:pr-24 w-full">
              <FadeIn direction="right" className="w-full max-w-[400px]">
                <div className="relative w-full aspect-[4/5] bg-stone-200">
                  <Image src="https://i.ibb.co/Wpyc8FD4/626429525-18092861459004740-604214084003201179-n.jpg" alt="Application" fill className="object-cover" />
                </div>
              </FadeIn>
            </div>
            
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#000000]" />
            
            <div className="md:w-1/2 flex flex-col gap-4 md:pl-24 mt-8 md:mt-0 w-full">
               <FadeIn delay={0.2} direction="up">
                  <span className="font-serif text-6xl text-[#000000]/20">03</span>
                  <h3 className="font-futura font-bold text-xl uppercase tracking-widest text-[#000000] mt-4">Execution</h3>
                  <p className="font-sans text-sm text-[#000000]/80 leading-loose max-w-sm mt-4">Our experienced team expertly applies the selected finish on-site, delivering a seamless result that brings your vision to life.</p>
               </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 4. You May Also Like / Featured Grids */}
      {/* <section className="py-24 px-6 md:px-12 w-full max-w-[1600px] mx-auto border-t border-[#000000]/10">
        <FadeIn direction="up">
          <h2 className="text-center font-futura font-light text-2xl md:text-3xl text-[#000000] tracking-widest uppercase mb-16">
            Featured Projects
          </h2>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeIn delay={0.1} direction="up">
            <Link href="/projects/living" className="group flex flex-col gap-4 relative">
               <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-200">
                 <Image src="https://renaissancedecor.com.au/wp-content/uploads/2023/07/chandelier-living-room.jpg" alt="Living" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
               </div>
               <p className="text-center font-futura uppercase tracking-widest text-xs font-bold text-[#000000]">High-End Living</p>
            </Link>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <Link href="/projects/wet-areas" className="group flex flex-col gap-4 relative">
               <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-200">
                 <Image src="https://renaissancedecor.com.au/wp-content/uploads/2023/07/RD_11_Struan-Sofa.jpg" alt="Wet Areas" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
               </div>
               <p className="text-center font-futura uppercase tracking-widest text-xs font-bold text-[#000000]">Minimalist Textures</p>
            </Link>
          </FadeIn>
          <FadeIn delay={0.5} direction="up">
            <Link href="/projects/commercial" className="group flex flex-col gap-4 relative">
               <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-200">
                 <Image src="https://renaissancedecor.com.au/wp-content/uploads/2023/07/RenaissanceDecor-024.jpg" alt="Commercial" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
               </div>
               <p className="text-center font-futura uppercase tracking-widest text-xs font-bold text-[#000000]">Commercial Venues</p>
            </Link>
          </FadeIn>
        </div>
      </section> */}
      
    </main>
  );
}
