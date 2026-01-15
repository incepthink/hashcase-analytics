"use client";

import { useEffect } from "react";

/**
 * Custom hook to scroll to the top of the page on component mount
 * Useful for detail pages that should start at the top when navigated to
 *
 * @param behavior - Scroll behavior: 'auto' (instant) or 'smooth'
 * @param deps - Optional dependency array to re-trigger scroll
 */
export function useScrollToTop(
  behavior: ScrollBehavior = "auto",
  deps: React.DependencyList = []
) {
  useEffect(() => {
    // Use requestAnimationFrame to ensure the scroll happens after
    // the browser has painted the new route
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    });
  }, deps);
}
