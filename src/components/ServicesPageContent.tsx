"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Layers,
  Monitor,
  Sparkles,
  Video,
} from "lucide-react";
import { registerGsapPlugins, getScroller, prefersReducedMotion } from "@/lib/motion";

type ServiceItem = {
  title: string;
  summary: string;
  outcomes: string[];
  icon: ComponentType<{ size?: number | string; className?: string }>;
  image: string;
  link?: string;
};

const SERVICES: ServiceItem[] = [
  {
    title: "Digital-First Branding",
    summary: "Identity, visual language, and brand systems for modern channels.",
    outcomes: ["Strategy & naming", "Design systems", "Rollout"],
    icon: Layers,
    image: "https://images.unsplash.com/photo-1516382799247-87df95d790b7?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Social & Influence",
    summary: "Editorial rhythm and creator partnerships that convert attention.",
    outcomes: ["Content pillars", "Campaigns", "Partnerships"],
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Motion Video & 3D",
    summary: "Reels, explainers, and 3D storytelling for paid and organic.",
    outcomes: ["Motion design", "3D assets", "Ad cutdowns"],
    icon: Video,
    image: "https://images.unsplash.com/photo-1574717024453-3540560a4de9?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "AI-Powered Web Development",
    summary: "Fast, premium sites with AI-assisted workflows and strong performance.",
    outcomes: ["Prototyping", "Performance", "CMS"],
    icon: Bot,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    link: "https://winpro-ai-site.vercel.app",
  },
  {
    title: "Performance Marketing",
    summary: "Full-funnel paid media with testing loops and clear reporting.",
    outcomes: ["Paid strategy", "Creative tests", "Attribution"],
    icon: ChartNoAxesCombined,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "UX/UI & WebGL",
    summary: "Product UX, UI craft, and immersive WebGL where it matters.",
    outcomes: ["UX systems", "UI design", "WebGL"],
    icon: Monitor,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1200",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discover",
    text: "Market, audience, and constraints into a focused brief.",
  },
  {
    step: "02",
    title: "Design",
    text: "Concepts into production-ready systems and creative direction.",
  },
  {
    step: "03",
    title: "Deploy",
    text: "Launch, measure, and refine for long-term growth.",
  },
];

export default function ServicesPageContent() {
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const coarsePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const cardHoverCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // --- Hero: entrance on load (does not depend on scroll) ---
      if (!reduced) {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          delay: 0.05,
        });
        tl.from(".svc-orb", { opacity: 0, scale: 0.85, duration: 1.2 }, 0)
          .from(".svc-kicker", { opacity: 0, y: 18, duration: 0.65 }, 0.15)
          .from(
            ".svc-title-line",
            { opacity: 0, y: 36, duration: 0.85, stagger: 0.12 },
            0.22,
          )
          .from(".svc-lead", { opacity: 0, y: 20, duration: 0.8 }, "-=0.35")
          .from(
            ".svc-meta-item",
            { opacity: 0, y: 18, duration: 0.55, stagger: 0.11 },
            "-=0.2",
          );

        if (glowRef.current) {
          gsap.to(glowRef.current, {
            opacity: 0.55,
            duration: 2.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }
      } else {
        gsap.set(
          [
            ".svc-kicker",
            ".svc-title-line",
            ".svc-lead",
            ".svc-meta-item",
            ".svc-orb",
          ],
          { clearProps: "all" },
        );
      }

      // --- Cards: per-card scroll reveal (Lenis needs explicit scroller) ---
      if (!reduced) {
        const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
        gsap.set(cards, { force3D: true });
        cards.forEach((card, i) => {
          const bg = card.querySelector<HTMLElement>(".svc-card-bg");
          const content = card.querySelector<HTMLElement>(".svc-card-content");
          const focus = card.querySelector<HTMLElement>(".svc-card-focus");

          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 88,
              scale: 0.9,
              rotateX: 8,
              transformOrigin: "50% 0%",
              clipPath: "inset(18% 0 0 0 round 1.5rem)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              clipPath: "inset(0% 0 0 0 round 1.5rem)",
              duration: 1.05,
              delay: i * 0.06,
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                scroller,
                start: "top 90%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );

          if (content) {
            gsap.fromTo(
              content,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: 0.1 + i * 0.04,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  scroller,
                  start: "top 88%",
                  once: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          gsap.to(card, {
            yPercent: -2.5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              scroller,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.05,
              invalidateOnRefresh: true,
            },
          });

          if (bg) {
            gsap.fromTo(
              bg,
              { scale: 1.16, yPercent: 8 },
              {
                scale: 1,
                yPercent: -6,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  scroller,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          ScrollTrigger.create({
            trigger: card,
            scroller,
            start: "top 62%",
            end: "bottom 38%",
            onEnter: () => {
              gsap.to(card, { scale: 1.025, duration: 0.45, ease: "power3.out" });
              if (focus) gsap.to(focus, { opacity: 1, duration: 0.45, ease: "power3.out" });
            },
            onEnterBack: () => {
              gsap.to(card, { scale: 1.025, duration: 0.45, ease: "power3.out" });
              if (focus) gsap.to(focus, { opacity: 1, duration: 0.45, ease: "power3.out" });
            },
            onLeave: () => {
              gsap.to(card, { scale: 1, duration: 0.4, ease: "power2.out" });
              if (focus) gsap.to(focus, { opacity: 0, duration: 0.35, ease: "power2.out" });
            },
            onLeaveBack: () => {
              gsap.to(card, { scale: 1, duration: 0.4, ease: "power2.out" });
              if (focus) gsap.to(focus, { opacity: 0, duration: 0.35, ease: "power2.out" });
            },
          });

          if (!coarsePointer) {
            const xTo = gsap.quickTo(card, "x", { duration: 0.35, ease: "power3.out" });
            const yTo = gsap.quickTo(card, "y", { duration: 0.35, ease: "power3.out" });
            const rxTo = gsap.quickTo(card, "rotationX", { duration: 0.45, ease: "power3.out" });
            const ryTo = gsap.quickTo(card, "rotationY", { duration: 0.45, ease: "power3.out" });

            const onMove = (e: PointerEvent) => {
              const rect = card.getBoundingClientRect();
              const nx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
              const ny = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
              xTo(nx * 5);
              yTo(ny * 5);
              rxTo(-ny * 4);
              ryTo(nx * 5);
            };

            const onLeave = () => {
              xTo(0);
              yTo(0);
              rxTo(0);
              ryTo(0);
            };

            card.addEventListener("pointermove", onMove);
            card.addEventListener("pointerleave", onLeave);
            cardHoverCleanups.push(() => {
              card.removeEventListener("pointermove", onMove);
              card.removeEventListener("pointerleave", onLeave);
            });
          }
        });
      }

      // --- Process steps (subtle scroll-in only; no line scrub) ---
      if (!reduced) {
        const processNodes = gsap.utils.toArray<HTMLElement>(".svc-process-node");
        processNodes.forEach((node, i) => {
          gsap.fromTo(
            node,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              delay: i * 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: node,
                scroller,
                start: "top 88%",
                once: true,
              },
            },
          );
        });
      }

      // --- Section headings (scroll) ---
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>(".svc-fade-up").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                scroller,
                start: "top 89%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      }

      // --- CTA ---
      gsap.from(".svc-cta-inner", {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 28,
        scale: reduced ? 1 : 0.99,
        duration: reduced ? 0 : 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".svc-cta",
          scroller,
          start: "top 88%",
          once: true,
        },
      });

      // Subtle parallax on section glow (scroll-linked)
      if (!reduced && glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            scroller,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, rootRef);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    const t1 = window.setTimeout(refresh, 120);
    const t2 = window.setTimeout(refresh, 450);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      cardHoverCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-black/5 bg-[linear-gradient(180deg,var(--background)_0%,#fafafa_12%,var(--background)_38%,#f8f9fa_100%)] pb-24 pt-14 md:pb-32 md:pt-16 lg:pb-40 lg:pt-20"
      aria-label="Services overview"
    >
      {/* Ambient + grid */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={glowRef}
          className="svc-orb absolute left-1/2 top-[-18%] h-[min(55vh,480px)] w-[min(90vw,720px)] -translate-x-1/2 rounded-full bg-accent/[0.09] blur-[120px]"
        />
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 85% 55% at 50% 15%, black 25%, transparent 78%)",
          }}
        />
      </div>

      <div className="_container relative z-10">
        <header className="svc-intro">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white px-6 py-12 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] transition-shadow duration-500 hover:shadow-[0_40px_90px_-18px_rgba(0,0,0,0.14)] sm:px-9 sm:py-14 md:px-12 md:py-16 lg:px-16 lg:py-20 xl:px-[4.25rem] xl:py-[5.25rem]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-accent/80 via-accent/25 to-transparent lg:left-9 xl:left-11" />
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start lg:gap-x-14 xl:gap-x-20">
              <div className="min-w-0 pl-4 sm:pl-6 lg:pl-10 xl:pl-12">
                <p className="svc-kicker mb-8 text-[10px] font-black uppercase leading-[1.5] tracking-[0.42em] text-accent md:mb-10">
                  Services
                </p>
                <h1 className="font-heading text-[1.85rem] font-black uppercase leading-[1.12] tracking-tight text-foreground sm:text-[2.35rem] md:text-5xl md:leading-[1.08] lg:text-[3.15rem] lg:leading-[1.06]">
                  <span className="svc-title-line block">
                    Built to scale{" "}
                    <span className="text-secondary italic">modern</span> brands.
                  </span>
                  <span className="svc-title-line mt-6 block max-w-[26ch] text-base font-black uppercase leading-[1.4] tracking-[0.06em] text-foreground/50 sm:mt-7 sm:max-w-none sm:text-lg sm:leading-[1.45] md:mt-8 md:text-xl md:leading-[1.4] lg:text-[1.35rem]">
                    Strategy, craft &amp; AI — end to end.
                  </span>
                </h1>
                <p className="svc-lead mt-10 max-w-xl text-base leading-[1.75] text-foreground/50 md:mt-12 md:max-w-2xl md:text-lg md:leading-[1.72]">
                  Wincore delivers digital-first branding, motion, performance, and immersive
                  web. One partner, one bar for quality.
                </p>
              </div>

              <aside
                className="svc-meta-row flex flex-col rounded-2xl border border-black/10 bg-muted/50 p-8 pt-10 ring-1 ring-black/5 lg:rounded-3xl lg:p-9 lg:pt-10 xl:p-10"
                aria-label="At a glance"
              >
                <div className="svc-meta-item flex flex-col gap-2.5 border-b border-black/10 pb-8 lg:pb-9">
                  <span className="text-[9px] font-black uppercase tracking-[0.38em] text-foreground/40">
                    Location
                  </span>
                  <span className="text-[15px] font-medium leading-snug tracking-tight text-foreground/90">
                    Colombo &amp; remote
                  </span>
                </div>
                <div className="svc-meta-item flex flex-col gap-2.5 border-b border-black/10 py-8 lg:py-9">
                  <span className="text-[9px] font-black uppercase tracking-[0.38em] text-foreground/40">
                    Focus
                  </span>
                  <span className="text-[15px] font-medium leading-snug tracking-tight text-accent">
                    WebGL · AI · Motion
                  </span>
                </div>
                <div className="svc-meta-item flex flex-col gap-2.5 pt-8 lg:pt-9">
                  <span className="text-[9px] font-black uppercase tracking-[0.38em] text-foreground/40">
                    Delivery
                  </span>
                  <span className="text-[15px] font-medium leading-snug tracking-tight text-foreground/90">
                    Strategy-led
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </header>

        <section className="svc-cap-section mb-16 md:mb-20" aria-labelledby="svc-cap-heading">
          <div className="svc-fade-up flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-10">
            <div className="max-w-2xl space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.42em] text-accent">
                What we deliver
              </span>
              <div className="space-y-3">
                <h2
                  id="svc-cap-heading"
                  className="text-[1.75rem] font-black uppercase leading-[1.08] tracking-tight text-foreground sm:text-3xl md:text-[2.25rem]"
                >
                  Capabilities
                </h2>
                <p className="max-w-lg text-sm leading-relaxed text-foreground/50 md:text-base">
                  Brand, motion, product, and growth—structured so every engagement stays clear,
                  fast, and accountable.
                </p>
              </div>
            </div>
            <p className="shrink-0 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/35 md:text-right">
              06 disciplines
            </p>
          </div>
        </section>

        <div className="svc-card-grid mb-24 grid grid-cols-1 gap-7 perspective-[1400px] sm:grid-cols-2 sm:gap-8 md:mb-28 md:gap-8 lg:mb-32 lg:grid-cols-6 lg:gap-9">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const layoutClass =
                  index === 0 || index === 3
                ? "lg:col-span-4 lg:min-h-[440px]"
                : "lg:col-span-2 lg:min-h-[440px]";
            return (
              <article
                key={service.title}
                className={`svc-card group relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black text-white shadow-[0_28px_64px_rgba(0,0,0,0.18)] ring-1 ring-black/20 transition-all duration-500 hover:border-accent/50 hover:shadow-[0_44px_100px_rgba(0,0,0,0.26)] md:min-h-[400px] ${layoutClass}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="svc-card-bg absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${service.image})` }}
                  aria-hidden="true"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/74 via-black/34 to-black/22" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,191,255,0.28),transparent_62%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="svc-card-focus pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/12 via-transparent to-transparent opacity-0" />
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80 transition-opacity duration-500 group-hover:via-white/70 sm:inset-x-7" />

                <div className="pointer-events-none absolute right-3 top-2 z-10 font-heading text-[2.75rem] font-black leading-none tracking-tighter text-white/15 sm:right-5 sm:top-4 sm:text-[3.25rem] md:text-[4rem]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="svc-card-content relative z-10 mt-auto px-6 pb-8 pt-14 sm:px-8 sm:pb-10 sm:pt-16 md:px-9 md:pb-11 md:pt-[5.25rem]">
                  <div className="mb-7 flex items-start justify-between gap-4">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[9px] font-black uppercase leading-[1.3] tracking-[0.28em] text-white/90 backdrop-blur-md">
                      {service.link ? "Platform" : "Service"}
                    </span>
                    <div className="rounded-2xl border border-white/18 bg-white/10 p-3 text-white shadow-lg shadow-black/25 transition-all duration-500 group-hover:scale-110 group-hover:border-accent/55 group-hover:bg-accent group-hover:text-white group-hover:shadow-xl group-hover:shadow-accent/30">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="mb-3.5 text-[1.25rem] font-black leading-[1.2] tracking-tight text-white md:text-[1.5rem] md:leading-[1.18]">
                    {service.title}
                  </h3>
                  <p className="mb-7 max-w-[52ch] text-[13px] leading-[1.7] text-white/85 md:text-[15px]">
                    {service.summary}
                  </p>

                  <ul className="mb-7 flex flex-wrap gap-2">
                    {service.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="rounded-full border border-white/18 bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase leading-[1.2] tracking-[0.12em] text-white/92"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>

                  {service.link ? (
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-accent/70 bg-accent px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.26em] text-white transition-transform hover:scale-[1.03]"
                    >
                      WinPro AI
                      <ArrowUpRight size={13} />
                    </a>
                  ) : (
                    <span className="text-[10px] font-black uppercase leading-[1.4] tracking-[0.25em] text-white/74">
                      Strategy-led
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="svc-process-container relative mb-32 md:mb-44 lg:mb-52">
          {/* Intro: full-width stack, generous vertical rhythm */}
          <div className="svc-fade-up max-w-3xl space-y-7 pb-20 md:space-y-9 md:pb-24 lg:pb-28">
            <span className="block text-[10px] font-black uppercase tracking-[0.42em] text-accent">
              How we work
            </span>
            <h2 className="font-heading text-[2rem] font-black uppercase leading-[1.05] tracking-tighter text-foreground sm:text-[2.5rem] md:text-[3rem] md:leading-[1.02] lg:text-[3.5rem]">
              Process &amp; scope
            </h2>
            <p className="max-w-2xl text-base leading-[1.85] text-foreground/55 md:text-lg md:leading-[1.8]">
              We collapse timelines by focusing only on what matters: discovering the edge, designing
              the system, and deploying for growth.
            </p>
          </div>

          {/* Steps: three clear cards, no cramped connector lines */}
          <div className="svc-process-track">
            <div className="grid grid-cols-1 gap-12 sm:gap-14 md:grid-cols-3 md:gap-8 lg:gap-10 xl:gap-12">
              {PROCESS.map((phase) => (
                <div
                  key={phase.step}
                  className="svc-process-node group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-8 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.1)] sm:p-9 md:p-8 lg:p-10"
                >
                  <div className="svc-process-dot mb-8 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/5 text-xs font-black tracking-widest text-accent md:mb-9 md:h-14 md:w-14">
                    <span>{phase.step}</span>
                  </div>
                  <div className="space-y-5">
                    <h4 className="text-xl font-black uppercase tracking-tighter text-foreground transition-colors duration-300 group-hover:text-accent md:text-[1.35rem] lg:text-2xl">
                      {phase.title}
                    </h4>
                    <p className="text-[15px] leading-[1.85] text-foreground/50 md:text-base md:leading-[1.8] lg:text-[17px]">
                      {phase.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="svc-cta relative isolate mt-4 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_28px_72px_-20px_rgba(0,0,0,0.1)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,136,204,0.05)_0%,transparent_45%)]" />
          <div className="svc-cta-inner relative flex flex-col gap-14 px-8 py-16 sm:px-12 sm:py-20 md:gap-16 md:px-16 md:py-24 lg:flex-row lg:items-end lg:justify-between lg:gap-20 lg:px-20 lg:py-28 xl:px-24">
            <div className="max-w-2xl space-y-10">
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-accent">
                Next step
              </p>
              <p className="font-heading text-[1.75rem] font-black uppercase leading-[1.18] tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.14] lg:text-[2.5rem]">
                Tell us what you&apos;re building — we&apos;ll scope it.
              </p>
              <p className="max-w-xl text-base leading-[1.85] text-foreground/50 md:text-lg md:leading-[1.8]">
                Share goals, timeline, and budget band—we reply with a clear path forward.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-accent px-12 py-[1.125rem] text-[11px] font-black uppercase tracking-[0.28em] text-white shadow-md shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98] lg:self-end"
            >
              Start a project
              <ArrowUpRight size={18} strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
