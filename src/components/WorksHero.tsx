"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  registerGsapPlugins,
  prefersReducedMotion,
} from "@/lib/motion";
import { useLenis } from "@/context/LenisContext";
import { usePreloaderDone } from "@/context/PreloaderContext";

gsap.registerPlugin(ScrollTrigger);

export default function WorksHero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const preloaderDone = usePreloaderDone();

  useEffect(() => {
    if (!rootRef.current || !lenis || !preloaderDone) return;

    registerGsapPlugins();
    const reduced = prefersReducedMotion();
    if (reduced) return;

    let split: SplitType | undefined;

    const ctx = gsap.context(() => {
      const h1 = titleRef.current?.querySelector("h1");
      if (h1) {
        split = new SplitType(h1, { types: "chars,lines" });
        gsap.fromTo(
          split.chars,
          { opacity: reduced ? 1 : 0, y: reduced ? 0 : 36 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0 : 1.15,
            stagger: reduced ? 0 : 0.018,
            ease: "power4.out",
          },
        );
      }

      gsap.fromTo(
        ".hero-sub",
        { y: reduced ? 0 : 30, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.95,
          ease: "power4.out",
          stagger: reduced ? 0 : 0.12,
          delay: reduced ? 0 : 0.35,
        },
      );
    }, rootRef);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [lenis, preloaderDone]);

  return (
    <section 
      ref={rootRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background px-5 pt-40 pb-16 sm:px-6 md:px-10 md:pt-48 md:pb-20 lg:px-12"
    >
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(0,136,204,0.06)_0%,rgba(255,255,255,0.9)_72%)]" />
      
      <div className="relative z-10 w-full max-w-[1240px] text-center">
        <div ref={titleRef} className="flex flex-col items-center">
          <span className="hero-sub mb-8 inline-flex items-center gap-4 rounded-full bg-black/[0.04] px-6 py-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_15px_rgba(0,136,204,0.5)] animate-pulse" />
            <span className="text-[11px] font-black uppercase leading-[1.4] tracking-[0.42em] text-black/40">Selected Archive 2024</span>
          </span>
          
          <h1 className="font-heading text-[16vw] sm:text-[14vw] md:text-[10vw] lg:text-[9vw] font-black uppercase leading-[0.96] tracking-tighter text-foreground">
            World-class <br />
            <span className="text-black/20 italic font-light tracking-[-0.08em]">creativity</span>
          </h1>
          
          <p className="hero-sub mx-auto mt-16 max-w-3xl text-lg font-light leading-relaxed text-black/50 md:text-xl md:leading-relaxed">
            Crafting cinematic digital experiences that blend
            <span className="text-black/80 font-medium italic underline decoration-accent/30 underline-offset-8"> strategic logic with creative wonder.</span>
          </p>

          {/* Mouse hint icon logic is handled via GSAP entrance */}
          <div className="hero-sub mt-20 flex flex-col items-center animate-bounce-slow">
             <div className="w-6 h-10 rounded-full border border-black/10 flex items-start justify-center p-1.5">
               <div className="w-1 h-2 rounded-full bg-accent" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
