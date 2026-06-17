"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const isHovering = useRef(false);
  const outerScale = useMotionValue(1);

  // Inner diamond — near-instant tracking
  const innerX = useSpring(mouseX, { stiffness: 2000, damping: 60, mass: 0.05 });
  const innerY = useSpring(mouseY, { stiffness: 2000, damping: 60, mass: 0.05 });

  // Outer diamond — relaxed lag for a trailing effect
  const outerX = useSpring(mouseX, { stiffness: 130, damping: 20, mass: 0.7 });
  const outerY = useSpring(mouseY, { stiffness: 130, damping: 20, mass: 0.7 });
  const outerScaleSpring = useSpring(outerScale, { stiffness: 220, damping: 26 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hoverable =
        t.tagName === "A" || t.tagName === "BUTTON" || t.closest("a") || t.closest("button");
      if (hoverable && !isHovering.current) {
        isHovering.current = true;
        outerScale.set(2.4);
      } else if (!hoverable && isHovering.current) {
        isHovering.current = false;
        outerScale.set(1);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [mouseX, mouseY, outerScale]);

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
      {/* Outer diamond outline — lags behind */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: 45,
          scale: outerScaleSpring,
          width: 24,
          height: 24,
          border: "1.5px solid white",
        }}
      />

      {/* Inner filled diamond — precise */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-10000 mix-blend-difference"
        style={{
          x: innerX,
          y: innerY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: 45,
          width: 7,
          height: 7,
          backgroundColor: "white",
        }}
      />
    </div>
  );
}
