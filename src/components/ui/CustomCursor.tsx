"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const isHovering = useRef(false);
  const scaleValue = useMotionValue(1);

  // Dot — tight spring, nearly instant
  const dotX = useSpring(mouseX, { stiffness: 900, damping: 35, mass: 0.15 });
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 35, mass: 0.15 });

  // Ring — looser spring for elegant trail
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.4 });
  const ringScale = useSpring(scaleValue, { stiffness: 250, damping: 22, mass: 0.3 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hoverable = t.tagName === "A" || t.tagName === "BUTTON" || t.closest("a") || t.closest("button");
      if (hoverable && !isHovering.current) {
        isHovering.current = true;
        scaleValue.set(1.8);
      } else if (!hoverable && isHovering.current) {
        isHovering.current = false;
        scaleValue.set(1);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [mouseX, mouseY, scaleValue]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: none)").matches) {
      const style = document.createElement("style");
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
      return () => style.remove();
    }
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <div className="hidden md:contents">
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-white mix-blend-difference pointer-events-none z-9999"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: ringScale,
        }}
      />
      {/* Precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white mix-blend-difference pointer-events-none z-10000"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
}
