"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";

const TESTIMONIALS = [
  {
    quote: "The mastery of Renaissance Decor elevated our space beyond imagination. Their architectural finishes are nothing short of structural poetry.",
    name: "Isabella Montgomery",
    title: "Principal Architect, MH Studio"
  },
  {
    quote: "We spent months searching for artisans who understand true refinement. Renaissance Delivered a tadelakt surface that transformed the entire property.",
    name: "Jonathan Reeves",
    title: "Private Client"
  },
  {
    quote: "Exceptional craftsmanship. The microcement application across our commercial floors achieved exactly the minimal luxury aesthetic we demanded.",
    name: "Eleanor Vance",
    title: "Design Director"
  }
];

export function TestimonialSection({ testimonials = [] }: { testimonials?: any[] }) {
  const [index, setIndex] = useState(0);
  const items = testimonials.length > 0 ? testimonials : [];

  const nextTestimonial = () => setIndex((prev) => (items.length > 0 ? (prev + 1) % items.length : 0));
  const prevTestimonial = () => setIndex((prev) => (items.length > 0 ? (prev - 1 + items.length) % items.length : 0));

  return (
    <section className="w-full bg-[#000000] text-[var(--color-parchment)] py-32 md:py-48 px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden group">
      
      <FadeIn direction="up" className=" w-full text-center flex flex-col items-center gap-8 relative z-10 min-h-[300px] justify-center">
        <span className="font-serif text-5xl md:text-7xl leading-none opacity-40 absolute -top-12 left-1/2 -translate-x-1/2">“</span>
        
        <AnimatePresence mode="wait">
          {items.length > 0 && (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col items-center gap-8 mt-12 w-full cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -100) nextTestimonial();
                else if (swipe > 100) prevTestimonial();
              }}
            >
              <h3 className="font-serif text-xl md:text-3xl lg:text-4xl leading-[1.5] tracking-wide text-[#EAE8E4]">
                {items[index].quote}
              </h3>
              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-[#EAE8E4]">
                  {items[index].name}
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-50">
                  {items[index].title}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeIn>

      {/* Pagination indicators */}
      <FadeIn direction="up" delay={0.4} className="flex gap-2 mt-12 z-20">
        {items.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`h-1 transition-all duration-300 ${i === index ? "w-8 bg-[var(--color-parchment)]" : "w-2 bg-[var(--color-parchment)]/30"} rounded-full`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </FadeIn>
    </section>
  );
}

// Swipe helper
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;
