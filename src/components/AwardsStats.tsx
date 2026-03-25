"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import SplitType from "split-type";
import { ArrowUpRight } from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

const stats = [
  {
    value: 12,
    suffix: "+",
    label: "Awards Won",
    desc: "Local and international creative excellence recognised across categories.",
    accent: "from-accent/[0.08] to-transparent",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=800",
  },
  {
    value: 95,
    suffix: "%",
    label: "Client Retention",
    desc: "Clients stay because results compound and trust is earned, not assumed.",
    accent: "from-secondary/[0.07] to-transparent",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
  },
  {
    value: 200,
    suffix: "+",
    label: "Campaigns Delivered",
    desc: "Full-funnel campaigns across every vertical — built to perform.",
    accent: "from-white/[0.05] to-transparent",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    value: 10,
    suffix: "y",
    label: "Years in the Game",
    desc: "A decade of digital authority, craft, and measurable outcomes.",
    accent: "from-accent/[0.05] to-secondary/[0.03]",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=800",
  },
];

export default function AwardsStats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      // ── Heading char reveal ──
      const headingEl = sectionRef.current?.querySelector(".aw-heading") as HTMLElement | null;
      if (headingEl) {
        const split = new SplitType(headingEl, { types: "chars" });
        splits.push(split);
        if (split.chars) {
          gsap.fromTo(
            split.chars,
            { yPercent: reduced ? 0 : 110, opacity: reduced ? 1 : 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: reduced ? 0 : 1,
              stagger: 0.018,
              ease: "expo.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: headingEl, scroller, start: "top 85%", once: true },
            }
          );
        }
      }

      gsap.fromTo(
        ".aw-kicker",
        { y: reduced ? 0 : 20, opacity: reduced ? 1 : 0 },
        {
          y: 0, opacity: 1, duration: reduced ? 0 : 0.8, ease: "expo.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".aw-kicker", scroller, start: "top 90%", once: true },
        }
      );
      gsap.fromTo(
        ".aw-body",
        { y: reduced ? 0 : 22, opacity: reduced ? 1 : 0 },
        {
          y: 0, opacity: 1, duration: reduced ? 0 : 1, ease: "expo.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".aw-body", scroller, start: "top 90%", once: true },
        }
      );

      // ── Count-up — triggered when each sticky card reaches view ──
      const cards = gsap.utils.toArray<HTMLElement>(".aw-card");
      cards.forEach((card, i) => {
        const numEl = card.querySelector<HTMLElement>(".aw-num");
        if (!numEl) return;
        const target = stats[i].value;
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: reduced ? 0 : 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            scroller,
            start: "top 65%",
            once: true,
          },
          onUpdate() {
            numEl.textContent = Math.round(proxy.val).toString();
          },
        });

        // ── 3D Kinetic Warp Entrance ──
        const isEven = i % 2 === 0;
        
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isEven ? -140 : 140,
            y: 30,
            skewY: isEven ? -6 : 6,
            rotateY: isEven ? 20 : -20,
            scale: 0.9,
            transformPerspective: 1800,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            skewY: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.45,
            ease: "expo.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: card,
              scroller,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    scheduleScrollTriggerRefresh();

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible border-t border-black/5 bg-background pb-20 pt-20 md:pb-28 md:pt-28"
      aria-label="Awards and stats"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-[-20vw] top-1/4 h-[40vw] w-[40vw] rounded-full bg-secondary/5 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-10vw] top-1/2 h-[30vw] w-[30vw] rounded-full bg-accent/5 blur-[80px]" />

      <div className="_container relative z-10">
        {/* ── Header ── */}
        <div className="mb-24 flex flex-col items-start justify-between gap-12 md:flex-row md:items-end px-4 md:px-0">
          <div>
            <span className="aw-kicker mb-8 block text-[10px] font-black uppercase tracking-[0.6em] text-secondary italic">
              Track Record
            </span>
            <h2
              className="aw-heading pb-1 text-[12vw] font-black uppercase leading-[0.9] tracking-tighter md:text-[7vw]"
              style={{ perspective: "800px" }}
            >
              Outcomes<br />
              <span className="text-black/[0.08] italic">that lead</span>
            </h2>
          </div>
          <p className="aw-body max-w-[36ch] text-lg font-light leading-relaxed text-black/40 md:text-2xl">
            Awards are a signal. Outcomes are the standard. We build systems that perform and visuals that move.
          </p>
        </div>

        {/* ── 3D Kinetic Warp Gallery ── */}
        <div className="flex flex-col gap-24 md:gap-32 lg:gap-40">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="aw-card-wrapper perspective-[2000px]"
            >
              <div
                className="aw-card group relative min-h-[340px] md:min-h-[460px] overflow-hidden rounded-[3rem] border border-black/[0.06] bg-gradient-to-br from-white via-white/80 to-black/[0.01] px-12 py-14 shadow-[0_45px_100px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl transition-all duration-700 hover:border-accent/30 hover:shadow-[0_60px_120px_rgba(0,191,255,0.06)] will-change-transform md:px-16 md:py-16 lg:px-24 lg:py-24 transform-gpu"
              >
                {/* Dynamic Shine Trail */}
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-accent/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                {/* Background Image Context - increased visibility and removed muddy blend */}
                <div className="absolute inset-0 z-0 opacity-[0.25] transition-all duration-[1.5s] group-hover:opacity-[0.45] group-hover:scale-105">
                  <Image
                    src={stat.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1400px"
                    priority={i < 2}
                  />
                </div>

                {/* Glass Glint Overlay */}
                <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.5),transparent_40%)]" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  {/* Indicator Header */}
                  <div className="mb-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-[11px] font-black uppercase tracking-[0.6em] text-black/15">
                        {String(i + 1).padStart(2, "0")} <span className="text-black/5 mx-2">/</span> {stats.length}
                      </span>
                      <div className="h-[2px] w-12 bg-accent/20" />
                      <span className="text-[11px] font-black uppercase tracking-[0.55em] text-accent/80">
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/5 bg-black/[0.01] text-black/40 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-700 hover:rotate-45">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Big Projection Number with Vision Stroke */}
                    <div className={`md:col-span-6 flex items-baseline relative ${i % 2 !== 0 ? 'md:justify-end' : ''}`}>
                      <div className="absolute -left-12 -top-12 text-[14rem] font-black text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.08)] select-none leading-none md:text-[18rem]">
                        {stat.value}
                      </div>
                      <div className="flex items-baseline relative z-10 transition-transform duration-700 group-hover:scale-105 will-change-transform">
                        <span className="aw-num text-[7rem] md:text-[10rem] lg:text-[12rem] font-black leading-none tracking-tighter text-foreground" data-target={stat.value}>
                          0
                        </span>
                        <span className="mb-[0.2em] ml-2 text-[3.5rem] md:text-[5.5rem] font-black text-accent leading-none">
                          {stat.suffix}
                        </span>
                      </div>
                    </div>

                    {/* Context & Description */}
                    <div className={`md:col-span-6 flex flex-col gap-10 ${i % 2 !== 0 ? 'md:items-start' : 'md:items-end'}`}>
                      <p className={`max-w-[34ch] text-lg font-light leading-relaxed text-black/50 md:text-xl md:leading-[1.7] ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                        {stat.desc}
                      </p>
                      <div className="group/line relative h-1 w-32 bg-black/[0.04] overflow-hidden md:w-56">
                        <div className="absolute inset-x-0 bottom-0 h-full bg-accent -translate-x-full transition-transform duration-1000 group-hover:translate-x-0" />
                      </div>
                    </div>
                  </div>

                  {/* Geometric Detail */}
                  <div className="absolute top-20 left-10 h-32 w-px bg-gradient-to-b from-accent/20 to-transparent" />
                  <div className="absolute bottom-10 right-10 flex gap-1">
                    {[1, 2, 3].map(dot => (
                      <div key={dot} className="h-1 w-1 rounded-full bg-black/10 transition-colors group-hover:bg-accent/40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom indicator */}
        <div className="mt-16 mb-8 flex flex-col items-center gap-6">
          <div className="h-16 w-px bg-gradient-to-b from-black/20 to-transparent" />
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-black/15 animate-pulse">
            Scroll to stack results
          </p>
        </div>
      </div>
    </section>
  );
}
