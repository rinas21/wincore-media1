"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ProjectModal, { type Project } from "@/components/ProjectModal";
import { ArrowRight } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Brand Campaign for a local bank",
    category: "Branding / Strategy",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600",
    tags: ["Strategy", "Visual Identity", "UX"],
  },
  {
    id: 2,
    title: "AI-Powered Social Media Platform",
    category: "AI / Development",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600",
    tags: ["AI", "Product", "Engineering"],
  },
  {
    id: 3,
    title: "Motion Video Series for Tourism Board",
    category: "Motion / Video",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1600",
    tags: ["Production", "Cinematography", "Editing"],
  },
  {
    id: 4,
    title: "Full Website + WebGL for a tech startup",
    category: "UX/UI / WebGL",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600",
    tags: ["Creative Code", "Interaction", "WebGL"],
  },
];

export default function WorkCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scroller = document.documentElement;

    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: () => -scrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: pin,
        scroller,
        start: "top top",
        end: () => "+=" + String(scrollDistance()),
        pin: true,
        scrub: 1.3,
        anticipatePin: 0.7,
        invalidateOnRefresh: true,
        onUpdate(self) {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(track);

    gsap.from(".wc-heading-block", {
      y: 32,
      opacity: 0,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        scroller,
        start: "top 88%",
        once: true,
      },
    });

    const cards = gsap.utils.toArray<HTMLElement>(".wc-tilt");
    cards.forEach((card) => {
      const media = card.querySelector(".wc-media") as HTMLElement | null;
      const shine = card.querySelector(".wc-shine") as HTMLElement | null;
      if (!media) return;

      gsap.set(card, { transformPerspective: 1000 });
      const reduced = prefersReducedMotion();
      const toRX = gsap.quickTo(card, "rotationX", { duration: reduced ? 0 : 0.5, ease: "power3.out" });
      const toRY = gsap.quickTo(card, "rotationY", { duration: reduced ? 0 : 0.5, ease: "power3.out" });
      const toMX = gsap.quickTo(media, "x", { duration: reduced ? 0 : 0.65, ease: "power3.out" });
      const toMY = gsap.quickTo(media, "y", { duration: reduced ? 0 : 0.65, ease: "power3.out" });
      const toMS = gsap.quickTo(media, "scale", { duration: reduced ? 0 : 0.8, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        if (reduced) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        toRX((py - 0.5) * -4);
        toRY((px - 0.5) * 5);
        toMX((px - 0.5) * 8);
        toMY((py - 0.5) * 7);
        toMS(1.02);
        if (shine) {
          shine.style.opacity = "1";
          shine.style.background = `radial-gradient(320px circle at ${px * 100}% ${py * 100}%, rgba(0,191,255,0.11), transparent 55%)`;
        }
      };
      const onLeave = () => {
        toRX(0);
        toRY(0);
        toMX(0);
        toMY(0);
        toMS(1);
        if (shine) shine.style.opacity = "0";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ro.disconnect();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative border-t border-white/5 bg-background"
      aria-label="Featured works"
    >
      <div className="pointer-events-none absolute left-[-6vw] top-[22%] select-none text-[min(36vw,380px)] font-black uppercase italic leading-none text-white/[0.035]">
        Works
      </div>

      <div className="wc-heading-block _container relative z-10 border-b border-white/[0.06] pb-10 pt-14 md:pb-12 md:pt-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.5em] text-accent">Selected work</p>
            <h2 className="font-heading text-3xl font-black uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
              Projects that <span className="text-white/30">earn attention</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-white/35">
            <span className="hidden text-[10px] font-black uppercase tracking-[0.35em] sm:inline">
              Scroll sideways
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <ArrowRight className="h-4 w-4 text-accent" aria-hidden />
            </div>
          </div>
        </div>
        <div className="mt-8 h-px w-full overflow-hidden bg-white/[0.06]">
          <div
            ref={progressRef}
            className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent/80 to-accent/30"
            aria-hidden
          />
        </div>
      </div>

      <div ref={pinRef} className="relative z-[1] h-[min(82vh,860px)] w-full overflow-hidden">
        <div ref={trackRef} className="flex h-full w-max will-change-transform">
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className="box-border flex h-full w-[100vw] max-w-[100vw] flex-shrink-0 items-stretch px-4 pb-10 pt-4 sm:px-6 md:px-10 md:pb-14"
            >
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="wc-tilt group relative mx-auto h-full w-full max-w-6xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0d0d0d] text-left shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] md:rounded-3xl"
              >
                <div className="wc-media absolute inset-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 1152px"
                    priority={i === 0}
                  />
                </div>
                <div className="wc-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/20" />
                <div className="absolute left-5 top-5 flex items-center gap-3 md:left-8 md:top-8">
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-black tabular-nums text-white/80 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")} — {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-accent/95">
                    {project.category}
                  </p>
                  <h3 className="max-w-[22ch] text-2xl font-black uppercase leading-[1.08] tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                    {project.title}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.08] bg-white/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/65"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.35em] text-white/40 transition-colors group-hover:text-accent">
                    Open case
                    <ArrowRight className="h-3.5 w-3.5" />
                  </p>
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
