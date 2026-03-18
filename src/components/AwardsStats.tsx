"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

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
    image: "https://images.unsplash.com/photo-1508919895503-4244ae99f946?auto=format&fit=crop&q=80&w=800",
  },
];

export default function AwardsStats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
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
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.018,
              ease: "expo.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: headingEl, start: "top 85%", once: true },
            }
          );
        }
      }

      gsap.fromTo(
        ".aw-kicker",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "expo.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".aw-kicker", start: "top 90%", once: true },
        }
      );
      gsap.fromTo(
        ".aw-body",
        { y: 22, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "expo.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".aw-body", start: "top 90%", once: true },
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
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 65%",
            once: true,
          },
          onUpdate() {
            numEl.textContent = Math.round(proxy.val).toString();
          },
        });

        // Subtle fade-in on each card
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible border-t border-white/5 bg-background pb-[15vw] pt-[15vw]"
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
              className="aw-heading text-[12vw] font-black uppercase leading-[0.8] tracking-tighter md:text-[7vw]"
              style={{ perspective: "800px" }}
            >
              Outcomes<br />
              <span className="text-white/10 italic">that lead</span>
            </h2>
          </div>
          <p className="aw-body max-w-[36ch] text-lg font-light leading-relaxed text-white/35 md:text-2xl">
            Awards are a signal. Outcomes are the standard. We build systems that perform and visuals that move.
          </p>
        </div>

        {/* ── Stacked cards ── centered stack */}
        <div className="relative mx-auto max-w-[1000px]">
          {stats.map((stat, i) => (
            <div
              key={i}
              /* Each card has its own scroll real estate - increased for more breathing room */
              style={{ height: i < stats.length - 1 ? "600px" : "auto" }}
              className="relative"
            >
              <div
                /*
                  Sticky: card parks at top: (120 + i*36)px as user scrolls.
                  Increased offsets for better visual stacking.
                */
                style={{
                  position: "sticky",
                  top: `${120 + i * 36}px`,
                  zIndex: i + 1,
                }}
              >
                <div
                  className={`aw-card group relative min-h-[300px] md:min-h-[400px] overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br ${stat.accent} p-10 backdrop-blur-md md:p-16`}
                  style={{
                    /* Slight scale down on lower cards for depth illusion */
                    transform: `scale(${1 - (stats.length - 1 - i) * 0.015})`,
                  }}
                >
                  {/* Card Background Image (Subtle) */}
                  <div className="absolute inset-0 z-0 opacity-[0.04] grayscale transition-all duration-1000 group-hover:opacity-[0.08] group-hover:scale-110">
                    <Image
                      src={stat.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                  </div>

                  {/* Content starts - relative z-10 */}
                  <div className="relative z-10 flex h-full min-h-[220px] md:min-h-[270px] flex-col justify-between">
                    {/* Top bar */}
                    <div className="mb-4 flex items-center gap-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                        {String(i + 1).padStart(2, "0")} / {stats.length}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/80">
                        {stat.label}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      {/* Giant number */}
                      <div className="flex items-center gap-2">
                        <span
                          className="aw-num font-black leading-none tracking-tighter text-white"
                          style={{ fontSize: "clamp(4.5rem, 8vw, 7rem)" }}
                        >
                          0
                        </span>
                        <span
                          className="font-bold text-accent mb-2"
                          style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
                        >
                          {stat.suffix}
                        </span>
                      </div>

                      {/* Description + line */}
                      <div className="flex flex-col md:items-end gap-6 md:pb-4">
                        <p className="max-w-[32ch] text-base font-light leading-relaxed text-white/60 md:text-right md:text-lg">
                          {stat.desc}
                        </p>
                        <div className="h-[2px] w-24 shrink-0 bg-gradient-to-r from-accent/60 to-transparent md:from-transparent md:to-accent/60" />
                      </div>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full border border-white/[0.04] mask-image:radial-gradient(circle,white_0%,transparent_70%) md:right-8 md:top-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom indicator */}
        <div className="mt-16 mb-8 flex flex-col items-center gap-6">
          <div className="h-16 w-px bg-gradient-to-b from-white/20 to-transparent" />
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/15 animate-pulse">
            Scroll to stack results
          </p>
        </div>
      </div>
    </section>
  );
}
