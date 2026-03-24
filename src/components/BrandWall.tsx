"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGsapPlugins, getScroller, prefersReducedMotion } from "@/lib/motion";

const brands = [
  "Nova Bank", "Nexus AI", "Island Pulse", "Vortex Tech", "Midas Luxury", 
  "Aura Digital", "Zenith Media", "Orbit Systems", "Prime Assets", "Eclipse Global",
  "Aura Digital", "Zenith Media", "Orbit Systems", "Prime Assets", "Eclipse Global"
];

export default function BrandWall() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    if (reduced) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".brand-item");

      // Initial 3D scatter
      items.forEach((item, i) => {
          gsap.set(item, {
              z: (i % 3) * -200,
              y: (i % 2 === 0 ? 50 : -50),
              rotateX: (i % 2 === 0 ? 15 : -15),
              opacity: 0,
          });
      });

      gsap.fromTo(items, 
        { 
          opacity: 0, 
        },
        {
          opacity: 1,
          duration: 1.6,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller,
            start: "top 75%",
            once: true
          }
        }
      );

      // 3D Orbit Flight on scroll
      gsap.to(items, {
        y: (i) => (i % 2 === 0 ? -120 : 120),
        z: (i) => (i % 3 === 0 ? 300 : -300),
        rotateX: (i) => (i % 2 === 0 ? 25 : -25),
        rotateY: (i) => (i % 5 === 0 ? 30 : -30),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      // Background pulse intensity increases on scroll
      gsap.to(".brand-glow", {
        opacity: 0.15,
        scale: 1.8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 md:py-16 bg-background overflow-hidden"
    >
      <div className="_container relative z-10">
        <div className="mb-16 md:mb-24 text-center max-w-4xl mx-auto">
          <span className="mb-6 inline-block text-[11px] font-black uppercase tracking-[0.8em] text-accent/60">Legacy Partners</span>
          <h2 className="pb-1 font-heading text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.92] tracking-tighter text-foreground">
            Driven by the <br />
            <span className="text-black/15 italic font-light">standard setters</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14 px-4 perspective-[2000px] transform-style-3d">
          {brands.map((brand, i) => (
            <div 
              key={i}
              className="brand-item group relative w-40 h-24 md:w-64 md:h-40 flex items-center justify-center rounded-[2rem] border border-black/5 bg-gradient-to-br from-white/90 to-black/[0.02] transition-all duration-700 hover:border-accent/40 hover:bg-white will-change-transform"
            >
              <div className="brand-shine absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <span className="relative z-10 text-xs md:text-lg font-black uppercase tracking-widest text-black/10 group-hover:text-foreground group-hover:scale-110 transition-all duration-700">
                {brand}
              </span>
              
              <div className="absolute top-4 right-4 h-1 w-1 rounded-full bg-accent/20 group-hover:scale-150 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      <div className="brand-glow absolute top-1/2 left-1/4 h-[40vw] w-[40vw] rounded-full bg-accent/5 blur-[160px] pointer-events-none opacity-30" />
      <div className="brand-glow absolute bottom-1/4 right-1/4 h-[30vw] w-[30vw] rounded-full bg-secondary/5 blur-[140px] pointer-events-none opacity-20" />
    </section>
  );
}
