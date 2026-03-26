"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import ProjectModal, { type Project } from "@/components/ProjectModal";
import {
  registerGsapPlugins,
  getScroller,
  prefersReducedMotion,
} from "@/lib/motion";

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Luminex Ecosystem",
    category: "Vibrant UI / 3D",
    image: "/works/vibrant_webgl.png",
    tags: ["WebGL", "3D UI", "Performance"],
    description: "A neon-fused, high-performance interface for a decentralized tech network. Immersive visuals and colorful data-flow.",
    stack: "React, Three.js, GSAP",
    duration: "10 Weeks",
    role: "Lead Agency",
    impact: "+240% Speed",
    link: "https://luminex.tech",
  },
  {
    id: 2,
    title: "Aurum FinTech",
    category: "Branding / Web Product",
    image: "/works/vibrant_fintech.png",
    tags: ["Fintech", "Glassmorphism", "Branding"],
    description: "Reimagining modern finance with an emerald-gold aesthetic. High saturation, premium glass surfaces, and sophisticated data visualisations.",
    stack: "Next.js, D3.js, GSAP",
    duration: "8 Weeks",
    role: "Core Studio",
    impact: "99% Uptime",
    link: "https://aurum.finance",
  },
  {
    id: 3,
    title: "Nova AI Studio",
    category: "Product / Motion",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    tags: ["AI", "Creative", "Motion"],
    description: "Vibrant magenta and violet gradients powering the next generation of creative AI platforms. A study in color and flow.",
    stack: "React, Framer, AI",
    duration: "12 Weeks",
    role: "Creative Partner",
    impact: "1M+ Users",
    link: "https://nova-ai.io",
  },
  {
    id: 4,
    title: "Pulse Tourism",
    category: "Video / Experience",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
    tags: ["Video", "Cinematic", "Tropics"],
    description: "Hyper-colored cinematic tours for luxury island retreats. Rich tropical palettes and vibrant motion choreography.",
    stack: "After Effects, DaVinci",
    duration: "6 Weeks",
    role: "Production",
    impact: "+300% Booking",
    link: "https://pulse.travel",
  },
];

export default function WorkCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".wc-reveal-item");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: reduced ? 0 : 64, opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 0.9,
            delay: i * 0.04,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              scroller,
              start: "top 86%",
              once: true,
            },
          },
        );

        if (!reduced) {
          gsap.to(card, {
            yPercent: -2,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              scroller,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }
      });

      const media = gsap.utils.toArray<HTMLElement>(".wc-media");
      media.forEach((el) => {
        if (reduced) return;
        gsap.fromTo(
          el,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 92%",
              end: "bottom 20%",
              scrub: 0.8,
            },
          },
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-20 md:py-28"
      aria-label="Featured works"
    >
      <div className="_container relative z-10">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-5 inline-block text-[10px] font-black uppercase leading-[1.35] tracking-[0.42em] text-accent">
              Selected Archives
            </span>
            <h2 className="font-heading text-4xl font-black uppercase leading-[1.02] tracking-tighter text-foreground md:text-5xl lg:text-7xl">
              Works that <br />
              <span className="text-black/30 italic">rewrite the rules</span>
            </h2>
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-black/45 md:text-base md:text-right">
            Scroll down to move through projects. Each card pops in, then hands focus to the next.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:gap-10">
          {PROJECTS.map((project, i) => (
            <div key={project.id} className="wc-reveal-item">
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="wc-card wc-refer-card group relative block w-full text-left"
              >
                <div className="wc-refer-inner relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.08)] transition-colors group-hover:border-accent/40">
                  <div className="wc-media wc-refer-media absolute inset-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 1240px"
                      quality={95}
                      priority={i === 0}
                      loading={i === 0 ? undefined : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 lg:p-10">
                    <span className="mb-3 block text-[10px] font-black uppercase leading-[1.35] tracking-[0.4em] text-accent/95">
                      {project.category}
                    </span>
                    <h3 className="wc-refer-title text-2xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-[11px] font-black uppercase leading-[1.35] tracking-[0.28em] text-white/75">
                      Open Project
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
