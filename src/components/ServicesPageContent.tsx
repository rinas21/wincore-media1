"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import {
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Layers,
  Monitor,
  Sparkles,
  Video,
} from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  prefersReducedMotion,
  scheduleScrollTriggerRefresh,
} from "@/lib/motion";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

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

  /* Hero: set initial states before paint so line-mask reveal does not flash. */
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsapPlugins();
    gsap.set(
      [
        ".svc-hero .svc-kicker",
        ".svc-hero .svc-title-line-inner",
        ".svc-hero .svc-lead",
        ".svc-hero .svc-kicker-rule",
      ],
      { opacity: 0 },
    );
    gsap.set(".svc-hero .svc-title-line-inner", {
      yPercent: 100,
      filter: "blur(12px)",
    });
    gsap.set(".svc-hero .svc-kicker", { y: 20 });
    gsap.set(".svc-hero .svc-lead", { y: 32 });
    gsap.set(".svc-hero .svc-meta-label", { y: 14, opacity: 0 });
    gsap.set(".svc-hero .svc-meta-value", { y: 18, opacity: 0 });
    gsap.set(".svc-hero .svc-kicker-rule", { scaleX: 0 });
  }, []);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const coarsePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const cardPointerCleanups: Array<() => void> = [];
    const CARD_SHADOW_REST = "0 28px 64px rgba(0,0,0,0.18)";

    const ctx = gsap.context(() => {
      // --- Hero: load timeline (mask-style lines + staggered meta) ---
      if (!reduced) {
        const heroEase = "power4.out" as const;
        const tl = gsap.timeline({
          defaults: { ease: heroEase },
          delay: 0.08,
        });

        tl.fromTo(
          ".svc-orb",
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 1.15, ease: "expo.out" },
          0,
        )
          .to(
            ".svc-hero .svc-kicker",
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            0.12,
          )
          .to(
            ".svc-hero .svc-kicker-rule",
            { opacity: 1, scaleX: 1, duration: 0.8, ease: "power3.out", transformOrigin: "0% 50%" },
            0.34,
          )
          .to(
            ".svc-hero .svc-title-line-inner",
            {
              opacity: 1,
              yPercent: 0,
              filter: "blur(0px)",
              duration: 1.12,
              stagger: 0.16,
              ease: heroEase,
            },
            0.2,
          )
          .to(
            ".svc-hero .svc-lead",
            { opacity: 1, y: 0, duration: 0.92, ease: "power3.out" },
            0.58,
          )
          .to(
            ".svc-hero .svc-meta-label",
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: "power3.out" },
            0.48,
          )
          .to(
            ".svc-hero .svc-meta-value",
            { opacity: 1, y: 0, duration: 0.68, stagger: 0.1, ease: "power3.out" },
            0.56,
          );

        tl.eventCallback("onComplete", () => {
          gsap.set(".svc-hero .svc-title-line-inner", { clearProps: "transform,filter" });
        });

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
            ".svc-title-line-inner",
            ".svc-lead",
            ".svc-meta-label",
            ".svc-meta-value",
            ".svc-kicker-rule",
            ".svc-orb",
          ],
          { clearProps: "all" },
        );
      }

      // --- Cards: per-card scroll reveal (Lenis needs explicit scroller) ---
      if (!reduced) {
        const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
        gsap.set(cards, { force3D: true, transformPerspective: 1200 });
        cards.forEach((card, i) => {
          const bg = card.querySelector<HTMLElement>(".svc-card-bg");
          const content = card.querySelector<HTMLElement>(".svc-card-content");
          const focus = card.querySelector<HTMLElement>(".svc-card-focus");

          /* Y only — never hide with opacity:0 (ScrollTrigger misses left cards invisible). */
          gsap.fromTo(
            card,
            { y: 40 },
            {
              y: 0,
              duration: 0.75,
              delay: Math.min(i * 0.04, 0.2),
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                scroller,
                start: "top 92%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );

          if (content) {
            gsap.fromTo(
              content,
              { y: 20 },
              {
                y: 0,
                duration: 0.55,
                delay: 0.06 + Math.min(i * 0.03, 0.1),
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  scroller,
                  start: "top 92%",
                  once: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          if (focus) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: card,
                  scroller,
                  start: "top 62%",
                  end: "bottom 38%",
                  toggleActions: "play reverse play reverse",
                },
              })
              .fromTo(
                focus,
                { opacity: 0 },
                { opacity: 1, duration: 0.45, ease: "power2.out" },
                0,
              );
          }

          const onPointerEnter = () => {
            gsap.to(card, {
              y: -8,
              scale: 1.015,
              boxShadow: "0 32px 72px rgba(0,0,0,0.22)",
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
            if (bg) {
              gsap.to(bg, {
                scale: 1.07,
                duration: 0.65,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          };

          const onPointerLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              boxShadow: CARD_SHADOW_REST,
              rotationX: 0,
              rotationY: 0,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
            if (bg) {
              gsap.to(bg, {
                scale: 1,
                duration: 0.65,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          };

          card.addEventListener("pointerenter", onPointerEnter);
          card.addEventListener("pointerleave", onPointerLeave);
          cardPointerCleanups.push(() => {
            card.removeEventListener("pointerenter", onPointerEnter);
            card.removeEventListener("pointerleave", onPointerLeave);
          });

          /* Fine pointer only: subtle 3D tilt (rotation only — avoids fighting hover y/scale). */
          if (!coarsePointer) {
            const rxTo = gsap.quickTo(card, "rotationX", { duration: 0.45, ease: "power3.out" });
            const ryTo = gsap.quickTo(card, "rotationY", { duration: 0.45, ease: "power3.out" });

            const onMove = (e: PointerEvent) => {
              const rect = card.getBoundingClientRect();
              const nx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
              const ny = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
              rxTo(-ny * 4);
              ryTo(nx * 5);
            };

            card.addEventListener("pointermove", onMove);
            cardPointerCleanups.push(() => {
              card.removeEventListener("pointermove", onMove);
            });
          }
        });
      }

      // --- Process: intro + journey line scrub + step reveals ---
      if (!reduced) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".svc-process-intro",
              scroller,
              start: "top 80%",
              once: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            ".svc-process-kicker",
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
            0,
          )
          .fromTo(
            ".svc-process-title",
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.72, ease: "power3.out" },
            0.1,
          )
          .fromTo(
            ".svc-process-lead",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
            0.22,
          );

        gsap.fromTo(
          ".svc-process-node",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".svc-process-journey",
              scroller,
              start: "top 78%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.fromTo(
          ".svc-process-node-num",
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".svc-process-journey",
              scroller,
              start: "top 76%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.fromTo(
          ".svc-process-connector",
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            transformOrigin: "50% 50%",
            scrollTrigger: {
              trigger: ".svc-process-connector-wrap",
              scroller,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      } else {
        gsap.set(
          [
            ".svc-process-kicker",
            ".svc-process-title",
            ".svc-process-lead",
            ".svc-process-node",
            ".svc-process-node-num",
            ".svc-process-connector",
          ],
          { clearProps: "all" },
        );
      }

      // --- Section headings (scroll) ---
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>(".svc-fade-up").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
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

      // --- CTA (staggered copy + button) ---
      if (!reduced) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".svc-cta",
              scroller,
              start: "top 82%",
              once: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            ".svc-cta-kicker",
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
            0,
          )
          .fromTo(
            ".svc-cta-headline",
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
            0.12,
          )
          .fromTo(
            ".svc-cta-lead",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
            0.24,
          )
          .fromTo(
            ".svc-cta-btn",
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" },
            0.38,
          );
      }

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

    scheduleScrollTriggerRefresh();

    return () => {
      cardPointerCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip overflow-y-visible border-t border-black/5 bg-[linear-gradient(180deg,var(--background)_0%,#fafafa_12%,var(--background)_38%,#f8f9fa_100%)] pb-36 pt-16 md:pb-48 md:pt-20 lg:pb-60 lg:pt-24"
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
        <header className="svc-intro svc-hero">
          <div className="grid grid-cols-1 gap-14 border-t border-black/[0.07] pt-16 md:gap-16 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-start lg:gap-x-20 lg:pt-24 xl:gap-x-28">
            <div className="min-w-0">
              <div className="mb-10 md:mb-12">
                <p className="svc-kicker mb-5 text-[11px] font-black uppercase leading-[1.45] tracking-[0.36em] text-accent sm:text-xs md:mb-6 md:tracking-[0.38em]">
                  Services
                </p>
                <div
                  className="svc-kicker-rule h-[2px] w-16 max-w-full rounded-full bg-accent sm:w-20 md:h-[3px] md:w-24"
                  aria-hidden
                />
              </div>
              <h1 className="font-heading text-[2.15rem] font-black uppercase leading-[1.08] tracking-tight text-foreground sm:text-[2.65rem] sm:leading-[1.06] md:text-[3.25rem] md:leading-[1.04] lg:text-[clamp(2.85rem,4.5vw,4rem)] lg:leading-[1.02]">
                <span className="svc-title-line block overflow-hidden pb-[0.1em]">
                  <span className="svc-title-line-inner block will-change-[transform,filter]">
                    Built to scale{" "}
                    <span className="text-secondary italic">modern</span> brands.
                  </span>
                </span>
                <span className="svc-title-line mt-7 block max-w-[28ch] overflow-hidden pb-[0.1em] text-lg font-black uppercase leading-[1.35] tracking-[0.05em] text-foreground/55 sm:mt-8 sm:max-w-none sm:text-xl sm:leading-[1.4] md:mt-10 md:text-2xl md:leading-[1.38] lg:mt-12 lg:text-[clamp(1.5rem,2vw,1.85rem)]">
                  <span className="svc-title-line-inner block will-change-[transform,filter]">
                    Strategy, craft &amp; AI — end to end.
                  </span>
                </span>
              </h1>
              <p className="svc-lead mt-12 max-w-2xl text-lg leading-[1.82] text-foreground/50 md:mt-14 md:max-w-[52ch] md:text-xl md:leading-[1.78] lg:text-[1.35rem] lg:leading-[1.76]">
                Wincore delivers digital-first branding, motion, performance, and immersive
                web. One partner, one bar for quality.
              </p>
            </div>

            <aside
              className="svc-meta-row flex flex-col gap-0 border-t border-black/10 pt-12 lg:border-l lg:border-t-0 lg:border-black/10 lg:pl-14 lg:pt-2 xl:pl-16"
              aria-label="At a glance"
            >
              <div className="svc-meta-item flex flex-col gap-3 border-b border-black/10 py-8 first:pt-0 lg:gap-3.5 lg:py-9">
                <span className="svc-meta-label text-[10px] font-black uppercase tracking-[0.32em] text-foreground/45 md:text-[11px] md:tracking-[0.34em]">
                  Location
                </span>
                <span className="svc-meta-value text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
                  Colombo &amp; remote
                </span>
              </div>
              <div className="svc-meta-item flex flex-col gap-3 border-b border-black/10 py-8 lg:gap-3.5 lg:py-9">
                <span className="svc-meta-label text-[10px] font-black uppercase tracking-[0.32em] text-foreground/45 md:text-[11px] md:tracking-[0.34em]">
                  Focus
                </span>
                <span className="svc-meta-value text-lg font-semibold leading-snug tracking-tight text-accent md:text-xl">
                  WebGL · AI · Motion
                </span>
              </div>
              <div className="svc-meta-item flex flex-col gap-3 py-8 pb-0 lg:gap-3.5 lg:py-9">
                <span className="svc-meta-label text-[10px] font-black uppercase tracking-[0.32em] text-foreground/45 md:text-[11px] md:tracking-[0.34em]">
                  Delivery
                </span>
                <span className="svc-meta-value text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
                  Strategy-led
                </span>
              </div>
            </aside>
          </div>
        </header>

        <section
          className="svc-cap-section mt-24 mb-20 md:mt-32 md:mb-28 lg:mt-36"
          aria-labelledby="svc-cap-heading"
        >
          <div className="svc-fade-up border-t border-black/[0.08] pt-14 md:pt-20 lg:pt-24">
            <div className="flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <div className="max-w-3xl space-y-6 md:space-y-7">
                <span className="block text-[11px] font-black uppercase tracking-[0.38em] text-accent md:text-xs md:tracking-[0.4em]">
                  What we deliver
                </span>
                <div className="space-y-5 md:space-y-6">
                  <h2
                    id="svc-cap-heading"
                    className="font-heading text-[2.1rem] font-black uppercase leading-[1.04] tracking-tight text-foreground sm:text-[2.5rem] md:text-[3rem] md:leading-[1.02] lg:text-[3.25rem]"
                  >
                    Capabilities
                  </h2>
                  <p className="max-w-2xl text-[1.05rem] leading-[1.75] text-foreground/55 md:text-lg md:leading-[1.72] lg:text-xl lg:leading-[1.68]">
                    Brand, motion, product, and growth—structured so every engagement stays clear,
                    fast, and accountable.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 lg:items-end lg:pb-1">
                <span className="font-heading text-[clamp(2.75rem,8vw,4.5rem)] font-black leading-none tracking-tighter text-foreground/[0.12]">
                  06
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.42em] text-foreground/40 md:text-xs">
                  disciplines
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="svc-card-grid mb-0 mt-14 grid grid-cols-1 gap-16 perspective-[1400px] sm:grid-cols-2 sm:gap-x-12 sm:gap-y-18 md:mt-20 md:gap-x-14 md:gap-y-20 lg:grid-cols-6 lg:gap-x-16 lg:gap-y-24">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const layoutClass =
              index % 4 === 0 || index % 4 === 3
                ? "lg:col-span-4 lg:min-h-[560px]"
                : "lg:col-span-2 lg:min-h-[560px]";
            return (
              <article
                key={service.title}
                className={`svc-card group relative isolate mx-auto flex w-full max-w-[720px] min-h-[460px] flex-col rounded-[2rem] border border-black/10 bg-zinc-900/95 p-6 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.28)] sm:max-w-none sm:rounded-[2.25rem] sm:p-7 md:min-h-[520px] md:p-9 lg:rounded-[2.5rem] lg:p-10 ${layoutClass}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Outer p-* = margin from card edge; inner p-* = gutter around image */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] bg-zinc-950 ring-1 ring-white/[0.12] sm:rounded-[1.5rem] md:rounded-[1.75rem] lg:rounded-[2rem]">
                  {/* Outer air: space between inner shell and photo frame (always visible) */}
                  <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                    {/* Photo sits inset so margin shows as zinc band around image */}
                    <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/[0.08] sm:rounded-[1.35rem]">
                      <div className="relative aspect-[16/10] min-h-[210px] w-full md:aspect-[16/9] md:min-h-[240px] lg:min-h-[260px]">
                        <div className="absolute inset-4 overflow-hidden rounded-xl sm:inset-5 md:inset-6 lg:inset-8">
                          <div
                            className="svc-card-bg absolute inset-0 bg-cover bg-center will-change-transform"
                            style={{
                              backgroundImage: `url(${service.image})`,
                              transformOrigin: "50% 50%",
                            }}
                            aria-hidden="true"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-zinc-950/90 via-black/15 to-transparent" />
                          <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-black/25 to-transparent" />
                          <div className="svc-card-focus pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          {/* Line + index: padded from image edge, not the card border */}
                          <div className="pointer-events-none absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-7">
                            <div className="h-px w-full max-w-[min(100%,14rem)] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                            <div className="flex justify-end pt-2 sm:pt-3">
                              <span className="font-heading text-[2.5rem] font-black leading-none tracking-tighter text-white/50 drop-shadow-md sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem]">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="svc-card-content relative z-10 flex flex-1 flex-col border-t border-white/10 bg-zinc-950 px-10 py-12 sm:px-12 sm:py-14 md:px-16 md:py-16 lg:px-20 lg:py-20 xl:px-24">
                  <div className="mb-9 flex items-start justify-between gap-6 md:mb-10">
                    <span className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-[11px] font-black uppercase leading-[1.35] tracking-[0.2em] text-white md:text-xs md:tracking-[0.22em]">
                      {service.link ? "Platform" : "Service"}
                    </span>
                    <div className="rounded-2xl border border-white/25 bg-white/5 p-4 text-white transition-all duration-500 group-hover:scale-110 group-hover:border-accent/70 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/30">
                      <Icon size={26} />
                    </div>
                  </div>

                  <h3 className="mb-5 text-[1.55rem] font-black leading-[1.18] tracking-tight text-white sm:text-[1.7rem] md:mb-6 md:text-[1.9rem] md:leading-[1.12] lg:text-[2.05rem]">
                    {service.title}
                  </h3>
                  <p className="mb-10 max-w-[52ch] text-base leading-[1.82] text-zinc-100 md:mb-11 md:text-lg md:leading-[1.78] lg:text-xl lg:leading-[1.75]">
                    {service.summary}
                  </p>

                  <ul className="mb-11 flex flex-wrap gap-3 md:mb-12 md:gap-3.5">
                    {service.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-black uppercase leading-[1.25] tracking-[0.1em] text-white md:text-xs md:tracking-[0.12em]"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>

                  {service.link ? (
                    <ButtonPrimary
                      href={service.link}
                      external
                      className="gap-2.5 rounded-full border border-accent/70 bg-accent px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.24em] text-white shadow-lg shadow-accent/20 active:scale-[0.98] md:text-xs"
                    >
                      WinPro AI
                      <ArrowUpRight size={15} />
                    </ButtonPrimary>
                  ) : (
                    <span className="text-xs font-black uppercase leading-[1.45] tracking-[0.22em] text-zinc-300 md:text-sm md:tracking-[0.25em]">
                      Strategy-led
                    </span>
                  )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="svc-process-cta-stack flex flex-col gap-[clamp(3rem,8vw,6rem)] border-t border-black/[0.08] pt-24 md:gap-[clamp(3.5rem,9vw,7rem)] md:pt-36 lg:pt-44">
        <div className="svc-process-container relative">
          <div className="svc-process-intro flex max-w-3xl flex-col gap-8 pb-14 md:gap-10 md:pb-20 lg:gap-12 lg:pb-24">
            <span className="svc-process-kicker block text-[11px] font-black uppercase tracking-[0.38em] text-accent md:text-xs">
              How we work
            </span>
            <h2 className="svc-process-title font-heading text-[2.25rem] font-black uppercase leading-[1.06] tracking-tighter text-foreground sm:text-[2.75rem] md:text-[3.35rem] md:leading-[1.03] lg:text-[3.75rem]">
              Process &amp; scope
            </h2>
            <p className="svc-process-lead max-w-2xl text-[1.05rem] leading-[1.9] text-foreground/60 md:text-lg md:leading-[1.88] lg:text-xl">
              We collapse timelines by focusing only on what matters: discovering the edge, designing
              the system, and deploying for growth.
            </p>
          </div>

          <div className="svc-process-track">
            <div className="svc-process-journey relative">
              <div className="flex flex-col">
                {PROCESS.map((phase) => (
                  <article
                    key={phase.step}
                    className="svc-process-node group grid grid-cols-1 gap-8 border-b border-black/10 py-12 last:border-b-0 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-10 sm:py-14 md:grid-cols-[6.5rem_minmax(0,1fr)] md:gap-14 md:py-16 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-16 lg:py-18"
                  >
                    <div className="svc-process-node-num font-heading text-xs font-black tracking-[0.2em] text-accent sm:pt-1 sm:text-right md:text-sm md:tracking-[0.22em]">
                      {phase.step}
                    </div>
                    <div className="min-w-0 flex flex-col gap-6 md:gap-7">
                      <h3 className="font-heading text-[clamp(1.6rem,3.9vw,2.75rem)] font-black uppercase leading-[1.02] tracking-tighter text-foreground transition-colors duration-300 group-hover:text-accent">
                        {phase.title}
                      </h3>
                      <p className="max-w-xl text-base leading-[1.85] text-foreground/50 md:text-lg md:leading-[1.82]">
                        {phase.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="svc-process-connector-wrap py-14 md:py-20 lg:py-24" aria-hidden>
            <div className="svc-process-connector mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-black/15 to-transparent md:max-w-lg" />
          </div>
        </div>

        <div className="svc-cta relative">
          <div className="svc-cta-inner flex flex-col gap-14 border-t border-black/[0.08] pt-14 md:gap-20 md:pt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-24 lg:pt-24">
            <div className="max-w-2xl flex flex-col gap-8 md:gap-10 lg:gap-12">
              <p className="svc-cta-kicker text-[10px] font-black uppercase tracking-[0.45em] text-accent">
                Next step
              </p>
              <p className="svc-cta-headline font-heading text-[1.75rem] font-black uppercase leading-[1.18] tracking-tight text-foreground sm:text-3xl md:text-[2.25rem] md:leading-[1.14] lg:text-[2.5rem]">
                Tell us what you&apos;re building — we&apos;ll scope it.
              </p>
              <p className="svc-cta-lead max-w-xl text-base leading-[1.95] text-foreground/50 md:text-lg md:leading-[1.88]">
                Share goals, timeline, and budget band—we reply with a clear path forward.
              </p>
            </div>
            <ButtonPrimary
              href="/contact"
              className="svc-cta-btn shrink-0 self-start rounded-full bg-accent px-12 py-[1.125rem] text-[11px] font-black uppercase tracking-[0.28em] text-white shadow-md shadow-accent/25 active:scale-[0.98] lg:self-end"
            >
              Start a project
              <ArrowUpRight size={18} strokeWidth={2.25} />
            </ButtonPrimary>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
