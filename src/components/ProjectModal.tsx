"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import { X, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

export type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
  tags: string[];
  description: string;
  stack: string;
  duration: string;
  role: string;
  impact: string;
  link: string;
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

  useLayoutEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      gsap.set(".pm-overlay", { opacity: 0 });
      gsap.set(".pm-card", { y: 40, opacity: 0, scale: 0.98 });
      gsap.set(".pm-stagger", { y: 20, opacity: 0 });
      gsap.set(".pm-image", { scale: 1.1, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });

      tl.to(".pm-overlay", { opacity: 1, duration: 0.6 })
        .to(".pm-card", { y: 0, opacity: 1, scale: 1 }, "-=0.4")
        .to(".pm-image", { scale: 1, opacity: 1 }, "-=0.8")
        .to(".pm-stagger", { y: 0, opacity: 1, stagger: 0.08 }, "-=1");
    }, modalRef);

    return () => ctx.revert();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  if (!project) return null;

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 z-[7000] flex items-center justify-center p-4 sm:p-8 lg:p-16 transition-visibility duration-500 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* ── MINIMAL OVERLAY ───────────────────────── */}
      <div className="pm-overlay absolute inset-0 bg-white/60 backdrop-blur-2xl" onClick={onClose} />

      {/* ── THE SPLIT MONOLITH ────────────────────── */}
      <div className="pm-card relative w-full max-w-7xl h-full lg:max-h-[850px] bg-white border border-black/5 shadow-[0_100px_200px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row overflow-hidden rounded-[2.5rem]">
        
        {/* CLOSE CONTROL */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-50 group flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-xl hover:bg-black hover:text-white transition-all duration-500 border border-black/5"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* LEFT: IMMERSIVE IMAGE (50%) */}
        <div className="relative w-full lg:w-1/2 h-[45vh] lg:h-auto overflow-hidden bg-black group">
           <div className="pm-image absolute inset-0">
              <Image 
                src={project.image} 
                alt={project.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-[5s] ease-out" 
                priority
              />
           </div>
           {/* Visual Gradients for Depth */}
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
           <div className="absolute inset-x-12 bottom-12 space-y-2">
              <span className="pm-stagger block text-[10px] font-black uppercase tracking-[0.4em] text-accent">Visual Concept</span>
              <p className="pm-stagger text-[11px] font-black uppercase tracking-[0.25em] text-white/40">v. ARCHIVE 2026</p>
           </div>
        </div>

        {/* RIGHT: STRUCTURED DATA (50%) */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
           
           <div className="flex-1 overflow-y-auto p-10 md:p-14 lg:p-20 scrollbar-hide space-y-20">
              
              {/* HEADER SECTION */}
              <div className="pm-stagger space-y-6">
                 <div className="flex items-center gap-4">
                    <Sparkles size={16} className="text-accent" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Mission Detail</p>
                 </div>
                 <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-none text-black">
                   {project.title}
                 </h2>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">{project.category}</p>
              </div>

              {/* MISSION ARCHITECTURE */}
              <div className="pm-stagger space-y-8">
                 <div className="w-12 h-[2px] bg-black/10" />
                 <p className="text-2xl font-light leading-relaxed text-black/70 italic max-w-xl">
                    {project.description}
                 </p>
                 <div className="flex flex-wrap gap-2.5">
                    {project.tags.map(t => (
                      <span key={t} className="text-[9px] font-black uppercase tracking-widest bg-black/[0.03] px-5 py-2.5 rounded-full text-black/40">
                        {t}
                      </span>
                    ))}
                 </div>
              </div>

              {/* PRECISION STATS GRID (ORGANIZED) */}
              <div className="pm-stagger grid grid-cols-2 gap-x-12 gap-y-12 pt-12 border-t border-black/5">
                 {[
                   { label: "Engineering Stack", val: project.stack },
                   { label: "Deployment Role", val: project.role },
                   { label: "Mission Duration", val: project.duration },
                   { label: "Operational Impact", val: project.impact }
                 ].map((s, i) => (
                   <div key={i} className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/15">{s.label}</p>
                      <p className="text-base font-bold uppercase tracking-tight text-black">{s.val}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* ACTION BOTTOM BAR */}
           <div className="pm-stagger shrink-0 p-10 lg:px-20 lg:pb-16 lg:pt-0 flex flex-col sm:flex-row gap-6">
              <Link
                href="/contact"
                className="group relative flex-[1.4] bg-black text-white h-20 rounded-2xl flex items-center justify-between px-10 overflow-hidden shadow-2xl transition-transform active:scale-95"
                onClick={onClose}
              >
                 <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo" />
                 <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em]">Propel Forward</span>
                 <ArrowRight size={20} className="relative z-10 group-hover:translate-x-3 transition-transform duration-700" />
              </Link>
              <a
                href={project.link}
                target="_blank"
                rel="noopener"
                className="group flex-1 border border-black/10 h-20 rounded-2xl flex items-center justify-center gap-4 hover:border-black transition-all"
              >
                 <span className="text-[11px] font-black uppercase tracking-[0.4em]">Live site</span>
                 <ExternalLink size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </a>
           </div>

        </div>

      </div>
    </div>
  );
}
