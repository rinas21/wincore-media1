"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/context/LenisContext";
import { usePreloaderDone } from "@/context/PreloaderContext";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type PageMotionProps = {
  children: React.ReactNode;
};

export default function PageMotion({ children }: PageMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const preloaderDone = usePreloaderDone();
  // Track whether we've already set up animations for this mount to avoid
  // double-initialisation when StrictMode double-invokes effects.
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!rootRef.current) return;

    // Block until Lenis + scrollerProxy are both wired inside ClientProvider.
    // lenis becomes truthy only AFTER scrollerProxy is configured, so this
    // single guard is sufficient.
    if (!lenis || !preloaderDone) return;

    // Reset guard when lenis instance recreates (e.g. route change).
    animatedRef.current = false;

    // Idempotent — safe to call many times.
    registerGsapPlugins();

    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-page-motion]")
      );

      if (sections.length === 0) return;

      if (reduced) {
        // Skip animation for users who prefer reduced motion.
        gsap.set(sections, {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
        return;
      }

      sections.forEach((section, index) => {
        gsap.fromTo(
          section,
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay: index === 0 ? 0.05 : 0,
            ease: "expo.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              once: true,
              scroller,
            },
          }
        );
      });

      // Fonts + Lenis can shift layout after the first paint — refresh ST so
      // trigger positions are recalculated correctly.
      scheduleScrollTriggerRefresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, [lenis, preloaderDone]); // Re-run whenever the lenis instance changes (e.g. route change).

  return (
    <div ref={rootRef} className="page-motion-root relative">
      {children}
    </div>
  );
}
