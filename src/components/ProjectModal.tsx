"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";

export type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
  tags: string[];
};

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modalEl = modalRef.current;
    const contentEl = contentRef.current;
    if (!modalEl) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onEsc);
      gsap.to(modalEl, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.fromTo(
        contentEl,
        { y: 100, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "power4.out", delay: 0.1 },
      );
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
      gsap.to(modalEl, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.45,
        ease: "power2.out",
      });
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
      gsap.killTweensOf(modalEl);
      if (contentEl) gsap.killTweensOf(contentEl);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-16 opacity-0 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Project: ${project.title}`}
      onMouseDown={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 z-[2001] w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
        aria-label="Close project modal"
      >
        <X className="group-hover:rotate-90 transition-transform" />
      </button>

      <div ref={contentRef} className="w-full max-w-[1200px] h-full overflow-y-auto scrollbar-hide py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div>
            <p className="text-accent uppercase tracking-[0.35em] font-bold text-[11px] mb-6">
              Project Detail / {project.category}
            </p>
            <h2 className="text-4xl md:text-6xl font-black leading-[0.9] mb-8">
              {project.title}
            </h2>

            <div className="space-y-6 text-white/60 text-lg font-light leading-relaxed">
              <p>
                A cinematic creative solution crafted by Wincore Agency. We combined strategic storytelling with immersive motion and luxury-grade UI to drive measurable outcomes.
              </p>
              <p>
                Built with Next.js, Three.js, and GSAP, the experience balances performance with high-end interaction design.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest font-black px-4 py-2 bg-white/5 rounded-full border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-14 grid grid-cols-2 gap-6 pt-10 border-t border-white/10 text-white/80">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Duration</h4>
                <p className="text-base">4–8 weeks</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Role</h4>
                <p className="text-base">Lead Agency</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Stack</h4>
                <p className="text-base">Next.js, Three.js, GSAP</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Impact</h4>
                <p className="text-base">+ engagement</p>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-12 inline-flex items-center justify-center rounded-full bg-accent px-10 py-4 text-[11px] font-black uppercase tracking-[0.35em] text-white hover:scale-[1.02] transition-transform"
              onClick={onClose}
            >
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

