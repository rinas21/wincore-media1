"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGsapPlugins, getScroller, prefersReducedMotion } from "@/lib/motion";

const brands = [
  {
    name: "Nova Bank",
    image:
      "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Nexus AI",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Island Pulse",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Vortex Tech",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Midas Luxury",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Aura Digital",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Zenith Media",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Orbit Systems",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Prime Assets",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Eclipse Global",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1200",
  },
];

export default function BrandWall() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".brand-reveal-item");
      gsap.fromTo(
        items,
        {
          y: reduced ? 0 : 36,
          opacity: reduced ? 1 : 0,
          scale: reduced ? 1 : 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: reduced ? 0 : 0.8,
          stagger: reduced ? 0 : 0.06,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller,
            start: "top 84%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-background pt-12 md:pt-16 z-20 overflow-hidden"
    >
      <div className="_container relative z-10">
        <div className="mb-16 md:mb-24 text-center max-w-4xl mx-auto">
          <span className="mb-6 inline-block text-[11px] font-black uppercase leading-[1.35] tracking-[0.62em] text-accent/60">Legacy Partners</span>
          <h2 className="pb-1 font-heading text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.98] tracking-tighter text-foreground">
            Driven by the <br />
            <span className="text-black/15 italic font-light">standard setters</span>
          </h2>
        </div>

        <ul className="brand-codepen-grid mb-32 md:mb-48 lg:mb-56">
          {brands.map((brand, i) => (
            <li key={i} className="brand-reveal-item brand-card-li">
              <div className="brand-card-details">
                <div
                  className="brand-card-bg"
                  style={{ backgroundImage: `url(${brand.image})` }}
                  aria-hidden="true"
                />
                <div
                  className="brand-card-cut"
                  style={{ backgroundImage: `url(${brand.image})` }}
                  aria-hidden="true"
                />
                <p aria-hidden="true">{brand.name}</p>
                <p aria-hidden="true">{brand.name}</p>
                <h3>{brand.name}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute top-1/2 left-1/4 h-[40vw] w-[40vw] rounded-full bg-accent/5 blur-[160px] pointer-events-none opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 h-[30vw] w-[30vw] rounded-full bg-secondary/5 blur-[140px] pointer-events-none opacity-15" />
    </section>
  );
}
