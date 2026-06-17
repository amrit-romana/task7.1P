"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TestimonialSection({ testimonials = [] }: { testimonials?: any[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const items = testimonials.length > 0 ? testimonials : [];

  const next = () => {
    if (!items.length) return;
    setDirection(1);
    setIndex((prev) => (prev + 1) % items.length);
  };
  const prev = () => {
    if (!items.length) return;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section className="w-full bg-[#000000] text-parchment min-h-[28rem] md:min-h-[32rem] px-6 md:px-12 flex flex-col justify-between relative overflow-hidden py-16 md:py-0">

      {/* Section label */}
      <FadeIn direction="up" className="flex items-center gap-4 pt-12 w-full">
        <span className="flex-1 h-px bg-parchment/15" />
        <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-parchment/50 whitespace-nowrap">
          Client Voices
        </span>
        <span className="flex-1 h-px bg-parchment/15" />
      </FadeIn>

      {/* Giant decorative quote mark */}
      <span
        aria-hidden="true"
        className="font-serif absolute top-8 left-1/2 -translate-x-1/2 text-[14rem] leading-none text-parchment select-none pointer-events-none"
        style={{ opacity: 0.025, lineHeight: 1, userSelect: "none" }}
      >
        &ldquo;
      </span>

      {/* Quote content — fixed-height flex centre, full width */}
      <div className="flex-1 flex items-center relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          {items.length > 0 && (
            <motion.div
              key={index}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 32, filter: "blur(4px)" }),
                center: { opacity: 1, x: 0, filter: "blur(0px)" },
                exit: (d: number) => ({ opacity: 0, x: d * -32, filter: "blur(4px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full flex flex-col gap-7 text-center cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -8000) next();
                else if (swipe > 8000) prev();
              }}
            >
              <p className="font-serif text-lg md:text-xl lg:text-[1.375rem] leading-[1.6] tracking-[0.01em] text-parchment w-full">
                {items[index].quote}
              </p>

              <div className="flex flex-col items-center gap-3">
                <span className="block w-8 h-px bg-parchment/30" />
                <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.35em] font-bold text-parchment">
                  {items[index].name}
                </span>
                {items[index].title && (
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-parchment/40">
                    {items[index].title}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {items.length > 1 && (
        <FadeIn direction="up" delay={0.3} className="flex items-center justify-center gap-8 pb-10 z-20">
          <button
            onClick={prev}
            className="p-2.5 rounded-full border border-parchment/15 text-parchment/50 hover:border-parchment/50 hover:text-parchment transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                className={`transition-all duration-500 rounded-full ${
                  i === index
                    ? "w-6 h-0.75 bg-parchment"
                    : "w-0.75 h-0.75 bg-parchment/25 hover:bg-parchment/50"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2.5 rounded-full border border-parchment/15 text-parchment/50 hover:border-parchment/50 hover:text-parchment transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </FadeIn>
      )}
    </section>
  );
}
