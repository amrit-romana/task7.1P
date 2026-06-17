"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const isHovering = useRef(false);
  const outerScale = useMotionValue(1);

  const innerX = useSpring(mouseX, { stiffness: 2000, damping: 60, mass: 0.05 });
  const innerY = useSpring(mouseY, { stiffness: 2000, damping: 60, mass: 0.05 });

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
    <div>
      <motion.img
        src="https://i.ibb.co/gF3nFy2k/RD-Crest-On-Black-No-BG.png"
        alt="cursor-logo"
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: innerX,
          y: innerY,
          translateX: "-50%",
          translateY: "-50%",
          width: 40,
          height: 40,
          scale: outerScaleSpring,
          zIndex: 10000,
          mixBlendMode: "difference",
        }}
      />
    </div>
  );
}
