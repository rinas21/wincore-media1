"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
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
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Heading char reveal ──
      const headingEl = section.querySelector(".abt-heading") as HTMLElement | null;
      if (headingEl) {
        const split = new SplitType(headingEl, { types: "chars" });
        splits.push(split);
        if (split.chars) {
          gsap.fromTo(
            split.chars,
            { yPercent: reduced ? 0 : 115, opacity: reduced ? 1 : 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: reduced ? 0 : 1.25,
              stagger: 0.02,
              ease: "expo.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: headingEl,
                scroller,
                start: "top 95%", // Fire earlier
                once: true,
              },
            },
          );
        }
      }

      // ── Kicker ──
      gsap.fromTo(
        ".abt-kicker",
        { y: reduced ? 0 : 20, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.8,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".abt-kicker", scroller, start: "top 90%", once: true },
        },
      );

      // ── Lead paragraph ──
      gsap.fromTo(
        ".abt-lead",
        { y: reduced ? 0 : 28, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 1,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".abt-lead", scroller, start: "top 88%", once: true },
        },
      );

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

      // ── Stat cards (clean lift + settle) ──
      const statCards = gsap.utils.toArray<HTMLElement>(".abt-stat-card");
      statCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: reduced ? 0 : 56, opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 0.95,
            delay: i * 0.1,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: { trigger: card, scroller, start: "top 95%", once: true },
          },
        );

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

      // ── Team cards — staggered reveal with subtle 3D settle ──
      const photoCards = gsap.utils.toArray<HTMLElement>(".abt-photo-card");
      photoCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            y: reduced ? 0 : 64,
            opacity: reduced ? 1 : 0,
            rotateX: reduced ? 0 : 7,
            rotateY: reduced ? 0 : -3,
            transformPerspective: 900,
            clipPath: reduced ? "inset(0% 0 0 0 round 1.5rem)" : "inset(18% 0 0 0 round 1.5rem)",
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
            clipPath: "inset(0% 0 0 0 round 1.5rem)",
            duration: reduced ? 0 : 1.05,
            delay: i * 0.11,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: { trigger: card, scroller, start: "top 84%", once: true },
          },
        );
      });

      // ── Gallery subtle parallax ──
      if (!reduced) {
        gsap.set("[data-about-shift]", { yPercent: 0, scale: 1 });
      }
      gsap.to("[data-about-shift]", {
        yPercent: reduced ? 0 : -3,
        scale: reduced ? 1 : 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
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
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [lenis, preloaderDone]);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-chapter="custom"
      className="relative overflow-hidden bg-background py-28 md:py-36"
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
          <p className="abt-kicker mb-6 text-[11px] font-black uppercase leading-[1.4] tracking-[0.5em] text-accent">
            The Studio
          </p>
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 className="abt-heading pb-1 whitespace-normal text-[clamp(2.5rem,8vw,8rem)] font-black uppercase leading-[0.95] tracking-tighter text-foreground will-change-transform">
              <span className="whitespace-nowrap">Colombo-based.</span> <br />
              <span className="text-foreground italic whitespace-nowrap">Globally delivered.</span>
            </h2>
            <p className="abt-lead max-w-2xl text-base font-[1000] leading-[1.8] text-foreground sm:mt-4 lg:text-xl lg:text-left">
              10+ years turning ambitious ideas into measurable outcomes — a tight team of strategists,
              designers, filmmakers, and builders.
            </p>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="abt-rule mt-64 md:mt-80 mb-48 flex flex-col gap-8 border-t border-black/[0.15] pt-20 sm:flex-row sm:items-center sm:gap-0 md:mb-72 relative z-20 bg-background">
          {stats.map((item, i) => (
            <article key={item.label} className={`abt-stat-card flex items-baseline gap-3 rounded-2xl bg-black/[0.015] px-4 py-3 sm:bg-transparent sm:px-0 sm:py-0 ${i < stats.length - 1 ? "sm:pr-16 sm:mr-16 sm:border-r sm:border-black/[0.06]" : ""}`}>
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

        {/* ── Team Grid ── */}
        <div data-about-shift className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 relative z-10">
          {team.map((member, index) => (
            <article
              key={member.name}
              className={`abt-photo-card group relative overflow-hidden rounded-[1.5rem] bg-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] transform-gpu transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] ${
                index === 0 ? "sm:col-span-2 lg:col-span-6" : "lg:col-span-3"
              }`}
              style={{ aspectRatio: index === 0 ? "16/10" : "4/5" }}
            >
              <div className="absolute inset-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={95}
                  loading="lazy"
                  className="object-cover object-center transition-transform duration-[1800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />
              </div>

              {/* Professional darker gradient for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Name + Role — always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <p className="text-base font-black italic tracking-tight text-white md:text-xl">{member.name}</p>
                <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.45em] text-accent/90">{member.role}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
