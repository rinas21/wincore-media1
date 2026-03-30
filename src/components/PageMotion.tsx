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

function motionTier(section: HTMLElement): "tier1" | "tier2" {
  const v = section.getAttribute("data-page-motion")?.trim().toLowerCase();
  if (v === "tier2") return "tier2";
  return "tier1";
}

export default function PageMotion({ children }: PageMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const preloaderDone = usePreloaderDone();
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!rootRef.current) return;

    if (!lenis || !preloaderDone) return;

    animatedRef.current = false;

    registerGsapPlugins();

    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-page-motion]")
      );

      if (sections.length === 0) return;

      sections.forEach((section) => {
        const q = gsap.utils.selector(section);
        const targets = q("[data-reveal]") as HTMLElement[];
        const tier = motionTier(section);

        if (reduced) {
          const els = targets.length ? targets : [section];
          gsap.set(els, {
            autoAlpha: 1,
            y: 0,
            clearProps: "transform,opacity",
          });
          return;
        }

        const scrollTrigger = {
          trigger: section,
          start: "top 82%",
          once: true,
          scroller,
        };

        if (targets.length === 0) {
          const from =
            tier === "tier1"
              ? { y: 32, opacity: 0 }
              : { y: 14, opacity: 0 };
          const to =
            tier === "tier1"
              ? {
                  y: 0,
                  opacity: 1,
                  duration: 0.65,
                  ease: "power3.out" as const,
                  scrollTrigger,
                  clearProps: "transform,opacity",
                }
              : {
                  y: 0,
                  opacity: 1,
                  duration: 0.42,
                  ease: "power2.out" as const,
                  scrollTrigger,
                  clearProps: "transform,opacity",
                };
          gsap.fromTo(section, from, to);
          return;
        }

        if (tier === "tier1") {
          gsap.fromTo(
            targets,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.65,
              ease: "power3.out",
              scrollTrigger,
              clearProps: "transform,opacity",
            }
          );
        } else {
          gsap.fromTo(
            targets,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.42,
              ease: "power2.out",
              scrollTrigger,
              clearProps: "transform,opacity",
            }
          );
        }
      });

      scheduleScrollTriggerRefresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, [lenis, preloaderDone]);

  return (
    <div ref={rootRef} className="page-motion-root relative">
      {children}
    </div>
  );
}
