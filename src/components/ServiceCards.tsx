"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

const SERVICES = [
  {
    num: "01",
    title: "Digital Branding",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    desc: "Identity systems engineered for authority across modern channels.",
  },
  {
    num: "02",
    title: "Social & Influence",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200",
    desc: "Campaign narratives designed for reach, retention, and action.",
  },
  {
    num: "03",
    title: "Motion & 3D Video",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200",
    desc: "Cinematic motion language built to stop the scroll.",
  },
  {
    num: "04",
    title: "AI & Web Builds",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    desc: "Modern builds, AI-accelerated workflows, premium performance.",
    link: "https://winpro-ai-site.vercel.app",
  },
  {
    num: "05",
    title: "Performance & Ads",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    desc: "Data-first growth strategies with creative that converts.",
  },
  {
    num: "06",
    title: "UX/UI & WebGL",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1200",
    desc: "Immersive digital architecture built for 2026 experiences.",
  },
];

function ServiceRow({
  service,
  onHover,
  onLeave,
}: {
  service: (typeof SERVICES)[0];
  onHover: () => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="sc-service-row group relative border-b border-black/[0.05] py-12 md:py-16"
    >
      {/* Hover background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Number + Title */}
        <div className="flex items-center gap-5 transition-transform duration-500 group-hover:translate-x-4 md:gap-10">
          <span className="w-10 shrink-0 text-right text-xs font-black italic text-accent/40 transition-colors duration-500 group-hover:text-accent md:w-12">
            {service.num}
          </span>
          <h3 className="text-[10vw] font-black uppercase leading-[0.9] tracking-tight text-foreground/80 transition-colors duration-500 group-hover:text-foreground sm:text-[8.8vw] md:text-[3.6vw] md:leading-[0.92]">
            {service.title}
          </h3>
        </div>

        {/* Desc + CTA */}
        <div className="ml-0 flex flex-col items-start gap-2.5 transition-transform duration-500 group-hover:-translate-x-4 sm:ml-14 md:ml-0 md:items-end md:text-right">
          <p className="max-w-[40ch] text-sm font-light leading-relaxed text-black/45 transition-colors duration-500 group-hover:text-black/75 md:text-base">
            {service.desc}
          </p>
          <div className="flex translate-y-2 items-center gap-2 text-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">
              {service.link ? "Open Platform" : "Explore"}
            </span>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

      gsap.from(".sc-header-kicker", {
        y: reduced ? 0 : 22,
        opacity: reduced ? 1 : 0,
        duration: reduced ? 0 : 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sc-header",
          scroller,
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".sc-header-sub", {
        y: reduced ? 0 : 26,
        opacity: reduced ? 1 : 0,
        duration: reduced ? 0 : 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sc-header",
          scroller,
          start: "top 84%",
          once: true,
        },
      });

      const rows = gsap.utils.toArray<HTMLElement>(".sc-service-row");
      rows.forEach((row, i) => {
        gsap.from(row, {
          y: reduced ? 0 : 58,
          opacity: reduced ? 1 : 0,
          duration: reduced ? 0 : 0.95,
          ease: "power3.out",
          delay: i * 0.05,
          scrollTrigger: {
            trigger: row,
            scroller,
            start: "top 92%",
            once: true,
          },
        });
      });
    }, sectionRef);

    scheduleScrollTriggerRefresh();

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const el = followerRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 1.05, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.05, ease: "power3.out" });

    const moveFollower = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("pointermove", moveFollower, { passive: true });
    return () => window.removeEventListener("pointermove", moveFollower);
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-black/5 bg-background py-16 md:py-24"
      aria-label="Capabilities"
    >
      {/* Right-side accent glow */}
      <div className="pointer-events-none absolute right-[-15vw] top-0 h-[60vw] w-[40vw] rounded-full bg-accent/[0.04] blur-[120px]" />

      <div className="_container relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="sc-header mb-20 flex flex-col items-start justify-between gap-12 md:mb-24 md:flex-row md:items-end"
        >
          <div>
            <p
              ref={kickerRef}
              className="sc-header-kicker mb-8 text-[10px] font-black uppercase tracking-[0.55em] text-accent"
            >
              Core Capabilities
            </p>
            <h2
              ref={headingRef}
              className="pb-1 text-[14vw] font-black uppercase leading-[0.9] tracking-tight text-foreground md:text-[7.4vw]"
            >
              Building<br />
              <span className="text-black/[0.08] italic">Impact</span>
            </h2>
          </div>
          <p
            ref={subRef}
            className="sc-header-sub max-w-[40ch] text-base font-light leading-relaxed text-black/45 md:text-xl"
          >
            We bridge AI precision with cinematic strategy. Every service is built as a growth layer, not a one-off task.
          </p>
        </div>

        {/* Service rows — each individually Intersection Observer triggered */}
        <div>
          {SERVICES.map((s, i) => (
            <ServiceRow
              key={s.title}
              service={s}
              onHover={() => setActiveIndex(i)}
              onLeave={() => setActiveIndex(null)}
              isActive={activeIndex === i}
            />
          ))}
        </div>
      </div>

      <div
        ref={followerRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 overflow-hidden rounded-[2.5rem] shadow-2xl"
        style={{
          width: "440px",
          aspectRatio: "4/5",
          transform: "translate(-50%, -50%)",
          opacity: activeIndex !== null ? 1 : 0,
          scale: activeIndex !== null ? "1" : "0.85",
          filter: activeIndex !== null ? "brightness(1.05)" : "brightness(0.65)",
          transition:
            "opacity 0.8s cubic-bezier(0.16,1,0.3,1), scale 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease",
        }}
      >
        {SERVICES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: activeIndex === i ? 1 : 0,
              scale: activeIndex === i ? "1" : "1.15", // slight zoom out when active
              filter: activeIndex === i ? "grayscale(0%) saturate(1.1)" : "grayscale(100%)",
              transition: "opacity 0.7s ease, scale 1.2s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease",
            }}
          >
            <Image src={s.image} alt={s.title} fill className="object-cover" sizes="440px" quality={90} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}
        {activeIndex !== null && (
          <div className="absolute bottom-6 left-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
            {SERVICES[activeIndex].num} / {SERVICES.length}
          </div>
        )}
      </div>
    </section>
  );
}
