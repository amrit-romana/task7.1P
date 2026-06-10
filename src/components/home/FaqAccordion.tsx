"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FaqData } from "@/actions/faqs";

export function FaqAccordion({ faqs }: { faqs: FaqData[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <div className="w-full flex flex-col">
      {faqs.map((faq, i) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={`border-t border-[var(--color-charcoal)]/10 ${i === faqs.length - 1 ? "border-b" : ""}`}
          >
            <button
              className="w-full flex items-start justify-between py-7 text-left gap-8 group"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
            >
              <span className="font-sans font-medium text-base md:text-lg text-[var(--color-charcoal)] leading-snug flex-1">
                {faq.question}
              </span>
              <span
                className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-full border border-[var(--color-charcoal)]/25 flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-charcoal)]/60 ${
                  isOpen ? "rotate-45 bg-[var(--color-charcoal)] border-[var(--color-charcoal)]" : ""
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isOpen ? "var(--color-parchment)" : "currentColor"}
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="font-sans text-sm md:text-base text-[var(--color-charcoal)]/65 leading-relaxed pb-7 max-w-2xl">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
