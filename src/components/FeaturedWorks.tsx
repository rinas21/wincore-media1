"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { registerGsapPlugins, getScroller, scheduleScrollTriggerRefresh, prefersReducedMotion } from "@/lib/motion";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  year: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Brand Campaign for a local bank",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    year: "2024",
  },
  {
    id: 2,
    title: "AI-Powered Social Media",
    category: "AI / Development",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
    year: "2024",
  },
  {
    id: 3,
    title: "Mountain Motion Series",
    category: "Motion Video",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
    year: "2023",
  },
  {
    id: 4,
    title: "Next-Gen WebGL Startup",
    category: "UX/UI + WebGL",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80",
    year: "2023",
  },
  {
    id: 5,
    title: "Colombo Tourism Board",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80",
    year: "2024",
  },
];

export default function FeaturedWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const reduced = prefersReducedMotion();
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      const scroller = getScroller();

      const container = containerRef.current;
      const trigger = triggerRef.current;
      if (!container || !trigger) return;

      const getTravel = () => Math.max(0, container.scrollWidth - window.innerWidth);

      if (!reduced) {
        gsap.to(container, {
          x: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top top",
            end: () => `+=${getTravel()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            scroller,
          },
        });
      } else {
        gsap.set(container, { x: 0, clearProps: "transform" });
      }

      // Intro title animation
      gsap.from(".works-heading, .works-kicker", {
        y: reduced ? 0 : 40,
        opacity: reduced ? 1 : 0,
        duration: reduced ? 0 : 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start: "top 75%",
          scroller,
          once: true,
        },
      });

      // Hover tilt / magnetic
      cards.forEach((card) => {
        const image = card.querySelector(".project-image") as HTMLElement;
        const overlay = card.querySelector(".project-overlay") as HTMLElement;

        const onMove = (e: PointerEvent) => {
          if (reduced) return;
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / Math.max(rect.width, 1);
          const y = (e.clientY - rect.top) / Math.max(rect.height, 1);

          gsap.to(image, {
            x: (x - 0.5) * 36,
            y: (y - 0.5) * 24,
            rotationX: (y - 0.5) * -8,
            rotationY: (x - 0.5) * 8,
            scale: 1.06,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(overlay, {
            opacity: 1,
            duration: 0.25,
          });
        };

        const onLeave = () => {
          gsap.to(image, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
          });

          gsap.to(overlay, {
            opacity: 0,
            duration: 0.25,
          });
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });
    }, triggerRef);

    scheduleScrollTriggerRefresh();

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="works"
      ref={triggerRef}
      className="relative h-screen overflow-hidden bg-background"
    >
      {/* Title Header */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 flex w-full items-end justify-between px-6 py-20 md:px-12">
        <div>
          <p className="works-kicker mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent">
            Works
          </p>
          <p className="works-heading max-w-xl text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Featured campaigns and experiences.
          </p>
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-black/40">
            Horizontal reel · 0{projects.length}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex h-full items-center gap-10 pl-[15vw] pr-[30vw] pt-24"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card group relative flex h-[55vh] w-[75vw] flex-shrink-0 cursor-pointer overflow-hidden rounded-[32px] border border-black/[0.06] bg-white/90 md:w-[520px] shadow-[0_30px_60px_rgba(0,0,0,0.05)]"
          >
            <div className="project-image absolute inset-0 h-full w-full transition-transform duration-700">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={100}
              />
            </div>

            <div className="project-overlay pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 sm:p-10 opacity-0">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">
                  {project.year}
                </span>
                <div className="rounded-full border border-white/30 bg-white/10 p-2 backdrop-blur-md">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.35em] text-accent">
                  {project.category}
                </span>
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Bottom info for when not hovered */}
            {/* Initial info layer — more subtle gradient for better clarity */}
            <div className="absolute -bottom-1 left-0 z-20 w-full p-9 sm:p-10 text-foreground transition-all duration-300 group-hover:opacity-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                {project.category}
              </p>
              <h3 className="text-lg font-semibold">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
