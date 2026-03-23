"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PageMotionProps = {
  children: React.ReactNode;
};

export default function PageMotion({ children }: PageMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const scroller = document.documentElement;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-page-motion]");

      gsap.from(rootRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });

      sections.forEach((section, index) => {
        gsap.from(section, {
          y: 84,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          delay: index === 0 ? 0.1 : 0,
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: index === 0 ? "top 95%" : "top 88%",
            once: true,
            scroller,
          },
        });

        gsap.to(section, {
          yPercent: index % 2 === 0 ? -4 : -7,
          scale: 0.995,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            scroller,
          },
        });
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="page-motion-enter relative">
      {children}
    </div>
  );
}
