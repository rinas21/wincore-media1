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
  link?: string;
};

const SERVICES: ServiceItem[] = [
  {
    title: "Digital-First Branding",
    summary: "Identity, visual language, and brand systems for modern channels.",
    outcomes: ["Strategy & naming", "Design systems", "Rollout"],
    icon: Layers,
  },
  {
    title: "Social & Influence",
    summary: "Editorial rhythm and creator partnerships that convert attention.",
    outcomes: ["Content pillars", "Campaigns", "Partnerships"],
    icon: Sparkles,
  },
  {
    title: "Motion Video & 3D",
    summary: "Reels, explainers, and 3D storytelling for paid and organic.",
    outcomes: ["Motion design", "3D assets", "Ad cutdowns"],
    icon: Video,
  },
  {
    title: "AI-Powered Web Development",
    summary: "Fast, premium sites with AI-assisted workflows and strong performance.",
    outcomes: ["Prototyping", "Performance", "CMS"],
    icon: Bot,
    link: "https://winpro-ai-site.vercel.app",
  },
  {
    title: "Performance Marketing",
    summary: "Full-funnel paid media with testing loops and clear reporting.",
    outcomes: ["Paid strategy", "Creative tests", "Attribution"],
    icon: ChartNoAxesCombined,
  },
  {
    title: "UX/UI & WebGL",
    summary: "Product UX, UI craft, and immersive WebGL where it matters.",
    outcomes: ["UX systems", "UI design", "WebGL"],
    icon: Monitor,
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
            { opacity: 0, y: 36, duration: 0.85, stagger: 0.1 },
            0.22,
          )
          .from(".svc-lead", { opacity: 0, y: 22, duration: 0.75 }, "-=0.45")
          .from(".svc-meta-row", { opacity: 0, y: 14, duration: 0.55 }, "-=0.35");

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
          [".svc-kicker", ".svc-title-line", ".svc-lead", ".svc-meta-row", ".svc-orb"],
          { clearProps: "all" },
        );
      }

      // --- Cards: per-card scroll reveal (Lenis needs explicit scroller) ---
      if (!reduced) {
        const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
        cards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 44,
            rotateX: -6,
            transformOrigin: "50% 0%",
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              scroller,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      // --- Process strip ---
      gsap.from(".svc-process-inner", {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 48,
        duration: reduced ? 0 : 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".svc-process",
          scroller,
          start: "top 86%",
          once: true,
        },
      });

      gsap.from(".svc-phase", {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 28,
        duration: reduced ? 0 : 0.65,
        stagger: reduced ? 0 : 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".svc-process",
          scroller,
          start: "top 78%",
          once: true,
        },
      });

      // --- CTA ---
      gsap.from(".svc-cta-inner", {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 32,
        scale: reduced ? 1 : 0.98,
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
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-black/5 bg-background pb-20 pt-6 md:pb-28 md:pt-8"
      aria-label="Services overview"
    >
      {/* Ambient + grid */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={glowRef}
          className="svc-orb absolute left-1/2 top-[-18%] h-[min(55vh,480px)] w-[min(90vw,720px)] -translate-x-1/2 rounded-full bg-accent/[0.09] blur-[120px]"
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="_container relative z-10">
        <header className="svc-intro mb-16 md:mb-20">
          <div className="relative rounded-2xl bg-white px-8 py-10 shadow-xl shadow-black/8 md:px-12 md:py-14 lg:px-14 lg:py-16 overflow-hidden transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/12">
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-accent/80 via-accent/20 to-transparent md:left-6" />
            <div className="pl-4 md:pl-8">
              <p className="svc-kicker mb-5 text-[10px] font-black uppercase tracking-[0.55em] text-accent leading-[1.45] pb-1">
                Services
              </p>
              <h1 className="font-heading text-3xl font-black uppercase leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[2.85rem] lg:leading-[1.18]">
                <span className="svc-title-line block">
                  Built to scale{" "}
                  <span className="text-secondary italic">modern</span> brands.
                </span>
                <span className="svc-title-line mt-2 block text-foreground/60 md:mt-3">
                  Strategy, craft &amp; AI — end to end.
                </span>
              </h1>
              <p className="svc-lead mt-6 max-w-2xl text-sm leading-relaxed text-foreground/55 md:text-base">
                Wincore Agency delivers digital-first branding, motion, performance, and immersive
                web. One partner, one bar for quality.
              </p>
              <div className="svc-meta-row mt-10 flex flex-wrap gap-8 pt-10 text-[10px] font-black uppercase tracking-[0.35em] text-foreground/40 leading-[1.5]">
                <span>Colombo &amp; remote</span>
                <span className="text-accent/90">WebGL · AI · Motion</span>
                <span>Strategy-led delivery</span>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-12 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl leading-[1.1]">
            Capabilities
          </h2>
          <span className="hidden text-[10px] font-black uppercase tracking-[0.4em] text-foreground/35 sm:inline leading-[1.4]">
            06 disciplines
          </span>
        </div>

        <div className="svc-card-grid mb-20 grid grid-cols-1 gap-4 perspective-[1200px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="svc-card group relative flex flex-col rounded-2xl bg-white px-9 py-12 shadow-lg shadow-black/8 transition-all duration-500 hover:shadow-2xl hover:shadow-black/15 hover:scale-[1.02] md:min-h-[320px] md:px-11 md:py-14 lg:px-12 lg:py-16 overflow-visible isolate"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,rgba(0,191,255,0.08),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative mb-7 flex items-start justify-between gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/40 leading-[1.3]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="rounded-xl bg-white p-3.5 text-accent shadow-md shadow-black/8 transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/40">
                    <Icon size={22} />
                  </div>
                </div>
                <h3 className="relative mb-3 text-[17px] font-bold leading-[1.3] tracking-tight text-foreground md:text-lg">
                  {service.title}
                </h3>
                <p className="relative mb-6 flex-1 text-[14px] leading-[1.6] text-foreground/55 md:text-base">
                  {service.summary}
                </p>
                <ul className="relative mb-6 space-y-2 pt-6">
                  {service.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-center gap-2.5 text-[12px] text-foreground/60 md:text-sm leading-[1.5]"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/80" aria-hidden />
                      {outcome}
                    </li>
                  ))}
                </ul>
                {service.link ? (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:opacity-90 leading-[1.4]"
                  >
                    WinPro AI
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="relative text-[10px] font-black uppercase tracking-[0.25em] text-foreground/35 leading-[1.4]">
                    Strategy-led
                  </span>
                )}
              </article>
            );
          })}
        </div>

        <div className="svc-process relative mb-20 overflow-hidden overflow-visible isolate rounded-2xl bg-white px-9 py-12 shadow-xl shadow-black/8 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/12 md:px-14 md:py-16 lg:px-16 lg:py-18">
          <div className="svc-process-inner relative">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-secondary/[0.06] blur-3xl" />
            <div className="relative mb-12 flex flex-col gap-4 pb-10 md:flex-row md:items-end md:justify-between">
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl leading-[1.1]">
                How we <span className="text-secondary/90 italic">work</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/35 leading-[1.4]">
                Discover → Design → Deploy
              </span>
            </div>
            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
              {PROCESS.map((phase) => (
                <article key={phase.step} className="svc-phase">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-accent/90 leading-[1.4]">
                    {phase.step}
                  </p>
                  <h4 className="mb-3 text-lg font-bold text-foreground leading-[1.25]">{phase.title}</h4>
                  <p className="text-[14px] leading-[1.6] text-foreground/55 md:text-base">{phase.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="svc-cta relative overflow-hidden overflow-visible isolate rounded-2xl bg-gradient-to-br from-accent/[0.09] via-transparent to-secondary/[0.05] shadow-lg shadow-accent/25 transition-shadow duration-500 hover:shadow-xl hover:shadow-accent/35">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_20%,rgba(0,191,255,0.12),transparent_60%)]" />
          <div className="svc-cta-inner relative flex flex-col items-start justify-between gap-10 px-9 py-12 md:flex-row md:items-center md:px-14 md:py-16 lg:px-16 lg:py-18">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.45em] text-accent leading-[1.4]">
                Next step
              </p>
              <p className="text-2xl font-black uppercase leading-[1.15] tracking-tight text-foreground md:text-3xl">
                Tell us what you&apos;re building — we&apos;ll scope it.
              </p>
            </div>
            <Link
              href="/contact"
              className="relative inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-12 py-4 text-[11px] font-black uppercase tracking-[0.35em] text-white transition-transform hover:scale-[1.02] active:scale-[0.98] leading-[1.3]"
            >
              Contact
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
