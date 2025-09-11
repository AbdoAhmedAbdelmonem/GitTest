"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Small timeout to ensure the page has loaded
      setTimeout(() => {
        const id = window.location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          // Adjust for header height with an offset
          const yOffset = -80; // Adjust this value based on your header height
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 500); // Increased timeout for more reliable scrolling
    }
  }, [pathname]);

  return null;
}