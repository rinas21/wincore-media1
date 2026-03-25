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
          if (!reduced) {
            gsap.set(split.chars, { yPercent: 110, opacity: 0 });
          }
          gsap.from(split.chars, {
            yPercent: reduced ? 0 : 110,
            opacity: reduced ? 1 : 0,
            duration: reduced ? 0 : 1.1,
            stagger: 0.018,
            ease: "expo.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: headingEl,
              scroller,
              start: "top 85%",
              once: true,
            },
          });
        }
      }

      // ── Kicker ──
      if (!reduced) {
        gsap.set(".abt-kicker", { y: 20, opacity: 0 });
      }
      gsap.from(".abt-kicker", {
        y: reduced ? 0 : 20,
        opacity: reduced ? 1 : 0,
        duration: reduced ? 0 : 0.8,
        ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".abt-kicker", scroller, start: "top 90%", once: true },
      });

      // ── Lead paragraph ──
      if (!reduced) {
        gsap.set(".abt-lead", { y: 28, opacity: 0 });
      }
      gsap.from(".abt-lead", {
        y: reduced ? 0 : 28,
        opacity: reduced ? 1 : 0,
        duration: reduced ? 0 : 1,
        ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".abt-lead", scroller, start: "top 88%", once: true },
      });

      // ── Rule ──
      if (!reduced) {
        gsap.set(".abt-rule", { scaleX: 0, transformOrigin: "left" });
      }
      gsap.from(".abt-rule", {
        scaleX: reduced ? 1 : 0,
        transformOrigin: "left",
        duration: reduced ? 0 : 1.1,
        ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".abt-rule", scroller, start: "top 90%", once: true },
      });

      // ── Stat cards ──
      const statCards = gsap.utils.toArray<HTMLElement>(".abt-stat-card");
      statCards.forEach((card, i) => {
        if (!reduced) {
          gsap.set(card, { y: 40, opacity: 0, scale: 0.97 });
        }
        gsap.from(card, {
          y: reduced ? 0 : 40,
          opacity: reduced ? 1 : 0,
          scale: reduced ? 1 : 0.97,
          duration: reduced ? 0 : 0.9,
          delay: i * 0.08,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: card, scroller, start: "top 90%", once: true },
        });

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

      // ── Photo cards — each triggered independently ──
      const photoCards = gsap.utils.toArray<HTMLElement>(".abt-photo-card");
      photoCards.forEach((card, i) => {
        if (!reduced) {
          gsap.set(card, {
            y: 50,
            opacity: 0,
            clipPath: "inset(16% 0 0 0 round 1.25rem)",
          });
        }
        gsap.from(card, {
          y: reduced ? 0 : 50,
          opacity: reduced ? 1 : 0,
          clipPath: reduced ? "inset(0% 0 0 0 round 1.25rem)" : "inset(16% 0 0 0 round 1.25rem)",
          duration: reduced ? 0 : 1.1,
          delay: i * 0.07,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: card, scroller, start: "top 88%", once: true },
        });
      });

      // ── Gallery subtle parallax ──
      if (!reduced) {
        gsap.set("[data-about-shift]", { yPercent: 0, scale: 1 });
      }
      gsap.to("[data-about-shift]", {
        yPercent: reduced ? 0 : -8,
        scale: reduced ? 1 : 1.03,
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
        <div className="absolute inset-0 opacity-30">
          <AboutScene aboutId="about" />
        </div>
        <div className="abt-scene-glow absolute left-[-8rem] top-16 h-96 w-96 rounded-full bg-accent/8 blur-[100px]" />
        <div className="abt-scene-glow absolute right-[-4rem] bottom-0 h-64 w-64 rounded-full bg-accent/5 blur-[80px]" />
      </div>

      <div className="chapter-inner _container relative z-10">

        {/* ── Section Header ── */}
        <div className="mb-20 md:mb-28">
          <p className="abt-kicker mb-6 text-[11px] font-black uppercase leading-[1.4] tracking-[0.5em] text-accent">
            The Studio
          </p>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="abt-heading pb-1 text-[13vw] font-black uppercase leading-[0.95] tracking-tighter text-foreground md:text-[6.5vw]">
              Colombo-based.<br />
              <span className="text-black/15 italic">Globally delivered.</span>
            </h2>
            <p className="abt-lead max-w-[42ch] text-base font-light leading-[1.75] text-black/50 lg:text-lg lg:text-right">
              10+ years turning ambitious ideas into measurable outcomes — a tight team of strategists,
              designers, filmmakers, and builders.
            </p>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="abt-rule mb-20 flex flex-col gap-8 border-t border-black/[0.06] pt-10 sm:flex-row sm:items-center sm:gap-0 md:mb-28">
          {stats.map((item, i) => (
            <article key={item.label} className={`abt-stat-card flex items-baseline gap-3 ${i < stats.length - 1 ? "sm:pr-16 sm:mr-16 sm:border-r sm:border-black/[0.06]" : ""}`}>
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
        <div data-about-shift className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {team.map((member, index) => (
            <article
              key={member.name}
              className={`abt-photo-card group relative overflow-hidden rounded-[2rem] bg-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] transform-gpu transition-all duration-700 hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] ${
                index === 0 ? "col-span-2 row-span-1" : ""
              }`}
              style={{ aspectRatio: index === 0 ? "2/1" : "3/4" }}
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

              {/* Permanent subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

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
