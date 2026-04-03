"use client";

import { useParams } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import PageMain from "@/components/PageMain";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, CheckCircle } from "lucide-react";
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
      gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <PageMain>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight">Project Not Found</h1>
            <Link href="/works" className="mt-8 inline-block text-accent underline underline-offset-4">
              Back to Archive
            </Link>
          </div>
        </div>
      </PageMain>
    );
  }

  return (
    <PageMain>
      <div ref={containerRef}>

        {/* ── HERO ── */}
        <section className="relative pt-36 pb-0 px-8 md:px-16 lg:px-24 overflow-hidden bg-[#f8f8f6]">
          <div className="max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <div className="mb-14 fade-up">
              <Link
                href="/works"
                className="group inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/40 hover:text-accent transition-colors"
              >
                <ArrowLeft size={13} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1" />
                Works
              </Link>
            </div>

            {/* Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end pb-16 border-b border-black/8 fade-up">
              {/* Left: Title */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent mb-5">{project.category}</p>
                <h1 className="text-[clamp(2.4rem,5vw,5rem)] font-black uppercase leading-[1.05] tracking-tight text-black">
                  {project.title}
                </h1>
                <p className="mt-6 text-lg text-black/50 font-light leading-relaxed max-w-md">
                  {project.description}
                </p>
              </div>

              {/* Right: Stats */}
              <div className="grid grid-cols-2 gap-px bg-black/8 border border-black/8 rounded-2xl overflow-hidden">
                <div className="bg-[#f8f8f6] p-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/30 mb-3">Impact</p>
                  <p className="text-2xl font-black text-black tracking-tight">{project.impact}</p>
                </div>
                <div className="bg-[#f8f8f6] p-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/30 mb-3">Timeline</p>
                  <p className="text-2xl font-black text-black tracking-tight">{project.duration}</p>
                </div>
                <div className="bg-[#f8f8f6] p-8 col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/30 mb-3">Tech Stack</p>
                  <p className="text-base font-semibold text-black/70">{project.stack}</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mt-0 relative w-full aspect-[16/7] overflow-hidden rounded-b-3xl shadow-[0_32px_80px_rgba(0,0,0,0.12)] group fade-up">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-center scale-[1.04] group-hover:scale-100 transition-transform duration-[2s] ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* ── THE BRIEF ── */}
        <section className="py-28 md:py-40 px-8 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 fade-up">
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent mb-4">01 — The Challenge</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black">
                The <br />Problem.
              </h2>
            </div>
            <div className="lg:col-span-8 fade-up">
              <blockquote className="text-2xl md:text-3xl font-light text-black/75 leading-[1.45] mb-10 border-l-[3px] border-accent pl-8">
                &ldquo;{project.problem}&rdquo;
              </blockquote>
              <div className="space-y-5 text-base md:text-lg text-black/50 leading-relaxed font-light pl-8">
                <p>
                  Most digital architectures are built for utility, neglecting the emotional
                  narrative. For {project.title}, the challenge was bridging the gap between
                  ruthless conversion and premium brand identity without compromising the
                  user&apos;s cognitive clarity.
                </p>
                <p>
                  We identified that the primary friction point was a lack of visceral
                  engagement—the site felt like an interface rather than an experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── APPROACH ── */}
        <section className="py-28 md:py-40 px-8 md:px-16 lg:px-24 bg-black text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 fade-up">
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent mb-4">02 — Our Approach</p>
                <h2 className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight text-white mb-8">
                  How We<br />Solved It.
                </h2>
                <p className="text-lg text-white/50 font-light leading-relaxed">
                  {project.approach}
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 fade-up">
                {[
                  { title: "Spatial Flow", body: "Moving beyond static grids into a non-linear browsing experience that feels alive." },
                  { title: "Visceral Proof", body: "High-fidelity material shaders and kinetic feedback that signal elite craft." },
                  { title: "Brand Narrative", body: "Every click is a story beat. We engineer emotional arcs, not just user flows." },
                  { title: "Zero Compromise", body: "Performance and beauty are not a trade-off here — they are the same goal." },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="bg-white/[0.05] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.09] transition-colors duration-500"
                  >
                    <h4 className="text-base font-black uppercase tracking-tight text-white mb-3">{card.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed font-light">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EXECUTION ── */}
        <section className="py-28 md:py-40 px-8 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 fade-up">
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent mb-4">03 — Execution</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black">
                Built to<br />Perform.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center fade-up">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/5 shadow-[0_24px_60px_rgba(0,0,0,0.1)] group">
                <Image
                  src={project.images?.[1] || project.image}
                  alt="Execution Detail"
                  fill
                  className="object-cover scale-[1.06] group-hover:scale-100 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-snug mb-5">
                    Forging the digital flagship.
                  </h3>
                  <p className="text-base md:text-lg text-black/55 font-light leading-relaxed">
                    {project.execution}
                  </p>
                </div>

                <div className="border-t border-black/8 pt-8 space-y-4">
                  {project.tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-4">
                      <CheckCircle size={16} className="text-accent shrink-0" strokeWidth={2} />
                      <span className="text-sm font-semibold uppercase tracking-[0.25em] text-black/60">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── OUTCOME ── */}
        <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#f8f8f6]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-black/8 border border-black/8 rounded-3xl overflow-hidden fade-up">
              {/* Text Side */}
              <div className="lg:col-span-7 bg-[#f8f8f6] p-12 md:p-16 space-y-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent mb-4">04 — The Results</p>
                  <h2 className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black">
                    Real impact,<br />proven.
                  </h2>
                </div>
                <p className="text-base md:text-lg text-black/55 font-light leading-relaxed max-w-lg">
                  {project.outcome}
                </p>
              </div>

              {/* Metric Side */}
              <div className="lg:col-span-5 bg-white p-12 md:p-16 flex flex-col items-center justify-center border-l border-black/8">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-black/30 mb-6">Performance Benchmark</p>
                  <p className="text-[clamp(4rem,10vw,8rem)] font-black text-accent leading-none tracking-tight">
                    {project.impact.split(" ")[0]}
                  </p>
                  <p className="text-sm font-bold uppercase tracking-[0.6em] text-black/30 mt-3">
                    {project.impact.split(" ").slice(1).join(" ") || "Efficiency"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-40 px-8 md:px-16 lg:px-24 bg-black text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,120,255,0.08),transparent_70%)]" />
          <div className="max-w-3xl mx-auto relative z-10 fade-up">
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 mb-8">
              Architect your digital future.
            </p>
            <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[1] tracking-tight mb-12 text-white">
              Start your<br />project.
            </h2>
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-4 bg-accent text-white px-10 py-5 rounded-full text-[12px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(0,120,255,0.4)] hover:-translate-y-0.5 active:scale-95"
            >
              <span className="relative z-10">Initiate Briefing</span>
              <ArrowUpRight size={18} strokeWidth={2.5} className="relative z-10 group-hover:rotate-45 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </div>
        </section>

      </div>
    </PageMain>
  );
}
