"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Preloader() {
  const pathname = usePathname();
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 900);  // BG starts to fade at 0.9s
    const t2 = setTimeout(() => setStage(2), 1500); // Logo fades and unmounts
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          key="preloader-container"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Background Layer (Fades at stage 1) using precisely #000000 as requested */}
          <motion.div 
            className="absolute inset-0 bg-[#000000]"
            initial={{ opacity: 1 }}
            animate={{ opacity: stage === 1 ? 0 : 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          
          {/* Content Layer (Exits at stage 2) - Fades in slowly like HFL */}
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center gap-8 md:gap-12"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-64 h-64 md:w-[36rem] md:h-[36rem] mb-4 md:mb-6"
            >
              <Image
                src="/images/crest-white.png"
                alt="Renaissance Decor Emblem"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
