"use client";
import { useEffect } from "react";

export function TypeKitLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/xvi4mxs.css";
    document.head.appendChild(link);
  }, []);
  return null;
}
