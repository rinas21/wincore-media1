"use client";

import { useParams } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import PageMain from "@/components/PageMain";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  ChevronRight,
  Compass,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      gsap.fromTo(".hero-stat", 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
        }
      );

      gsap.fromTo(".feature-card", 
        { opacity: 0, y: 60, rotationX: -15, transformOrigin: "top center", transformPerspective: 1000 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.15,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".feature-cards-container",
            start: "top 80%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <PageMain>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight">
              Project Not Found
            </h1>
            <Link
              href="/works"
              className="mt-8 inline-block text-accent underline underline-offset-4"
            >
              Back to Archive
            </Link>
          </div>
        </div>
      </PageMain>
    );
  }

  const impactNumber = project.impact.split(" ")[0];

  return (
    <PageMain>
      <div ref={containerRef} className="bg-background selection:bg-accent/20 relative">
        <div className="noise-overlay opacity-[0.03]" />

        {/* ── HERO ── */}
        <section className="relative pt-[160px] md:pt-[240px] pb-32 md:pb-48 overflow-hidden bg-background text-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,136,204,0.03),transparent_70%)] pointer-events-none" />

          <div className="_container relative z-10">
            {/* Nav row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-20 md:mb-24">
              <Link
                href="/works"
                className="group flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-accent transition-colors duration-300"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                Selected Works
              </Link>
              <span className="h-4 w-px bg-foreground/10 hidden sm:block" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-foreground/30">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <div className="mb-20 md:mb-28 w-full">
              <h1 className="text-[clamp(3.5rem,11vw,10.5rem)] font-black leading-[0.8] tracking-[-0.03em] uppercase">
                {project.title.split(" ").map((word, i, arr) => (
                  <span
                    key={i}
                    className={`inline-block reveal mr-[0.25em] ${
                      i === arr.length - 1 ? "text-foreground/20" : "text-foreground"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            {/* Description + stats row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start pt-16 border-t border-foreground/[0.08]">
              {/* Spacer on desktop for that luxury left indent */}
              <div className="hidden lg:block lg:col-span-1 border-t-2 border-accent w-12 -mt-[17px]"></div>

              {/* Description */}
              <div className="lg:col-span-7 reveal lg:pr-10">
                <p className="text-2xl md:text-3xl lg:text-4xl text-foreground font-light leading-[1.4] tracking-tight">
                  {project.description}
                </p>
              </div>

              {/* Stats Block */}
              <div className="lg:col-span-3 lg:col-start-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-10 lg:pl-12 lg:border-l border-foreground/[0.08] mt-8 lg:mt-0">
                {[
                  { label: "Impact", value: project.impact },
                  { label: "Timeline", value: project.duration },
                  { label: "Role", value: project.role },
                ].map((stat) => (
                  <div key={stat.label} className="hero-stat flex flex-col gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30">
                      {stat.label}
                    </p>
                    <p className="text-xl md:text-2xl font-medium tracking-tight text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <section className="pb-16 md:pb-24 bg-background">
          <div className="_container">
            <div 
              className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] reveal"
              style={{ marginTop: '20px', marginBottom: '20px' }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                priority
              />
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="_container reveal">
          <div className="w-full h-px bg-foreground/[0.08] my-16 md:my-24" />
        </div>

        {/* ── 01: THE CHALLENGE ── */}
        <section className="py-24 md:py-32 lg:py-40 bg-background">
          <div className="_container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Left: label + heading + body */}
              <div className="lg:col-span-5 lg:pr-10 reveal">
                <div className="flex items-center gap-5 mb-10 md:mb-12">
                  <span className="w-10 h-px bg-accent flex-shrink-0" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                    01 — Problem Architecture
                  </p>
                </div>
                <h2 className="text-[clamp(3rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] mb-10 md:mb-14 text-foreground">
                  The Friction<br />Point.
                </h2>
                <div className="space-y-8 text-lg md:text-xl text-foreground/60 font-light leading-[1.6]">
                  <p>{project.problem}</p>
                  <p>
                    Digital ecosystems often fail precisely where they should
                    excel: the intersection of emotion and utility. For{" "}
                    {project.title}, the existing infrastructure lacked the
                    tactile prestige required by their global clientele.
                  </p>
                </div>
              </div>

              {/* Right: premium quote card */}
              <div className="lg:col-span-7 reveal flex flex-col justify-center">
                <div 
                  className="bg-[#f8f8f9] rounded-[2.5rem] relative h-fit flex flex-col group transition-all duration-500 hover:bg-[#f0f0f1] border border-foreground/[0.03]"
                  style={{ padding: 'max(4rem, 8vw)' }}
                >
                  <div className="relative z-10 flex flex-col gap-12">
                    <Compass
                      size={40}
                      className="text-accent group-hover:rotate-45 transition-transform duration-700"
                    />
                    <h4 className="text-2xl md:text-4xl font-medium italic leading-[1.4] text-foreground max-w-2xl">
                      &ldquo;The digital storefront is no longer a tool — it is
                      a flagship experience.&rdquo;
                    </h4>
                    <div className="flex items-center gap-5">
                      <span className="w-8 h-px bg-foreground/10" />
                      <p className="text-foreground/40 uppercase tracking-[0.2em] text-[11px] font-bold">
                        Wincore Strategic Thesis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="_container reveal">
          <div className="w-full h-px bg-foreground/[0.08] my-16 md:my-24" />
        </div>

        {/* ── 02: THE APPROACH ── */}
        <section className="py-24 md:py-32 lg:py-40 bg-background">
          <div className="_container">
            {/* Section header */}
            <div className="mb-20 md:mb-32 reveal">
              <div className="flex items-center gap-5 mb-10 md:mb-12">
                <span className="w-10 h-px bg-accent flex-shrink-0" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                  02 — Strategic Solution
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-end">
                <div className="lg:col-span-6">
                  <h2 className="text-[clamp(3rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-foreground">
                    Kinetic<br />Narrative.
                  </h2>
                </div>
                <div className="lg:col-span-6">
                  <p className="text-lg md:text-xl lg:text-2xl text-foreground/60 font-light leading-[1.6]">
                    {project.approach}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="feature-cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: <Shield size={28} />,
                  title: "Precision",
                  desc: "Ultra-high performance GLSL shaders for material luxuriance.",
                },
                {
                  icon: <Zap size={28} />,
                  title: "Fluidity",
                  desc: "Non-linear navigation that responds dynamically to user intent.",
                },
                {
                  icon: <CheckCircle size={28} />,
                  title: "Clarity",
                  desc: "Eliminating cognitive load through invisible UX patterns.",
                },
                {
                  icon: <Compass size={28} />,
                  title: "Legacy",
                  desc: "Encoding brand history into every scroll-triggered sequence.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="feature-card bg-[#f8f8f9] rounded-[2.5rem] relative flex flex-col gap-8 hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 group border border-foreground/[0.03]"
                  style={{ padding: 'max(3rem, 4vw)' }}
                >
                  <div className="text-accent group-hover:scale-110 group-hover:text-foreground transition-all duration-500 w-fit">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold uppercase tracking-[0.1em] mb-4 text-foreground">
                      {card.title}
                    </h4>
                    <p className="text-base text-foreground/60 font-light leading-[1.6]">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="_container reveal">
          <div className="w-full h-px bg-foreground/[0.08] my-16 md:my-24" />
        </div>

        {/* ── 03: EXECUTION ── */}
        <section className="py-24 md:py-32 lg:py-40 bg-background">
          <div className="_container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              {/* Image */}
              <div className="lg:col-span-6 reveal order-2 lg:order-1">
                <div 
                  className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_80px_-15px_rgba(0,0,0,0.08)] bg-[#f4f4f5]"
                  style={{ marginTop: '20px', marginBottom: '20px' }}
                >
                  <Image
                    src={
                      project.images?.[1] ||
                      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200"
                    }
                    alt="Execution Detail"
                    width={1000}
                    height={1200}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                    style={{ aspectRatio: "4/5" }}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="lg:col-span-6 reveal order-1 lg:order-2 lg:pl-10">
                <div className="flex items-center gap-5 mb-10 md:mb-12">
                  <span className="w-10 h-px bg-accent flex-shrink-0" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                    03 — Execution
                  </p>
                </div>
                <h2 className="text-[clamp(3rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] mb-10 md:mb-14 text-foreground">
                  Engineering<br />The Elite.
                </h2>
                <p className="text-lg md:text-xl text-foreground/60 font-light leading-[1.6] mb-16 md:mb-20">
                  {project.execution}
                </p>

                <div className="pt-12 border-t border-foreground/[0.08]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-8">
                    Stack & Disciplines
                  </p>
                  <div className="flex flex-wrap gap-x-10 gap-y-6">
                    {project.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-accent/40 group-hover:bg-accent transition-colors duration-300" />
                        <span className="text-sm font-bold uppercase tracking-[0.1em] text-foreground/60 group-hover:text-foreground transition-colors duration-300">
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="_container reveal">
          <div className="w-full h-px bg-foreground/[0.08] my-16 md:my-24" />
        </div>

        {/* ── 04: OUTCOME ── */}
        <section className="py-24 md:py-32 lg:py-40 bg-background mb-32">
          <div className="_container">
            <div className="bg-[#f8f8f9] border border-foreground/[0.03] rounded-[3rem] md:rounded-[4rem] p-12 md:p-20 lg:p-28 reveal relative overflow-hidden transition-colors hover:bg-foreground/[0.04] duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
                {/* Left */}
                <div>
                  <div className="flex items-center gap-5 mb-10 md:mb-12">
                    <span className="w-10 h-px bg-accent flex-shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                      04 — Impact Metrics
                    </p>
                  </div>
                  <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] mb-10 md:mb-14 text-foreground">
                    The Result of<br />Strategic Shift.
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl text-foreground/60 font-light leading-[1.6]">
                    {project.outcome}
                  </p>
                </div>

                {/* Right: big number */}
                <div className="flex flex-col items-start lg:items-end gap-8 text-left lg:text-right">
                  <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    Conversion Growth
                  </p>
                  <div className="text-[clamp(5rem,12vw,10rem)] font-black text-accent leading-[0.9] tracking-tighter">
                    {impactNumber}
                  </div>
                  <div className="inline-flex items-center gap-3 px-8 py-4 mt-4 bg-white text-foreground rounded-full text-sm font-bold uppercase tracking-[0.1em] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:bg-foreground hover:text-white transition-all duration-300 transform hover:-translate-y-1 border border-foreground/[0.05]">
                    Proven Efficiency
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageMain>
  );
}
