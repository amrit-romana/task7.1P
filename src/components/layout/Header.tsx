"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getDbData } from "@/actions/admin";

const defaultNavLinks = [
  { name: "About Us", href: "/about" },
    { name: "Projects", href: "/projects" },
  { name: "Finishes", href: "/materials" },
  { name: "Products", href: "/shop" },
  { name: "Journal", href: "/blog" },
  { name: "Enquire", href: "/enquire" },
];

export function Header({ theme = "light", navLinks: propNavLinks }: { theme?: "light" | "dark", navLinks?: any[] }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [localLinks, setLocalLinks] = useState(propNavLinks || defaultNavLinks);

  // Fetch dynamic links on client when not provided via props (e.g. non-home pages)
  useEffect(() => {
    if (!propNavLinks) {
      getDbData().then(db => {
        if (db && db.navLinks && db.navLinks.length > 0) {
          setLocalLinks(db.navLinks);
        }
      });
    }
  }, [propNavLinks]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Update background color based on position
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide/show navbar on scroll direction
    if (latest > 100 && latest > previous && !menuOpen) {
      setIsHidden(true); // scrolling down
    } else if (latest < previous || latest < 50) {
      setIsHidden(false); // scrolling up
    }
  });

  const textColorClass = isScrolled
    ? "text-[var(--color-charcoal)]"
    : theme === "dark" ? "text-[var(--color-charcoal)]" : "text-[var(--color-parchment)]";

  return (
    <>
      <motion.header
        animate={{ y: isHidden ? "-100%" : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-40 px-6 py-5 md:px-12 flex justify-between items-center transition-colors duration-700 pointer-events-none ${
          isScrolled ? "bg-[var(--color-parchment)] shadow-sm py-4" : "bg-transparent"
        }`}
      >
        <div className={`pointer-events-auto transition-colors duration-700 ${textColorClass} flex-shrink-0`}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-40 h-11 sm:w-60 sm:h-16 md:w-96 md:h-20 lg:w-[32rem] lg:h-24">
              <Image
                src="/images/header-logo-initial.png"
                alt="Renaissance Decor Initial Logo"
                fill
                className={`object-contain object-left transition-opacity duration-700 ${textColorClass === "text-[var(--color-parchment)]" ? "opacity-100" : "opacity-0"}`}
                priority
              />
              <Image
                src="/images/header-logo-scroll.png"
                alt="Renaissance Decor Scroll Logo"
                fill
                className={`object-contain object-left transition-opacity duration-700 ${textColorClass === "text-[var(--color-charcoal)]" ? "opacity-100" : "opacity-0"}`}
                priority
              />
            </div>
          </Link>
        </div>

        <nav className={`hidden md:flex flex-row gap-6 lg:gap-8 pointer-events-auto items-center transition-colors duration-700 ${textColorClass}`}>
          {localLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-sans font-bold text-xs md:text-sm uppercase tracking-[0.15em] hover:underline underline-offset-[6px] decoration-[1px] transition-all"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className={`md:hidden pointer-events-auto font-bold text-[10px] uppercase tracking-widest font-sans transition-colors duration-700 ${textColorClass}`}
        >
          Menu
        </button>
      </motion.header>

      {/* Fullscreen Mobile Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-6 md:top-12 md:right-12 font-sans font-bold text-[10px] uppercase tracking-widest text-[var(--color-parchment)] opacity-50 hover:opacity-100 transition-opacity p-2"
            >
              Close
            </button>

            <nav className="flex flex-col gap-8 items-center mt-12">
              {localLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-3xl md:text-5xl tracking-[0.2em] uppercase text-[var(--color-parchment)] hover:opacity-50 transition-opacity block py-2"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-12 font-serif text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[var(--color-parchment)]"
            >
              Renaissance Decor
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
