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
          // from — must re-specify so GSAP doesn't try to tween from the
          // already-resolved clearProps on a previous scroll.
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            delay: index === 0 ? 0.12 : 0,
            ease: "expo.out",
            immediateRender: false,
            clearProps: "transform",
            scrollTrigger: {
              trigger: section,
              // Relaxed the start threshold slightly to ensure late-page elements (like footers) 
              // fire even if they are already visible without much scroll room remaining.
              start: index === 0 ? "top 98%" : "top 95%",
              end: "top 65%",
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
