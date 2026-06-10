"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectData } from "@/actions/projects";

export function ProjectStack({ projects }: { projects: ProjectData[] }) {
  const homeProjects = projects.filter(p => p.showOnHome);

  const beforeQuote = homeProjects.slice(0, 3);
  const afterQuote = homeProjects.slice(3);

  const renderProject = (project: ProjectData) => (
    <div key={project.id} className="relative w-full group cursor-pointer aspect-[4/5] bg-[var(--color-stone)] overflow-hidden block">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-90"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none p-6">
        <h3 className="font-sans text-[10px] md:text-xs font-bold text-white text-center tracking-[0.2em] uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
          {project.title}
        </h3>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-[var(--color-parchment)] pb-24 flex flex-col items-center">
      <div className="w-full max-w-[1300px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-24">

        {beforeQuote.map(renderProject)}

        {/* Embedded Quote Block exactly positioned at grid cell 4 */}
        <div className="w-full h-full flex flex-col items-center justify-center p-10 md:p-16 bg-[var(--color-parchment)] aspect-[4/5]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md flex flex-col gap-8 text-center md:text-left"
          >
            <span className="font-serif text-4xl text-[var(--color-charcoal)] leading-none mb-2">“</span>
            <p className="font-sans text-lg md:text-xl text-[var(--color-charcoal)] leading-relaxed font-medium">
              Adam and the Renaissance Décor team combine exceptional artistry with a keen eye for design to create elegant, welcoming interiors that stand the test of time.
            </p>
          
          </motion.div>
        </div>

        {afterQuote.map(renderProject)}

      </div>

      <Link
        href="/projects"
        className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:opacity-60 transition-opacity"
      >
        Explore our Projects
      </Link>
    </section>
  );
}
