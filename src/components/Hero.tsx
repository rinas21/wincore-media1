"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { getScroller, prefersReducedMotion, scheduleScrollTriggerRefresh } from "@/lib/motion";

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const FOCUS = [
  { label: "Brand systems", tag: "Strategy" },
  { label: "Motion & 3D", tag: "Craft" },
  { label: "WebGL & product", tag: "Build" },
  { label: "AI workflows", tag: "Scale" },
];

export default function Hero() {
  const introRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canvasOn, setCanvasOn] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    setCanvasOn(true);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // ── Hero entrance ──
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: reduced ? 0 : 0.06,
      });

      if (!reduced) {
        tl.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.7 }, 0)
          .from(
            ".hero-line-inner",
            { yPercent: 100, duration: 0.95, stagger: 0.1 },
            0.08,
          )
          .from(".hero-sub", { opacity: 0, y: 28, duration: 0.75 }, 0.35)
          .from(
            ".hero-pills .hero-pill",
            { opacity: 0, y: 18, scale: 0.92, duration: 0.5, stagger: 0.055 },
            0.42,
          )
          .from(".hero-actions", { opacity: 0, y: 22, duration: 0.65 }, 0.5)
          .from(".hero-stats .hero-stat", { opacity: 0, y: 16, duration: 0.55, stagger: 0.08 }, 0.55)
          .from(".hero-side-card", { opacity: 0, y: 40, rotateX: 4, duration: 0.85, ease: "expo.out" }, 0.15)
          .from(".hero-side-row", { opacity: 0, x: -20, duration: 0.45, stagger: 0.08, ease: "power3.out" }, 0.5);
      } else {
        tl.set(
          [
            ".hero-eyebrow",
            ".hero-line-inner",
            ".hero-sub",
            ".hero-pill",
            ".hero-actions",
            ".hero-stat",
            ".hero-side-card",
            ".hero-side-row",
          ],
          { clearProps: "all" },
        );
      }

      // Scroll scrub: content + parallax orbs
      if (!reduced) {
        gsap.to(".hero-content-layer", {
          opacity: 0.22,
          y: -36,
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current,
            scroller,
            start: "top top",
            end: "bottom top",
            scrub: 1.05,
          },
        });

        gsap.to(".hero-parallax-slow", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current,
            scroller,
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
          },
        });

        gsap.to(".hero-parallax-fast", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current,
            scroller,
            start: "top top",
            end: "bottom top",
            scrub: 0.75,
          },
        });

        gsap.to(".hero-canvas-wrap", {
          opacity: 0.15,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current,
            scroller,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // Scroll hint
      if (!reduced) {
        gsap.fromTo(
          ".hero-scroll-hint .hero-scroll-line",
          { scaleY: 0.35, opacity: 0.4 },
          {
            scaleY: 1,
            opacity: 1,
            duration: 1.25,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );
      }
    }, introRef);

    const ctxReel = gsap.context(() => {
      const reduced = prefersReducedMotion();
      const scroller = getScroller();

      gsap.from(".reel-kicker", {
        opacity: 0,
        y: 16,
        duration: reduced ? 0 : 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: reelRef.current,
          scroller,
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".reel-title", {
        opacity: 0,
        y: 28,
        duration: reduced ? 0 : 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: reelRef.current,
          scroller,
          start: "top 86%",
          once: true,
        },
      });

      gsap.from(".reel-copy", {
        opacity: 0,
        y: 18,
        duration: reduced ? 0 : 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: reelRef.current,
          scroller,
          start: "top 84%",
          once: true,
        },
      });

      gsap.from(".reel-video-shell", {
        opacity: 0,
        y: 40,
        duration: reduced ? 0 : 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: reelRef.current,
          scroller,
          start: "top 78%",
          once: true,
        },
      });
    }, reelRef);

    scheduleScrollTriggerRefresh();

    return () => {
      ctx.revert();
      ctxReel.revert();
    };
  }, []);

  return (
    <>
      <section
        id="hero-section"
        ref={introRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-background px-4 pt-20 pb-12 md:px-8 md:pt-24 md:pb-16"
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="hero-parallax-slow absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(0,191,255,0.16),transparent_58%)]" />
          <div className="hero-parallax-fast absolute bottom-0 left-1/2 h-[min(60vh,520px)] w-[min(100%,900px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(212,175,119,0.09),transparent_68%)] blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#0A0A0A_92%)]" />
        </div>

        <div className="hero-canvas-wrap pointer-events-none absolute inset-0 z-[1] opacity-[0.3] md:opacity-[0.36]">
          {canvasOn ? <HeroScene heroId="hero-section" /> : null}
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_85%_55%_at_50%_35%,transparent_0%,rgba(10,10,10,0.78)_58%,#0A0A0A_100%)]" />

        <div className="hero-content-layer _container relative z-10 mx-auto w-full max-w-[1240px]">
          <div className="grid min-h-[min(78vh,720px)] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col text-left lg:col-span-7">
              <p className="hero-eyebrow mb-5 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                Wincore Agency · <span className="text-accent/90">Colombo &amp; global</span>
              </p>

              <h1 className="hero-headline font-heading text-[2.1rem] font-black uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.35rem] lg:leading-[1.05]">
                <span className="hero-line block overflow-hidden pb-[0.06em]">
                  <span className="hero-line-inner block">Creative digital</span>
                </span>
                <span className="hero-line block overflow-hidden pb-[0.06em]">
                  <span className="hero-line-inner block text-white/35">that actually</span>
                </span>
                <span className="hero-line block overflow-hidden pb-[0.06em]">
                  <span className="hero-line-inner block bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent">
                    performs
                  </span>
                </span>
              </h1>

              <p className="hero-sub mt-6 max-w-xl text-base font-light leading-relaxed text-white/50 md:text-lg">
                Brand systems, motion, WebGL, and AI-accelerated delivery — one team, one standard. Built for
                clarity, speed, and measurable outcomes.
              </p>

              <div className="hero-pills mt-8 flex flex-wrap gap-2">
                {["Branding", "Motion", "WebGL", "AI dev", "Performance"].map((p) => (
                  <span
                    key={p}
                    className="hero-pill rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.28em] text-white/45"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="hero-actions mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="cursor-hover inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.32em] text-[#0A0A0A] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start a project
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/works"
                  className="cursor-hover inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-white/90 transition-colors hover:border-accent/50 hover:text-accent"
                >
                  View work
                </Link>
                <Link
                  href="/services"
                  className="cursor-hover hidden text-[10px] font-black uppercase tracking-[0.35em] text-white/35 underline-offset-4 hover:text-white/70 sm:inline"
                >
                  Services →
                </Link>
              </div>

              <dl className="hero-stats mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/[0.07] pt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/25">
                <div className="hero-stat">
                  <dt className="text-white/15">Awards</dt>
                  <dd className="mt-1 text-white/70">12+</dd>
                </div>
                <div className="hero-stat">
                  <dt className="text-white/15">Retention</dt>
                  <dd className="mt-1 text-accent/90">95%</dd>
                </div>
                <div className="hero-stat">
                  <dt className="text-white/15">Campaigns</dt>
                  <dd className="mt-1 text-white/70">200+</dd>
                </div>
              </dl>
            </div>

            <aside className="hero-side-card lg:col-span-5" style={{ perspective: "1200px" }}>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-transparent p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md md:p-8">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/15 blur-3xl" />
                <p className="mb-6 text-[9px] font-black uppercase tracking-[0.45em] text-accent">Focus areas</p>
                <ul className="space-y-0">
                  {FOCUS.map((item) => (
                    <li
                      key={item.label}
                      className="hero-side-row flex items-center justify-between gap-4 border-b border-white/[0.06] py-4 first:pt-0 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-semibold text-white/90">{item.label}</span>
                      <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.25em] text-white/35">
                        {item.tag}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/about"
                  className="mt-6 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.35em] text-accent transition-opacity hover:opacity-80"
                >
                  Why Wincore
                  <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        </div>

        <div className="hero-scroll-hint pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <div className="flex flex-col items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
            <span>Scroll</span>
            <div className="hero-scroll-line h-10 w-px origin-top bg-gradient-to-b from-accent/60 to-transparent" />
          </div>
        </div>
      </section>

      <section
        ref={reelRef}
        className="hero-reel-block relative border-t border-white/5 bg-background px-4 py-14 md:px-[5vw] md:py-20"
      >
        <div className="_container mx-auto mb-8 flex flex-col gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="reel-kicker text-[10px] font-black uppercase tracking-[0.45em] text-accent">Showreel</p>
            <h2 className="reel-title mt-2 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
              Motion <span className="text-white/25 italic">&amp;</span> craft
            </h2>
          </div>
          <p className="reel-copy max-w-md text-sm text-white/40 md:text-base">
            A short reel — hover for colour, tap to expand on desktop.
          </p>
        </div>

        <div className="reel-video-shell group relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/[0.08] bg-black/50 md:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-4 grid-rows-2 opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/[0.06]" />
            ))}
          </div>

          <div className="relative aspect-video w-full md:aspect-[21/9] md:min-h-[320px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={`h-full w-full object-cover transition-all duration-[2s] group-hover:grayscale-0 ${
                expanded ? "scale-100" : "scale-[1.02] grayscale"
              }`}
            >
              <source src="https://thefirstthelast.agency/assets/video/reel_small.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="absolute bottom-5 right-5 z-20 flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-full border border-white/25 bg-black/50 px-5 py-3 text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all hover:border-accent hover:bg-accent/20 md:bottom-8 md:right-8"
              aria-label={expanded ? "Minimize video" : "Expand video"}
            >
              {expanded ? "Minimize" : "Expand"}
              {expanded ? <ArrowDown size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
