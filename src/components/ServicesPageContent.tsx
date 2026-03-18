"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Layers,
  Monitor,
  Sparkles,
  Video,
} from "lucide-react";

// Register outside to ensure it's done once and early
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
    summary:
      "Identity systems, visual language, and brand architecture built for modern channels.",
    outcomes: ["Naming and strategy", "Brand systems", "Guidelines and rollout"],
    icon: Layers,
  },
  {
    title: "Social Media and Influence",
    summary:
      "Editorial systems and creator partnerships that grow communities and measurable demand.",
    outcomes: ["Content pillars", "Campaign planning", "Influencer alignment"],
    icon: Sparkles,
  },
  {
    title: "Motion Video and 3D",
    summary:
      "High-impact motion assets and product storytelling tailored for paid and organic channels.",
    outcomes: ["Explainer reels", "3D motion design", "Cutdowns for ads"],
    icon: Video,
  },
  {
    title: "AI-Powered Web Development",
    summary:
      "Premium websites accelerated with AI workflows while keeping quality, speed, and conversion first.",
    outcomes: ["Rapid prototyping", "Performance optimization", "Scalable CMS architecture"],
    icon: Bot,
    link: "https://winpro-ai-site.vercel.app",
  },
  {
    title: "Performance Marketing",
    summary:
      "Full-funnel paid campaigns and analytics loops that optimize spend and maximize revenue.",
    outcomes: ["Paid strategy", "Creative testing", "Attribution and reporting"],
    icon: ChartNoAxesCombined,
  },
  {
    title: "UX/UI and WebGL Experiences",
    summary:
      "Immersive interfaces and interactive product journeys engineered for memorability.",
    outcomes: ["Experience design", "Interaction systems", "WebGL implementation"],
    icon: Monitor,
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discover",
    text: "We map your market, audience, and constraints into a clear strategic brief.",
  },
  {
    step: "02",
    title: "Design",
    text: "We shape concepts into production-ready systems with clear creative direction.",
  },
  {
    step: "03",
    title: "Deploy and Scale",
    text: "We launch, test, and continuously optimize for long-term growth.",
  },
];

export default function ServicesPageContent() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cleanupFns: Array<() => void> = [];
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      // Split text for cinematic entry
      const titleEls = gsap.utils.toArray<HTMLElement>(".svc-title-split");
      titleEls.forEach(el => {
        const split = new SplitType(el, { types: "chars" });
        splits.push(split);
      });

      const introTl = gsap.timeline({ defaults: { ease: "expo.out" } });

      introTl
        .fromTo(
          ".svc-kicker",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, delay: 0.2, clearProps: "all" },
        )
        .fromTo(
          ".svc-title-split .char",
          { y: 120, opacity: 0, rotateX: -90, transformOrigin: "0% 50% -50px" },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.5,
            stagger: 0.02,
            ease: "expo.out",
            clearProps: "all"
          },
          "-=1.1",
        )
        .fromTo(
          ".svc-lead",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, clearProps: "all" },
          "-=1.2",
        );

      // Parallax hero section background/text effect
      gsap.to(".svc-hero", {
        y: -100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Interactive Scroll-Scrubbed Card Entry (Premium Parallax Feel)
      const cardsObj = gsap.utils.toArray<HTMLElement>(".svc-card");
      cardsObj.forEach((card, i) => {
        gsap.fromTo(
          card,
          { 
            y: 150, 
            opacity: 0, 
            scale: 0.9, 
            rotateX: -15, 
            transformPerspective: 1000 
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 60%",
              scrub: 1.5, // 1.5s smoothing binds the animation directly to scroll momentum
            },
          }
        );
      });

      // Process and CTA entry
      gsap.fromTo(
        ".svc-process-reveal",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".svc-process",
            start: "top 80%",
          },
        },
      );
      
      gsap.fromTo(
        ".svc-cta-reveal",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".svc-cta-reveal",
            start: "top 85%",
          },
        },
      );

      // Interactive magnetic tilt for cards
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
      cards.forEach((card) => {
        const toRX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        const toRY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
        const toY = gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" });

        gsap.set(card, { transformPerspective: 1200, transformOrigin: "center" });

        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;

          toRX((py - 0.5) * -12);
          toRY((px - 0.5) * 12);
          toY(-10);
        };

        const onLeave = () => {
          toRX(0);
          toRY(0);
          toY(0);
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanupFns.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

    }, rootRef);

    return () => {
      cleanupFns.forEach((fn) => fn());
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-white/5 bg-background pt-36 md:pt-44"
      aria-label="Services overview"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-28 h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-[-8rem] right-[-8rem] h-[50rem] w-[50rem] rounded-full bg-secondary/10 blur-[150px]" />
      </div>

      <div className="_container relative z-10">
        <div className="svc-hero mb-32 md:mb-56 mt-16 md:mt-24">
          <p className="svc-kicker mb-8 text-[11px] font-black uppercase tracking-[0.6em] text-accent">
            Expertise / Solutions
          </p>
          <h1 className="max-w-6xl text-[14vw] font-black uppercase leading-[0.8] tracking-tighter md:text-[8.5vw]">
            <span className="block overflow-hidden pb-2">
              <span className="svc-title-split block">Crafted To</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="svc-title-split block ml-8 md:ml-24 text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.8)] md:[-webkit-text-stroke:3px_rgba(255,255,255,0.8)] italic">Scale</span>
            </span>
            <span className="block overflow-hidden pt-2">
              <span className="svc-title-split block">Modern Brands</span>
            </span>
          </h1>
          <p className="svc-lead mt-16 max-w-2xl text-lg leading-relaxed text-white/50 md:text-2xl font-light">
            Wincore combines human strategy, cinematic production, and AI-enhanced execution to deliver bold
            digital outcomes. Every service is built as a growth layer, not a one-off task.
          </p>
        </div>

        <div className="svc-card-grid mb-32 grid grid-cols-1 gap-8 md:mb-48 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="svc-card group relative min-h-[400px] flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-10 md:p-14 transition-colors duration-500 hover:border-accent/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="mb-10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                      Phase 0{index + 1}
                    </span>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-accent transition-all duration-500 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent/10">
                      <Icon size={24} />
                    </div>
                  </div>

                  <h2 className="mb-5 text-2xl font-black leading-[1.1] md:text-[1.85rem]">
                    {service.title}
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-white/50 md:text-base font-light">{service.summary}</p>

                  <ul className="mb-10 space-y-3">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-3 text-sm text-white/70">
                        <span className="h-1 w-1 rounded-full bg-accent/60" aria-hidden="true" />
                        <span className="font-medium tracking-tight">{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  {service.link ? (
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-accent transition-all duration-300 group-hover:gap-5"
                    >
                      Experience Platform
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                      Strategy First
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="svc-process svc-process-reveal mb-32 rounded-[3.5rem] border border-white/5 bg-white/[0.015] p-12 md:mb-48 md:p-24 backdrop-blur-md">
          <div className="mb-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/10 pb-12">
            <h3 className="text-5xl font-black uppercase tracking-tighter md:text-7xl leading-none">The <span className="text-white/20 italic">Wincore</span> Way</h3>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">
              Agile / Creative / Data-Driven
            </span>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-20">
            {PROCESS.map((phase) => (
              <article
                key={phase.step}
                className="group relative"
              >
                <p className="mb-6 text-[11px] font-black uppercase tracking-[0.4em] text-accent/60">
                  Phase {phase.step}
                </p>
                <h4 className="mb-6 text-3xl font-black tracking-tight md:text-4xl">{phase.title}</h4>
                <div className="w-16 h-[2px] bg-white/10 mb-8 transition-all duration-700 group-hover:w-full group-hover:bg-accent/40" />
                <p className="text-lg text-white/40 leading-relaxed font-light">{phase.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="svc-cta-reveal mb-32 flex flex-col items-start justify-between gap-16 rounded-[3.5rem] border border-accent/20 bg-gradient-to-br from-accent/[0.08] to-transparent p-12 md:mb-48 md:flex-row md:items-center md:p-24 shadow-2xl shadow-accent/5">
          <div className="max-w-3xl">
            <p className="mb-6 text-[11px] font-black uppercase tracking-[0.5em] text-accent">Co-create with us</p>
            <h2 className="text-4xl font-black leading-[0.9] md:text-7xl tracking-tighter uppercase">
              Ready to <span className="text-white/10 italic">evolve</span><br/> your brand?
            </h2>
          </div>

          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-6 rounded-full bg-white px-12 py-6 text-xs font-black uppercase tracking-[0.4em] text-black transition-all duration-500 hover:bg-accent hover:px-14 shadow-2xl shadow-accent/20"
          >
            Start Project
            <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  );
}
