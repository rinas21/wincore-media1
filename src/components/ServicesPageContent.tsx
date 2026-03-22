"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Layers,
  Monitor,
  Sparkles,
  Video,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
    gsap.registerPlugin(ScrollTrigger);

    const scroller = document.documentElement;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      className="relative overflow-hidden border-t border-white/5 bg-background pb-20 pt-6 md:pb-28 md:pt-8"
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
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="_container relative z-10">
        <header className="svc-intro mb-16 md:mb-20">
          <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 md:p-10 lg:p-12">
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-accent/80 via-accent/20 to-transparent md:left-6" />
            <div className="pl-4 md:pl-8">
              <p className="svc-kicker mb-5 text-[10px] font-black uppercase tracking-[0.55em] text-accent">
                Services
              </p>
              <h1 className="font-heading text-3xl font-black uppercase leading-[1.06] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.85rem] lg:leading-[1.08]">
                <span className="svc-title-line block">
                  Built to scale{" "}
                  <span className="text-secondary italic">modern</span> brands.
                </span>
                <span className="svc-title-line mt-2 block text-white/55 md:mt-3">
                  Strategy, craft &amp; AI — end to end.
                </span>
              </h1>
              <p className="svc-lead mt-6 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
                Wincore Agency delivers digital-first branding, motion, performance, and immersive
                web. One partner, one bar for quality.
              </p>
              <div className="svc-meta-row mt-8 flex flex-wrap gap-6 border-t border-white/[0.06] pt-6 text-[10px] font-black uppercase tracking-[0.35em] text-white/30">
                <span>Colombo &amp; remote</span>
                <span className="text-accent/90">WebGL · AI · Motion</span>
                <span>Strategy-led delivery</span>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
            Capabilities
          </h2>
          <span className="hidden text-[9px] font-black uppercase tracking-[0.4em] text-white/25 sm:inline">
            06 disciplines
          </span>
        </div>

        <div className="svc-card-grid mb-20 grid grid-cols-1 gap-4 perspective-[1200px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="svc-card group relative flex flex-col rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-[border-color,box-shadow] duration-500 hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(0,191,255,0.12)] md:min-h-[300px] md:p-7"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_10%_0%,rgba(0,191,255,0.08),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mb-5 flex items-start justify-between gap-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5 text-accent transition-transform duration-500 group-hover:scale-105 group-hover:border-accent/30">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="relative mb-2 text-[15px] font-bold leading-snug tracking-tight text-white md:text-base">
                  {service.title}
                </h3>
                <p className="relative mb-4 flex-1 text-[13px] leading-relaxed text-white/45 md:text-sm">
                  {service.summary}
                </p>
                <ul className="relative mb-4 space-y-1.5 border-t border-white/[0.07] pt-4">
                  {service.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-center gap-2 text-[11px] text-white/55 md:text-xs"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden />
                      {outcome}
                    </li>
                  ))}
                </ul>
                {service.link ? (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-accent hover:opacity-90"
                  >
                    WinPro AI
                    <ArrowUpRight size={12} />
                  </a>
                ) : (
                  <span className="relative text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
                    Strategy-led
                  </span>
                )}
              </article>
            );
          })}
        </div>

        <div className="svc-process relative mb-20 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-10">
          <div className="svc-process-inner relative">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-secondary/[0.06] blur-3xl" />
            <div className="relative mb-10 flex flex-col gap-3 border-b border-white/[0.06] pb-8 md:flex-row md:items-end md:justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                How we <span className="text-secondary/90 italic">work</span>
              </h3>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25">
                Discover → Design → Deploy
              </span>
            </div>
            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {PROCESS.map((phase) => (
                <article key={phase.step} className="svc-phase">
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.35em] text-accent/90">
                    {phase.step}
                  </p>
                  <h4 className="mb-2 text-lg font-bold text-white">{phase.title}</h4>
                  <p className="text-[13px] leading-relaxed text-white/42 md:text-sm">{phase.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="svc-cta relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.09] via-transparent to-secondary/[0.05]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_20%,rgba(0,191,255,0.12),transparent_60%)]" />
          <div className="svc-cta-inner relative flex flex-col items-start justify-between gap-8 p-6 md:flex-row md:items-center md:p-10">
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.45em] text-accent">
                Next step
              </p>
              <p className="text-xl font-black uppercase leading-tight tracking-tight text-white md:text-2xl">
                Tell us what you&apos;re building — we&apos;ll scope it.
              </p>
            </div>
            <Link
              href="/contact"
              className="relative inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.35em] text-[#0A0A0A] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
