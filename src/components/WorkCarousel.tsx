"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ProjectModal, { type Project } from "@/components/ProjectModal";
import { ArrowRight } from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
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
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [useHorizontal, setUseHorizontal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMq = window.matchMedia("(pointer: coarse)");

    const updateMode = () => {
      const shouldHorizontal = !reduceMq.matches && !coarseMq.matches && window.innerWidth >= 1024;
      setUseHorizontal(shouldHorizontal);
    };

    updateMode();
    window.addEventListener("resize", updateMode);
    return () => {
      window.removeEventListener("resize", updateMode);
    };
  }, []);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    const track = trackRef.current;
    const pin = pinRef.current;
    const section = sectionRef.current;
    if (!track || !pin || !section) return;

    const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const cleanupTilt: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (useHorizontal && !reduced) {
        gsap.to(track, {
          x: () => -scrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            scroller,
            start: "top top",
            end: () => "+=" + String(scrollDistance()),
            pin: true,
            scrub: 1, // 1:1 feel
            anticipatePin: 1.2,
            invalidateOnRefresh: true,
            onUpdate(self) {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              
              // Depth Scaling Effect
              const cards = gsap.utils.toArray<HTMLElement>(".wc-tilt");
              const center = window.innerWidth / 2;
              
              cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const distanceFromCenter = Math.abs(center - cardCenter);
                const maxDistance = window.innerWidth;
                
                const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
                const scale = 1 - normalizedDistance * 0.12;
                const opacity = 1; // Always show full opacity per user request

                gsap.set(card, {
                  scale,
                  opacity,
                  transformPerspective: 1200,
                  rotateY: (cardCenter - center) * 0.02,
                });
              });
            },
          },
        });
      } else {
        gsap.set(track, { x: 0, clearProps: "transform" });
      }

      const cards = gsap.utils.toArray<HTMLElement>(".wc-tilt");
      cards.forEach((card) => {
        const media = card.querySelector(".wc-media") as HTMLElement | null;
        const shine = card.querySelector(".wc-shine") as HTMLElement | null;
        if (!media) return;

        gsap.set(card, { transformPerspective: 1000 });
        const toRX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        const toRY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          if (reduced) return;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / Math.max(r.width, 1);
          const py = (e.clientY - r.top) / Math.max(r.height, 1);
          toRX((py - 0.5) * -4);
          toRY((px - 0.5) * 5);
          if (shine) {
            shine.style.opacity = "1";
            shine.style.background = `radial-gradient(400px circle at ${px * 100}% ${py * 100}%, rgba(0,191,255,0.15), transparent 60%)`;
          }
        };

        const onLeave = () => {
          toRX(0);
          toRY(0);
          if (shine) shine.style.opacity = "0";
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanupTilt.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });
    }, section);

    return () => {
      cleanupTilt.forEach((fn) => fn());
      ctx.revert();
    };
  }, [useHorizontal]);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
      aria-label="Featured works"
    >
      <div className="pointer-events-none absolute left-[-6vw] top-[32%] select-none text-[min(36vw,380px)] font-black uppercase italic leading-none text-black/[0.02]">
        Archive
      </div>

      <div className="wc-heading-block _container relative z-10 py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.5em] text-accent">Selected Archives</span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tighter text-foreground">
              Works that <br />
              <span className="text-black/30 italic">rewrite the rules</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className={`h-px w-32 bg-gradient-to-r from-accent/50 to-transparent ${useHorizontal ? "opacity-100" : "opacity-0"}`} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
               {useHorizontal ? "Scroll Side" : "Scroll Down"}
             </span>
          </div>
        </div>
      </div>

      <div
        ref={pinRef}
        className={`relative z-[1] w-full ${useHorizontal ? "h-[85vh] overflow-hidden" : "h-auto overflow-visible"}`}
      >
        <div ref={trackRef} className={useHorizontal ? "flex h-full w-max will-change-transform" : "grid grid-cols-1 gap-12 px-5 pb-24 sm:px-6 md:px-8"}>
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className={useHorizontal
                ? "box-border flex h-full w-[100vw] flex-shrink-0 items-center justify-center px-5 sm:px-8 md:px-16 lg:px-24"
                : "relative w-full aspect-video"}
            >
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="wc-tilt group relative h-[70vh] w-full max-w-7xl overflow-hidden rounded-[2.5rem] border border-black/5 bg-white text-left shadow-xl transition-transform duration-500"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03] saturate-[1.05]"
                  sizes="100vw"
                  quality={90}
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                />
                <div className="wc-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/5 to-transparent" />
                
                <div className="absolute bottom-14 left-8 right-8 z-10 sm:bottom-16 sm:left-12 sm:right-12 md:left-14 md:right-14">
                  <span className="text-accent uppercase tracking-[0.5em] font-black text-[10px] mb-4 block">
                    {project.category}
                  </span>
                  <h3 className="text-3xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter text-foreground transition-transform group-hover:translate-x-2">
                    {project.title}
                  </h3>
                  <div className="mt-8 flex items-center gap-3">
                    <span className="h-px w-12 bg-black/20" />
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/40 transition-colors group-hover:text-accent">View Project</p>
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
