"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";
import { useLenis } from "@/context/LenisContext";
import { usePreloaderDone } from "@/context/PreloaderContext";

gsap.registerPlugin(ScrollTrigger);

const AboutScene = dynamic(() => import("@/components/about/AboutScene"), {
  ssr: false,
  loading: () => null,
});

const team = [
  {
    name: "Sanjaya",
    role: "Creative Director",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
  },
  {
    name: "Rina",
    role: "AI Lead",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
  },
  {
    name: "Devin",
    role: "Tech Head",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
  },
  {
    name: "Amali",
    role: "Brand Strategy",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
  },
];

const stats = [
  { value: 10, suffix: "+", label: "Years" },
  { value: 200, suffix: "+", label: "Campaigns" },
];

export default function AboutTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const preloaderDone = usePreloaderDone();

  useEffect(() => {
    if (!sectionRef.current || !lenis || !preloaderDone) return;

    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Rule ──
      gsap.fromTo(
        ".abt-rule",
        { scaleX: reduced ? 1 : 0, transformOrigin: "left" },
        {
          scaleX: 1,
          transformOrigin: "left",
          duration: reduced ? 0 : 1.1,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".abt-rule", scroller, start: "top 90%", once: true },
        },
      );

      // ── Stat count-ups (entrance via PageMotion data-reveal) ──
      const statCards = gsap.utils.toArray<HTMLElement>(".abt-stat-card");
      statCards.forEach((card) => {
        const numEl = card.querySelector<HTMLElement>(".abt-counter");
        if (numEl) {
          const target = Number(numEl.dataset.target ?? 0);
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target,
            duration: reduced ? 0 : 1.8,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: { trigger: card, scroller, start: "top 85%", once: true },
            onUpdate() { numEl.textContent = Math.round(proxy.val).toString(); },
          });
        }
      });

      // ── Watermark drift (cinematic depth) ──
      if (!reduced) {
        gsap.set("[data-watermark]", { yPercent: 0, xPercent: 0, opacity: 1 });
      }
      gsap.to("[data-watermark]", {
        yPercent: reduced ? 0 : 8,
        xPercent: reduced ? 0 : 6,
        opacity: reduced ? 1 : 0.45,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // ── Ambient glow pulse with scroll ──
      if (!reduced) {
        gsap.set(".abt-scene-glow", { scale: 1, opacity: 0.8, yPercent: 0 });
      }
      gsap.to(".abt-scene-glow", {
        scale: reduced ? 1 : 1.18,
        opacity: 0.95,
        yPercent: reduced ? 0 : -5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    scheduleScrollTriggerRefresh();

    return () => {
      ctx.revert();
    };
  }, [lenis, preloaderDone]);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-chapter="custom"
      className="relative overflow-hidden bg-background pt-28 pb-32 md:pt-36 md:pb-44"
      aria-label="About"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5">
          <AboutScene aboutId="about" />
        </div>
        <div className="abt-scene-glow absolute left-[-8rem] top-16 h-96 w-96 rounded-full bg-accent/8 blur-[100px]" />
        <div className="abt-scene-glow absolute right-[-4rem] bottom-0 h-64 w-64 rounded-full bg-accent/5 blur-[80px]" />
      </div>

      <div className="chapter-inner _container relative z-10">

        {/* ── Section Header ── */}
        <div className="mb-32 md:mb-48 relative z-20">
          <p
            data-reveal
            className="abt-kicker mb-6 text-[11px] font-black uppercase leading-[1.4] tracking-[0.5em] text-accent"
          >
            The Studio
          </p>
          <div className="flex flex-col gap-6 md:gap-8">
            <h2
              data-reveal
              className="abt-heading pb-1 whitespace-normal text-[clamp(2.5rem,8vw,8rem)] font-black uppercase leading-[0.95] tracking-tighter text-foreground will-change-transform"
            >
              <span className="whitespace-nowrap">Colombo-based.</span> <br />
              <span className="text-foreground italic whitespace-nowrap">Globally delivered.</span>
            </h2>
            <p
              data-reveal
              className="abt-lead max-w-2xl text-base font-[1000] leading-[1.8] text-foreground sm:mt-4 lg:text-xl lg:text-left"
            >
              10+ years turning ambitious ideas into measurable outcomes — a tight team of strategists,
              designers, filmmakers, and builders.
            </p>
          </div>
        </div>

        {/* Stats + team: flex gap + bottom padding (margin on grid was not visible; parallax transform removed). */}
        <div className="flex flex-col gap-10 md:gap-14 lg:gap-16 pb-20 md:pb-28 lg:pb-36">
        {/* ── Stats Bar ── */}
        <div className="abt-rule mt-64 md:mt-80 flex flex-col gap-8 border-t border-black/[0.15] pt-20 sm:flex-row sm:items-center sm:gap-0 relative z-20 bg-background">
          {stats.map((item, i) => (
            <article
              key={item.label}
              data-reveal
              className={`abt-stat-card flex items-baseline gap-3 rounded-2xl bg-black/[0.015] px-4 py-3 sm:bg-transparent sm:px-0 sm:py-0 ${i < stats.length - 1 ? "sm:pr-16 sm:mr-16 sm:border-r sm:border-black/[0.06]" : ""}`}
            >
              <span className="abt-counter text-6xl font-black leading-none tracking-tighter text-foreground md:text-7xl" data-target={item.value}>
                0
              </span>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-accent">{item.suffix}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.42em] text-black/30">{item.label}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="abt-team-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 relative z-10">
          {team.map((member, index) => (
            <article
              key={member.name}
              data-reveal
              className="abt-photo-card group relative flex flex-col overflow-hidden rounded-[1.25rem] bg-black shadow-md transform-gpu transition-all duration-700 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative w-full overflow-hidden aspect-[4/5]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  quality={95}
                  loading="lazy"
                  className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 opacity-90 group-hover:opacity-100" />
                
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-6 text-center transform transition-transform duration-700 group-hover:-translate-y-1">
                  <p className="text-[1.25rem] font-bold tracking-tight text-white mb-1.5">
                    {member.name}
                  </p>
                  <p className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-white/80 backdrop-blur-md transition-colors duration-500 group-hover:border-accent/40 group-hover:text-accent">
                    {member.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        {/* Fixed block — guarantees empty space after cards (not affected by transforms) */}
        <div className="h-10 shrink-0 md:h-14" aria-hidden />
        </div>

      </div>
    </section>
  );
}
