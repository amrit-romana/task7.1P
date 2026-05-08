"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "./SmoothScroll";
import { Preloader } from "./Preloader";
import { Footer } from "./Footer";
import { CustomCursor } from "../ui/CustomCursor";

export function FrontendWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // If we are in the admin section, DO NOT render the smooth scroll, custom cursor, or the public footer.
  // We want native scroll and native cursor for the admin panel.
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Otherwise, wrap the standard public frontend layout
  return (
    <SmoothScroll>
      <CustomCursor />
      <Preloader />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
