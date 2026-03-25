"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

type ServiceDetail = {
  num: string;
  title: string;
  image: string;
  desc: string;
  link: string | null;
  linkLabel?: string;
  what: string;
  deliverables: string[];
  processSteps: string[];
  ideal: string;
};

const SERVICES: ServiceDetail[] = [
  {
    num: "01",
    title: "Digital Branding",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    desc: "Identity systems engineered for authority across modern channels.",
    link: null,
    what:
      "We craft brand identities that command attention — from naming and strategy to a full visual system that scales across every platform. This isn't a logo project; it's an authority engine.",
    deliverables: [
      "Brand strategy & positioning",
      "Naming & messaging framework",
      "Logo & icon system",
      "Typography & colour palette",
      "Full design system (Figma)",
      "Brand guidelines document",
    ],
    processSteps: [
      "Discovery & competitor audit",
      "Strategy workshop & naming",
      "Visual concept development",
      "Refinement & feedback rounds",
      "Final delivery & rollout",
    ],
    ideal:
      "Founders launching or rebranding, agencies needing white-label identity work, and enterprises seeking a modern visual refresh.",
  },
  {
    num: "02",
    title: "Social & Influence",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200",
    desc: "Campaign narratives designed for reach, retention, and action.",
    link: null,
    what:
      "Editorial content, creator partnerships, and platform-native campaigns that turn followers into customers. We build rhythms — not one-off posts — so your brand compounds over time.",
    deliverables: [
      "Content pillar strategy",
      "Monthly content calendar",
      "Short-form video scripts & direction",
      "Creator / influencer sourcing",
      "Platform analytics reporting",
      "Community management protocols",
    ],
    processSteps: [
      "Audience & platform audit",
      "Pillar & narrative strategy",
      "Content production & scheduling",
      "Creator outreach & briefing",
      "Performance review & iteration",
    ],
    ideal:
      "E-commerce brands, lifestyle companies, and product launches needing consistent, high-quality social presence.",
  },
  {
    num: "03",
    title: "Motion & 3D Video",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200",
    desc: "Cinematic motion language built to stop the scroll.",
    link: null,
    what:
      "From reels and explainers to full 3D product renders, we produce motion content that elevates brand perception and drives engagement — built specifically for paid and organic campaigns.",
    deliverables: [
      "Brand motion system & templates",
      "3D product / brand animations",
      "Short-form ad cutdowns (15s, 30s, 60s)",
      "Explainer videos",
      "Social-ready reels & stories",
      "Raw files + delivery-ready exports",
    ],
    processSteps: [
      "Brief & creative direction",
      "Storyboarding & animatic",
      "3D modelling / motion production",
      "Sound design & colour grading",
      "Delivery & ad adaptation",
    ],
    ideal:
      "Product companies, SaaS brands, and any business wanting video assets that compete at the highest creative standard.",
  },
  {
    num: "04",
    title: "AI & Web Builds",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    desc: "Modern builds, AI-accelerated workflows, premium performance.",
    link: "https://winpro-ai-site.vercel.app",
    linkLabel: "Open Platform",
    what:
      "We build fast, premium web experiences using AI-accelerated development — cutting delivery time without compromising quality. From landing pages to full SaaS products, shipped with purpose.",
    deliverables: [
      "Custom Next.js / Vite web apps",
      "AI-integrated features & automations",
      "CMS setup (Sanity, Contentful, Payload)",
      "Performance & Core Web Vitals optimisation",
      "SEO architecture",
      "Ongoing maintenance retainer",
    ],
    processSteps: [
      "Discovery & technical scoping",
      "UI/UX wireframes & design",
      "Development sprint",
      "QA, performance audit & launch",
      "Post-launch support",
    ],
    ideal:
      "Startups needing a fast market entry, agencies wanting white-label web builds, and established brands upgrading to modern stacks.",
  },
  {
    num: "05",
    title: "Performance & Ads",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    desc: "Data-first growth strategies with creative that converts.",
    link: null,
    what:
      "Full-funnel paid media strategy — Meta, Google, TikTok, and beyond — paired with creative that's built to outperform. We run testing loops so every pound spent gets smarter.",
    deliverables: [
      "Paid media strategy & budget planning",
      "Ad creative production (static, video, UGC)",
      "Campaign setup & audience architecture",
      "Weekly performance reporting",
      "A/B testing framework",
      "Attribution & analytics setup",
    ],
    processSteps: [
      "Funnel & audience audit",
      "Creative strategy & production",
      "Campaign launch",
      "Testing loops & optimisation",
      "Scaling & reporting",
    ],
    ideal:
      "DTC brands, SaaS companies, and local businesses ready to put budget behind a disciplined, creative-led growth strategy.",
  },
  {
    num: "06",
    title: "UX/UI & WebGL",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1200",
    desc: "Immersive digital architecture built for 2026 experiences.",
    link: null,
    what:
      "Product UX, interface design, and WebGL experiences that blur the line between web and world. Where it fits, we build it in 3D — where it doesn't, we build it beautifully.",
    deliverables: [
      "UX research & user flows",
      "High-fidelity Figma UI design",
      "Interactive prototype",
      "WebGL / Three.js scene development",
      "Accessibility (WCAG AA) audit",
      "Design-to-dev handoff",
    ],
    processSteps: [
      "User research & journey mapping",
      "Information architecture",
      "UI design & component system",
      "WebGL integration & testing",
      "Handoff & developer support",
    ],
    ideal:
      "Product teams, creative studios, and ambitious brands wanting a digital experience that genuinely stands out.",
  },
];

/* ─── Service detail modal ─────────────────────────────────────────────── */
function ServiceModal({
  service,
  onClose,
}: {
  service: ServiceDetail | null;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* entrance */
  useEffect(() => {
    if (!service || !overlayRef.current || !panelRef.current) return;
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 0, y: 56, scale: 0.96 });
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(overlayRef.current, { opacity: 1, duration: 0.35 })
      .to(panelRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.55 }, "-=0.2")
      .fromTo(
        ".smodal-stagger",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.045, clearProps: "transform,opacity" },
        "-=0.32",
      );
    return () => { tl.kill(); };
  }, [service]);

  const handleClose = useCallback(() => {
    if (!overlayRef.current || !panelRef.current) { onClose(); return; }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { opacity: 0, y: 32, scale: 0.97, duration: 0.28, ease: "power3.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.22 }, "-=0.12");
  }, [onClose]);

  /* backdrop click */
  const onBackdrop = useCallback(
    (e: React.MouseEvent) => { if (e.target === overlayRef.current) handleClose(); },
    [handleClose],
  );

  /* Escape key */
  useEffect(() => {
    if (!service) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [service, handleClose]);

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = service ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [service]);

  if (!service) return null;

  return (
    <div
      ref={overlayRef}
      onClick={onBackdrop}
      className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title} — service details`}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-[2rem] bg-background shadow-[0_32px_80px_rgba(0,0,0,0.18)] sm:rounded-[2rem] scrollbar-hide"
      >
        {/* ── Hero image ── */}
        <div className="relative h-56 w-full overflow-hidden rounded-t-[2rem] sm:h-72">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            quality={90}
          />
          {/* gradient overlay — matches site's team card gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          {/* number badge */}
          <span className="absolute left-7 bottom-14 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
            {service.num}
          </span>

          {/* title — same weight/case as site headings */}
          <h2 className="absolute left-7 bottom-6 text-2xl font-black uppercase leading-[1.08] tracking-tight text-white sm:text-[1.75rem]">
            {service.title}
          </h2>

          {/* close */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/55 hover:text-white"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-7 py-9 sm:px-10 sm:py-10">

          {/* What we do */}
          <p className="smodal-stagger mb-8 text-[15px] font-light leading-[1.8] text-black/50">
            {service.what}
          </p>

          {/* Thin divider — matches site's divide-black/[0.06] */}
          <div className="smodal-stagger mb-8 h-px w-full bg-black/[0.06]" />

          {/* Two-col grid: Deliverables + Process */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">

            {/* Deliverables */}
            <div className="smodal-stagger">
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.5em] text-accent">
                Deliverables
              </p>
              <ul className="flex flex-col gap-3">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[13px] font-medium leading-[1.65] text-black/55">
                    {/* accent dot — matches site's list bullet style */}
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="smodal-stagger">
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.5em] text-accent">
                Our Process
              </p>
              <ol className="flex flex-col gap-3">
                {service.processSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-[13px] font-medium leading-[1.65] text-black/55">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/20 text-[9px] font-black text-accent">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Ideal for — tint block matching site's accent/[0.06] convention */}
          <div className="smodal-stagger mt-8 rounded-2xl bg-accent/[0.05] px-6 py-5 border border-accent/[0.08]">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.5em] text-accent">
              Ideal for
            </p>
            <p className="text-[13px] font-light leading-[1.8] text-black/55">{service.ideal}</p>
          </div>

          {/* CTA row */}
          <div className="smodal-stagger mt-9 flex flex-col-reverse items-stretch gap-3 border-t border-black/[0.06] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleClose}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 transition-colors hover:text-black/55"
            >
              Close
            </button>

            {service.link ? (
              <a
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.35em] text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {service.linkLabel ?? "Explore"}
                <ArrowUpRight size={13} />
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.35em] text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start a project
                <ArrowUpRight size={13} />
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── Main section ─────────────────────────────────────────────────────── */
export default function ServiceCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalService, setModalService] = useState<ServiceDetail | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    if (!headingRef.current) return;

    const splits: SplitType[] = [];
    const split = new SplitType(headingRef.current, { types: "chars" });
    splits.push(split);

    const ctx = gsap.context(() => {
      if (split.chars) {
        gsap.fromTo(
          split.chars,
          { yPercent: reduced ? 0 : 115, opacity: reduced ? 1 : 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: reduced ? 0 : 0.95,
            stagger: 0.016,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: headingRef.current,
              scroller,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      gsap.fromTo(
        ".sc-kicker",
        { y: reduced ? 0 : 20, opacity: reduced ? 1 : 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: ".sc-kicker", scroller, start: "top 90%", once: true },
        },
      );

      gsap.fromTo(
        ".sc-sub",
        { y: reduced ? 0 : 24, opacity: reduced ? 1 : 0 },
        {
          y: 0, opacity: 1, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: ".sc-sub", scroller, start: "top 88%", once: true },
        },
      );

      const rows = gsap.utils.toArray<HTMLElement>(".sc-row");
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { y: reduced ? 0 : 48, opacity: reduced ? 1 : 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            delay: i * 0.04,
            scrollTrigger: { trigger: row, scroller, start: "top 92%", once: true },
          },
        );
      });
    }, sectionRef);

    scheduleScrollTriggerRefresh();

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  const openModal = useCallback((s: ServiceDetail) => setModalService(s), []);
  const closeModal = useCallback(() => setModalService(null), []);

  return (
    <>
      <section
        id="services"
        ref={sectionRef}
        className="relative overflow-hidden bg-background py-24 md:py-36"
        aria-label="Capabilities"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute right-[-12vw] top-0 h-[55vw] w-[38vw] rounded-full bg-accent/[0.04] blur-[130px]" />

        <div className="_container relative z-10">

          {/* ── Header ── */}
          <div className="mb-24 flex flex-col gap-10 md:mb-32 md:flex-row md:items-end md:justify-between">
            <div>
              {/* kicker — matches site standard exactly */}
              <p className="sc-kicker mb-8 text-[11px] font-black uppercase leading-[1.4] tracking-[0.5em] text-accent">
                Core Capabilities
              </p>
              <h2
                ref={headingRef}
                className="pb-1 text-[13vw] font-black uppercase leading-[0.94] tracking-tight text-foreground md:text-[7vw]"
              >
                Building<br />
                <span className="text-black/[0.07] italic">Impact</span>
              </h2>
            </div>
            <p className="sc-sub max-w-[38ch] text-base font-light leading-[1.75] text-black/45 md:text-lg md:text-right">
              We bridge AI precision with cinematic strategy. Every service is built as a growth layer, not a one-off task.
            </p>
          </div>

          {/* ── Service Rows ── */}
          <div className="flex flex-col divide-y divide-black/[0.06]">
            {SERVICES.map((s, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={s.title}
                  className="sc-row group relative cursor-pointer overflow-hidden"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* expanding image panel */}
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      width: isHovered ? "40%" : "0%",
                      opacity: isHovered ? 1 : 0,
                    }}
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover transition-transform duration-[1000ms] ease-out"
                      style={{ transform: isHovered ? "scale(1)" : "scale(1.08)" }}
                      sizes="40vw"
                      quality={90}
                    />
                    {/* fade to background on the right edge — seamless blend */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/60" />
                  </div>

                  {/* row content */}
                  <div
                    className="relative z-10 flex items-center justify-between gap-6 py-11 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:py-14"
                    style={{
                      paddingLeft: isHovered ? "calc(40% + 2.5rem)" : "0rem",
                    }}
                  >
                    {/* number */}
                    <span className="hidden shrink-0 text-[11px] font-black italic tracking-[0.08em] text-black/20 transition-colors duration-300 group-hover:text-accent md:block md:w-12">
                      {s.num}
                    </span>

                    {/* title */}
                    <h3 className="flex-1 text-[8.5vw] font-black uppercase leading-[0.96] tracking-tight text-foreground/75 transition-colors duration-300 group-hover:text-foreground md:text-[3.8vw]">
                      {s.title}
                    </h3>

                    {/* right side: desc + button */}
                    <div className="flex shrink-0 flex-col items-end gap-4 text-right">
                      <p className="hidden max-w-[28ch] text-[13px] font-light leading-[1.7] text-black/40 transition-colors duration-300 group-hover:text-black/65 md:block">
                        {s.desc}
                      </p>

                      {/* Explore button — pill style, consistent with site CTA language */}
                      <button
                        onClick={() => openModal(s)}
                        aria-label={`Explore ${s.title}`}
                        className="flex items-center gap-2 rounded-full border border-black/10 bg-background px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.38em] text-foreground/50 shadow-sm transition-all duration-300 hover:border-accent/30 hover:bg-accent hover:text-white hover:shadow-md hover:shadow-accent/20"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered ? "translateY(0)" : "translateY(8px)",
                          transition:
                            "opacity 0.3s ease, transform 0.3s ease, background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s",
                          pointerEvents: isHovered ? "auto" : "none",
                        }}
                      >
                        {s.link ? s.linkLabel ?? "Open Platform" : "Explore"}
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <ServiceModal service={modalService} onClose={closeModal} />
    </>
  );
}
