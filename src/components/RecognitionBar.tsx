"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

const items = [
  "Most Awarded Creative & AI Agency",
  "Digital Excellence from Colombo",
  "Immersive WebGL & AI Experiences",
  "Global Reach, Local Depth",
  "Future-Proof Design Systems",
];

export default function RecognitionBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const measure = measureRef.current;
    if (!track || !measure) return;
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(track, { x: 0 });
      return;
    }

    const run = () => {
      tweenRef.current?.kill();
      gsap.set(track, { x: 0 });
      const w = measure.offsetWidth;
      if (w <= 0) return;

      tweenRef.current = gsap.to(track, {
        x: -w,
        duration: 42,
        ease: "none",
        repeat: -1,
      });
    };

    run();
    const ro = new ResizeObserver(() => run());
    ro.observe(measure);
    const t = requestAnimationFrame(run);

    return () => {
      cancelAnimationFrame(t);
      ro.disconnect();
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div data-reveal className="group relative overflow-hidden border-y border-black/5 bg-background py-10 md:py-16">
      <div className="relative">
        <div ref={trackRef} className="flex w-max will-change-transform">
          {/* One measured strip, duplicated for seamless loop */}
          <div ref={measureRef} className="flex shrink-0 items-center gap-10 px-6 md:gap-20 md:px-12">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-10 md:gap-20">
                <span className="text-xl font-black uppercase italic tracking-tighter text-black/15 transition-colors duration-700 group-hover:text-black/35 md:text-4xl lg:text-5xl">
                  {item}
                </span>
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[var(--shadow-accent-dot)] md:h-2.5 md:w-2.5" />
              </div>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-10 px-6 md:gap-20 md:px-12" aria-hidden>
            {items.map((item, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-10 md:gap-20">
                <span className="text-xl font-black uppercase italic tracking-tighter text-black/15 md:text-4xl lg:text-5xl">
                  {item}
                </span>
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[var(--shadow-accent-dot)] md:h-2.5 md:w-2.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background via-background/90 to-transparent md:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background via-background/90 to-transparent md:w-48" />
    </div>
  );
}
