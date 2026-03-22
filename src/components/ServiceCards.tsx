"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

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

// Single service row — uses Intersection Observer for bulletproof reveal
function ServiceRow({
  service,
  index,
  onHover,
  onLeave,
  isActive,
}: {
  service: (typeof SERVICES)[0];
  index: number;
  onHover: () => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <div
      ref={ref}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative border-b border-white/[0.06] py-10 md:py-14"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`,
      }}
    >
      {/* Hover background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Number + Title */}
        <div className="flex items-center gap-6 transition-transform duration-500 group-hover:translate-x-4 md:gap-10">
          <span className="w-8 shrink-0 text-right text-xs font-black italic text-accent/30 transition-colors duration-500 group-hover:text-accent">
            {service.num}
          </span>
          <h3 className="text-[8vw] font-black uppercase leading-none tracking-tighter text-white/90 transition-colors duration-500 group-hover:text-white md:text-[3.6vw]">
            {service.title}
          </h3>
        </div>

        {/* Desc + CTA */}
        <div className="ml-14 flex flex-col items-start gap-2 transition-transform duration-500 group-hover:-translate-x-4 md:ml-0 md:items-end md:text-right">
          <p className="max-w-[38ch] text-sm font-light leading-snug text-white/30 transition-colors duration-500 group-hover:text-white/70 md:text-base">
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!headingRef.current || !headerInView) return;

    const splits: SplitType[] = [];
    const split = new SplitType(headingRef.current, { types: "chars" });
    splits.push(split);

    if (split.chars) {
      gsap.fromTo(
        split.chars,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.018,
          ease: "expo.out",
          clearProps: "transform,opacity",
        }
      );
    }

    return () => splits.forEach((s) => s.revert());
  }, [headerInView]);

  useEffect(() => {
    const moveFollower = (e: MouseEvent) => {
      if (!followerRef.current) return;
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.4,
        ease: "power4.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", moveFollower);
    return () => window.removeEventListener("mousemove", moveFollower);
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/5 bg-background py-[10vw]"
      aria-label="Capabilities"
    >
      {/* Right-side accent glow */}
      <div className="pointer-events-none absolute right-[-15vw] top-0 h-[60vw] w-[40vw] rounded-full bg-accent/[0.04] blur-[120px]" />

      <div className="_container relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-16 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end"
        >
          <div>
            <p
              ref={kickerRef}
              className="mb-6 text-[10px] font-black uppercase tracking-[0.55em] text-accent"
              style={{
                opacity: headerInView ? 1 : 0,
                transform: headerInView ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              Core Capabilities
            </p>
            <h2
              ref={headingRef}
              className="text-[13vw] font-black uppercase leading-[0.82] tracking-tighter md:text-[7vw]"
            >
              Building<br />
              <span className="text-white/5 italic">Impact</span>
            </h2>
          </div>
          <p
            ref={subRef}
            className="max-w-[38ch] text-base font-light leading-relaxed text-white/35 md:text-xl"
            style={{
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}
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
              index={i}
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
          filter: activeIndex !== null ? "blur(0px) brightness(1.1)" : "blur(20px) brightness(0.5)",
          transition:
            "opacity 0.8s cubic-bezier(0.16,1,0.3,1), scale 0.8s cubic-bezier(0.16,1,0.3,1), filter 1s ease",
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
            <Image src={s.image} alt={s.title} fill className="object-cover" sizes="440px" />
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
