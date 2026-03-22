"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function RecognitionBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    // Standard GSAP Ticker logic for seamless loop
    const content = ticker.children[0] as HTMLElement;
    const contentWidth = content?.offsetWidth ?? 0;
    if (contentWidth <= 0) return;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" },
    });

    tl.to(ticker, {
      x: -contentWidth,
      duration: 30,
    });

    return () => {
      tl.kill();
    };
  }, []);

  const items = [
    "Most Awarded Creative & AI Agency",
    "Digital Excellence from Colombo",
    "Immersive WebGL & AI Experiences",
    "Global Reach, Local Depth",
    "Future-Proof Design Systems"
  ];

  return (
    <div 
      ref={containerRef}
      className="relative py-14 md:py-24 bg-background border-y border-white/5 overflow-hidden group"
    >
      <div 
        ref={tickerRef} 
        className="flex whitespace-nowrap will-change-transform"
      >
        {/* Render twice for seamless loop */}
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-12 md:gap-24 px-6 md:px-12">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-12 md:gap-24">
                <span className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white/20 transition-colors duration-700 group-hover:text-white/40 italic">
                  {item}
                </span>
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-accent shadow-[0_0_15px_rgba(0,191,255,0.5)]" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Decorative gradient overlays */}
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
