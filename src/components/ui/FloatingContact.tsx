"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE = "0468 326 303";
const EMAIL = "info@renaissancedecor.com.au";

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const rowVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 },
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.18 } },
};

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-9000 flex flex-col items-end gap-2.5 pointer-events-none">
      <AnimatePresence>
        {open && (
          <>
            {/* Email row */}
            <motion.a
              href={`mailto:${EMAIL}`}
              custom={1}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-auto flex items-center gap-3 bg-espresso text-parchment px-4 py-3 hover:bg-charcoal transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              <MailIcon />
              <span className="font-futura text-[10px] tracking-[0.18em] uppercase whitespace-nowrap">
                {EMAIL}
              </span>
            </motion.a>

            {/* Phone row */}
            <motion.a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              custom={0}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-auto flex items-center gap-3 bg-espresso text-parchment px-4 py-3 hover:bg-charcoal transition-colors duration-200"
            >
              <PhoneIcon />
              <span className="font-futura text-[10px] tracking-[0.18em] uppercase whitespace-nowrap">
                {PHONE}
              </span>
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto w-11 h-11 bg-espresso text-parchment flex items-center justify-center hover:bg-charcoal transition-colors duration-200"
        aria-label={open ? "Close contact panel" : "Contact us"}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {open ? <CloseIcon /> : <PhoneIcon />}
      </motion.button>
    </div>
  );
}
