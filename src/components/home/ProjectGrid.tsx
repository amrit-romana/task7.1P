"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  { id: 1, title: "Sorrento Residence", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200", aspect: "aspect-[3/4]" },
  { id: 2, title: "Toorak Estate", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200", aspect: "aspect-square" },
  { id: 3, title: "Armadale Gallery", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200", aspect: "aspect-[4/5]" },
  { id: 4, title: "South Yarra House", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200", aspect: "aspect-square" },
  { id: 5, title: "Mornington Villa", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200", aspect: "aspect-[3/4]" },
  { id: 6, title: "Malvern Project", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200", aspect: "aspect-square" },
];

export function ProjectGrid() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-[var(--color-parchment)] max-w-[1800px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: (i % 3) * 0.1, ease: "easeOut" }}
            className={`group cursor-pointer relative overflow-hidden bg-[var(--color-linen)] ${project.aspect} ${i === 1 || i === 4 ? "md:mt-16 lg:mt-24" : ""}`}
          >
            <motion.div 
              className="absolute inset-0 w-full h-full origin-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] }}
            >
              <Image 
                src={project.image} 
                alt={project.title} 
                fill 
                className="object-cover" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-[#000000]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
              <h3 className="font-serif text-[var(--color-parchment)] text-xl md:text-2xl tracking-wide">{project.title}</h3>
              <p className="font-sans text-[var(--color-parchment)] text-[10px] tracking-[0.2em] font-light uppercase mt-2">Venetian Plaster</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
