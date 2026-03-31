"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
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
      gsap.set(".pm-image-wrap", { opacity: 0, scale: 1.05 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });

      tl.to(".pm-overlay", { opacity: 1, duration: 0.6 })
        .to(".pm-card", { y: 0, opacity: 1, scale: 1 }, "-=0.4")
        .to(".pm-image-wrap", { opacity: 1, scale: 1 }, "-=0.8")
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
      className={`fixed inset-0 z-[7000] flex items-center justify-center p-4 sm:p-10 lg:p-20 transition-visibility duration-500 ${isOpen ? "visible" : "invisible"
        }`}
    >
      <style jsx global>{`
        @keyframes pm-glitch-1 {
          0%, 100% { opacity: 1; transform: translate3d(10px, 0, 0) scale3d(-1, -1, 1); clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); }
          30% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); }
          60% { clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%); }
        }
        @keyframes pm-glitch-2 {
          0%, 100% { opacity: 1; transform: translate3d(-10px, 0, 0); clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); }
          33% { clip-path: polygon(0 52%, 100% 52%, 100% 59%, 0 59%); }
        }
        @keyframes pm-glitch-3 {
          0%, 100% { opacity: 1; transform: translate3d(0, -5px, 0) scale3d(-1, -1, 1); clip-path: polygon(0 1%, 100% 1%, 100% 3%, 0 3%); }
          48% { clip-path: polygon(0 40%, 100% 40%, 100% 39%, 0 39%); }
        }
        @keyframes pm-glitch-4 {
          0%, 5% { opacity: 0.2; transform: translate3d(10px, 5px, 0); }
          5.5%, 100% { opacity: 0; transform: translate3d(0, 0, 0); }
        }
        .pm-glitch-img:nth-child(2) { animation: pm-glitch-1 2s infinite linear; }
        .pm-glitch-img:nth-child(3) { animation: pm-glitch-2 3s infinite linear; }
        .pm-glitch-img:nth-child(4) { animation: pm-glitch-3 3s infinite linear; }
        .pm-glitch-img:nth-child(5) { animation: pm-glitch-4 2s infinite linear; background-blend-mode: overlay; background-color: var(--accent); }
        .pm-content-col { margin-left: 3px !important; }
        /* Avoid clipping content: allow the modal to grow with viewport height */
        .pm-card {
          max-height: min(710px, calc(100dvh - 40px)) !important;
          height: calc(100% - 10px) !important;
        }
      `}</style>

      {/* ── MINIMAL OVERLAY ───────────────────────── */}
      <div className="pm-overlay absolute inset-0 bg-white/40 backdrop-blur-2xl" onClick={onClose} />

      {/* ── THE COMPACT MONOLITH (Architectural Gutter) ── */}
      <div className="pm-card relative w-full max-w-6xl h-full lg:max-h-[710px] bg-white border border-black/5 shadow-[0_60px_150px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row overflow-x-hidden rounded-[2.5rem]">

        {/* CLOSE CONTROL */}
        <button
          onClick={onClose}
          className="absolute top-10 right-10 z-50 group flex items-center justify-center h-12 w-12 rounded-full hover:bg-black/5 transition-colors"
        >
          <X size={20} className="text-black group-hover:rotate-90 transition-transform duration-500 opacity-20 group-hover:opacity-100" />
        </button>

        {/* LEFT: IMAGE MONOLITH (50%) */}
        <div className="pm-image-wrap relative w-full lg:w-1/2 h-[calc(40vh-10px)] lg:h-auto overflow-hidden bg-white shrink-0">
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={id} className="pm-glitch-img absolute inset-0">
              <Image src={project.image} alt="" fill className="object-cover" priority={id === 1} />
            </div>
          ))}
          <div className="absolute inset-x-12 bottom-12 space-y-2 z-20 pointer-events-none">
            <span className="pm-stagger block text-[9px] font-black uppercase tracking-[0.6em] text-accent">Wincore Project System</span>
            <p className="pm-stagger text-[11px] font-black uppercase tracking-[0.3em] text-black">v. ARCHIVE 2026</p>
          </div>
        </div>

        {/* RIGHT: DATA ARCHITECTURE (text-focused column) */}
        <div className="pm-content-col flex-1 flex flex-col bg-white overflow-x-hidden min-h-0">

          {/* Scrollable text shell with generous padding & width */}
          <div className="flex-1 min-h-0 overflow-y-auto px-10 py-18 lg:px-24 lg:py-20 scrollbar-hide">
            <div className="mx-auto max-w-4xl space-y-16 pb-10">

              {/* HEADER SECTION */}
              <div className="pm-stagger space-y-5 mt-2 md:mt-4">
                <p className="text-[13px] font-black uppercase tracking-[0.5em] text-accent">
                  Mission Objective
                </p>
                <div className="space-y-2">
                  <h2 className="text-[2.9rem] lg:text-[3.4rem] font-black uppercase tracking-[-0.05em] leading-[1.04] text-black">
                    {project.title}
                  </h2>
                  <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-1.5 text-[0.85rem] font-black uppercase tracking-[0.34em] text-black/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {project.category}
                  </p>
                </div>
              </div>

              {/* HIGHLIGHTED METRICS PANEL */}
              <div className="pm-stagger rounded-[2rem] border border-black/[0.06] bg-black/[0.015] px-7 py-7 md:px-9 md:py-8 space-y-6 shadow-[0_24px_60px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(0,0,0,0.08)] hover:border-black/[0.12]">
                <p className="text-[12px] font-black uppercase tracking-[0.42em] text-black/45">
                  Project Schema
                </p>
                <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
                  {[
                    { label: "Engineering", val: project.stack },
                    { label: "Deployment", val: project.role },
                    { label: "Timeline", val: project.duration },
                    { label: "Operational Outcome", val: project.impact },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <p className="text-[12px] font-black uppercase tracking-[0.36em] text-black/40">
                        {s.label}
                      </p>
                      <p className="text-[1.15rem] lg:text-[1.22rem] font-semibold tracking-tight text-black">
                        {s.val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* MISSION DESCRIPTION — reworded for clarity */}
              <div className="pm-stagger space-y-6">
                <p className="text-[1.12rem] lg:text-[1.2rem] leading-[1.9] text-black/85">
                  A flagship commerce experience for Onyx’s luxury line, built as a full-screen digital showroom
                  instead of a basic product grid. Customers move through a 3D narrative of the product, with every
                  interaction tuned for speed, clarity, and conversion.
                </p>
                <p className="text-[1.12rem] lg:text-[1.2rem] leading-[1.9] text-black/80">
                  WebGL is used where it actually adds value—rich 3D detail, smooth motion, and spatial storytelling—
                  while the core purchase flow stays as direct as a high-performing landing page. The result is a
                  premium brand moment that still behaves like a ruthless ecommerce engine.
                </p>
              </div>

              {/* TAGS / DISCIPLINES */}
              <div className="pm-stagger flex flex-wrap gap-3 pt-4">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[12px] font-black uppercase tracking-[0.38em] bg-black/[0.03] px-5 py-2.5 rounded-full text-black/65 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>

            </div>
          </div>

          {/* ACTION BAR (aligned to text width) */}
          <div className="pm-stagger shrink-0 px-10 lg:px-20 pb-12 lg:pb-16 pt-0 flex flex-col sm:flex-row gap-6">
            <Link
              href="/contact"
              className="group relative flex-[1.6] bg-black text-white h-20 rounded-2xl flex items-center justify-between px-10 overflow-hidden shadow-2xl transition-transform active:scale-95"
              onClick={onClose}
            >
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo" />
              <span className="relative z-10 text-[13px] sm:text-[14px] font-black uppercase tracking-[0.5em]">
                Initiate Briefing
              </span>
              <div className="relative z-10 w-6 h-[1.5px] bg-white group-hover:w-10 transition-all duration-700" />
            </Link>
            <a
              href={project.link}
              target="_blank"
              rel="noopener"
              className="group flex-1 border border-black/10 h-20 rounded-2xl flex items-center justify-center gap-4 hover:border-black transition-all"
            >
              <span className="text-[13px] sm:text-[14px] font-black uppercase tracking-[0.5em]">
                Live Site
              </span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
