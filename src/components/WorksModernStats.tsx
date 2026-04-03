"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGsapPlugins, getScroller, prefersReducedMotion } from "@/lib/motion";

const stats = [
  {
    value: 12,
    suffix: "+",
    label: "Global Awards",
    desc: "Recognized for creative excellence at the highest level of digital craft.",
  },
  {
    value: 95,
    suffix: "%",
    label: "Loyalty Rate",
    desc: "Long-term partnerships founded on performance, trust, and evolution.",
  },
  {
    value: 200,
    suffix: "+",
    label: "Live Platforms",
    desc: "High-performance digital products shipped for companies worldwide.",
  },
  {
    value: 14,
    suffix: "m",
    label: "Global Reach",
    desc: "Connecting brands with millions of diverse users through cinematic motion.",
  },
];

export default function WorksModernStats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".stat-panel");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: reduced ? 0 : 64, opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 0.9,
            delay: i * 0.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              scroller,
              start: "top 86%",
              once: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      <div className="_container" style={{ marginTop: '400px' }}>
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-4 inline-block text-[10px] font-black uppercase leading-[1.35] tracking-[0.45em] text-accent">
            Performance
          </span>
          <h2 className="font-heading text-4xl font-black uppercase leading-[1.02] tracking-tighter text-foreground md:text-6xl">
            Proven outcomes
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="stat-panel relative overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white shadow-[0_20px_56px_rgba(0,0,0,0.06)]"
            style={{ padding: '3rem' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] via-transparent to-secondary/[0.04]" />
            <div className="relative z-10 break-words" style={{ paddingLeft: '1rem' }}>
              <span className="mb-4 inline-block text-[10px] font-black uppercase leading-[1.35] tracking-[0.45em] text-accent">
                Metric {i + 1}
              </span>
              <h2 className="font-heading text-[5.5rem] sm:text-[6.5rem] md:text-[5rem] lg:text-[6rem] xl:text-[6.5rem] font-black uppercase leading-[0.9] tracking-normal text-foreground">
                <span className="inline-flex items-baseline gap-[0.02em]">
                  <span>{stat.value}</span>
                  <span className="text-[0.6em] text-black/35">{stat.suffix}</span>
                </span>
              </h2>
              <div className="mt-6 md:mt-8">
                <p className="text-xl font-black uppercase tracking-tight text-foreground md:text-2xl">
                  {stat.label}
                </p>
                <div className="my-4 h-px w-20 bg-accent/35" />
                <p className="max-w-xl text-sm sm:text-base font-medium leading-relaxed text-black/55">
                  {stat.desc}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-4 right-6 text-[4rem] font-black leading-none text-black/[0.04] md:text-[5rem]">
              0{i + 1}
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
