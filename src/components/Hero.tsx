"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, Play,
  Trophy, Users, Zap,
  Palette, Box, Globe, Sparkles,
} from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";
import { useLenis } from "@/context/LenisContext";
import { usePreloaderDone } from "@/context/PreloaderContext";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const ctaHover =
  "transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** TFTL-style floating hero badges — accent pills (reference: tftl-agency/components/Hero.tsx) */
const HERO_TIPS: { text: string; bg: string; color: string }[] = [
  { text: "Creative digital studio", bg: "rgba(0,136,204,0.08)", color: "#0a0a0a" },
  { text: "WebGL · Motion · AI", bg: "rgba(0,0,0,0.04)", color: "#0a0a0a" },
  { text: "Colombo & global", bg: "rgba(0,136,204,0.06)", color: "#0a0a0a" },
];

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const FOCUS = [
  { label: "Brand systems", tag: "Strategy", desc: "Visual identities that scale and perform.", icon: Palette },
  { label: "Motion & 3D", tag: "Craft", desc: "Cinematic depth for digital interfaces.", icon: Box },
  { label: "WebGL & Tech", tag: "Build", desc: "Immersive high-performance web experiences.", icon: Globe },
  { label: "AI Workflows", tag: "Scale", desc: "Accelerated delivery with precision AI.", icon: Sparkles },
];

const OUTCOMES = ["Branding", "Motion", "WebGL", "AI dev", "Performance"];

const KPI_STATS = [
  { label: "Awards Won", value: 12, suffix: "+", icon: Trophy, color: "text-accent" },
  { label: "Client Retention", value: 95, suffix: "%", icon: Users, color: "text-secondary" },
  { label: "Campaigns", value: 200, suffix: "+", icon: Zap, color: "text-foreground" },
];

// ─── count-up utility (scoped to hero root — no document-wide queries) ───────
function startCountUp(root: ParentNode, immediate = false) {
  root.querySelectorAll<HTMLElement>(".stat-value").forEach((el) => {
    const target = parseInt(el.dataset.target ?? "0", 10);
    if (immediate) {
      el.textContent = target.toString();
      return;
    }
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate() { el.textContent = Math.round(proxy.val).toString(); },
    });
  });
}

export default function Hero() {
  const introRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLElement>(null);
  const hasCountedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const lenis = useLenis();
  const preloaderDone = usePreloaderDone();
  /** Ensures hero runs even if preloader context is slow (fallback matches Preloader safety timeout). */
  const [entranceTimeoutReached, setEntranceTimeoutReached] = useState(false);
  const entranceUnlocked = preloaderDone || entranceTimeoutReached;

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setEntranceTimeoutReached(true), 7000);
    return () => window.clearTimeout(id);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1 — Initial hidden states (no blur — crisp visuals)
  // ─────────────────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-eyebrow-part", { autoAlpha: 0, y: 18 });
      gsap.set(".hero-sub-line", { autoAlpha: 0, y: 24 });
      gsap.set(".hero-performs-inner", { yPercent: 105, opacity: 0 });
      gsap.set(".hero-side-card", { autoAlpha: 0, scale: 0.95, y: 20 });
      gsap.set(".hero-kpi-card", { autoAlpha: 0, scale: 0.95, y: 20 });
      gsap.set(".hero-action-btn", { autoAlpha: 0, y: 16 });
      gsap.set(".hero-canvas-wrap", { autoAlpha: 0, scale: 1.04 });
      gsap.set(".hero-scroll-hint", { autoAlpha: 0 });
    }, introRef);

    return () => ctx.revert();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2 — Entrance (after preloader): split headline → sub → cards; hover glint
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!entranceUnlocked) return;
    if (!introRef.current) return;

    const reduced = prefersReducedMotion();
    const coarsePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    let cleanupMagnetic: (() => void) | undefined;
    let cleanupCardTilt: (() => void) | undefined;
    let cleanupGlintHover: (() => void) | undefined;
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      const root = introRef.current;
      if (!root) return;

      if (reduced) {
        gsap.set(".hero-eyebrow-part", { autoAlpha: 1, y: 0 });
        gsap.set(".hero-sub-line", { autoAlpha: 1, y: 0 });
        gsap.set(".hero-performs-inner", { yPercent: 0, opacity: 1 });
        gsap.set(".hero-side-card", { autoAlpha: 1, scale: 1, y: 0 });
        gsap.set(".hero-kpi-card", { autoAlpha: 1, scale: 1, y: 0 });
        gsap.set(".hero-action-btn", { autoAlpha: 1, y: 0 });
        gsap.set(".hero-canvas-wrap", { autoAlpha: 1, scale: 1 });
        gsap.set(".hero-scroll-hint", { autoAlpha: 1 });

        if (!hasCountedRef.current && introRef.current) {
          hasCountedRef.current = true;
          startCountUp(introRef.current, true);
        }
        return;
      }

      /* Only split plain lines — gradient “performs” is animated separately */
      root.querySelectorAll<HTMLElement>(".hero-line-split").forEach((line) => {
        try {
          splits.push(new SplitType(line, { types: "words" }));
        } catch {
          /* ignore */
        }
      });
      const wordEls = splits.flatMap((s) => s.words ?? []).filter(Boolean) as HTMLElement[];
      const lineEls = Array.from(root.querySelectorAll<HTMLElement>(".hero-line-split"));

      const useLineFallback = wordEls.length === 0 && lineEls.length > 0;
      if (useLineFallback) {
        splits.forEach((s) => s.revert());
        splits.length = 0;
        gsap.set(lineEls, { yPercent: 110 });
      } else if (wordEls.length) {
        gsap.set(wordEls, { y: "0.65em", opacity: 0 });
      }

      const HEADLINE_START = 0.42;
      const WORD_STAGGER = 0.07;
      const WORD_DURATION = 0.62;
      const lastWordT =
        wordEls.length > 0
          ? HEADLINE_START + Math.max(0, wordEls.length - 1) * WORD_STAGGER + WORD_DURATION * 0.28
          : HEADLINE_START;
      const performsInAt = wordEls.length ? lastWordT : HEADLINE_START;
      const performsDone = performsInAt + 0.72;
      const headlineEnd = (wordEls.length ? performsDone : HEADLINE_START + 0.55) + 0.04;

      const tl = gsap.timeline({ delay: 0.08, defaults: { ease: "power3.out" } });

      tl.to(
        ".hero-eyebrow-part, .hero-tag-pill",
        { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.09, ease: "power3.out" },
        0,
      );

      if (useLineFallback) {
        tl.to(
          lineEls,
          {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: "power4.out",
          },
          HEADLINE_START,
        );
        tl.to(
          ".hero-performs-inner",
          { yPercent: 0, opacity: 1, duration: 0.78, ease: "power4.out" },
          HEADLINE_START + 0.95 + 0.12,
        );
      } else if (wordEls.length) {
        tl.to(
          wordEls,
          {
            y: 0,
            opacity: 1,
            duration: WORD_DURATION,
            stagger: WORD_STAGGER,
            ease: "power4.out",
          },
          HEADLINE_START,
        );
        tl.to(
          ".hero-performs-inner",
          { yPercent: 0, opacity: 1, duration: 0.78, ease: "power4.out" },
          performsInAt,
        );
      } else {
        tl.to(
          ".hero-performs-inner",
          { yPercent: 0, opacity: 1, duration: 0.78, ease: "power4.out" },
          HEADLINE_START,
        );
      }

      tl.fromTo(
        ".hero-canvas-wrap",
        { autoAlpha: 0, scale: 1.04 },
        { autoAlpha: 1, scale: 1, duration: 1.05, ease: "power3.out" },
        0.42,
      );

      tl.to(
        ".hero-sub-line",
        { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.14, ease: "power3.out" },
        headlineEnd,
      );

      tl.from(
        ".hero-side-card, .hero-kpi-card",
        {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.75,
          stagger: 0.2,
          ease: "back.out(1.5)",
        },
        ">",
      );

      tl.to(
        ".hero-action-btn",
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "power2.out" },
        ">",
      );

      tl.add(() => {
        if (!hasCountedRef.current && introRef.current) {
          hasCountedRef.current = true;
          startCountUp(introRef.current);
        }
      });

      tl.to(".hero-scroll-hint", { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, ">");

      tl.add(() => {
        gsap.fromTo(
          ".hero-performs",
          { backgroundPositionX: "0%" },
          {
            backgroundPositionX: "100%",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );

        gsap.to(".hero-stat", {
          y: (i) => (i % 2 === 0 ? 3 : -3),
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.15,
        });

        gsap.fromTo(
          ".hero-why-glow",
          { scale: 1, opacity: 0.6 },
          { scale: 1.3, opacity: 1, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" },
        );

        gsap.fromTo(
          ".hero-scroll-line",
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );

        gsap.fromTo(
          ".hero-metric-sweep",
          { xPercent: -135, opacity: 0.05 },
          {
            xPercent: 180,
            opacity: 0.24,
            duration: 3.2,
            repeat: -1,
            repeatDelay: 1.2,
            ease: "sine.inOut",
            stagger: 0.35,
          },
        );

        gsap.to(".hero-why-row", {
          y: (i) => (i % 2 === 0 ? 2 : -2),
          rotationZ: (i) => (i % 3 === 0 ? 0.3 : -0.3),
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.18,
        });
      });
    }, introRef);

    if (reduced) {
      return () => {
        splits.forEach((s) => s.revert());
        ctx.revert();
      };
    }

    const approachBtn = introRef.current?.querySelector<HTMLElement>(".hero-approach-btn");
    const glintEl = approachBtn?.querySelector<HTMLElement>(".hero-approach-glint");

    if (approachBtn && glintEl) {
      let glintTween: gsap.core.Tween | null = null;

      const onEnter = () => {
        glintTween?.kill();
        gsap.set(glintEl, { xPercent: -100 });
        glintTween = gsap.to(glintEl, {
          xPercent: 100,
          duration: 1.2,
          repeat: -1,
          ease: "linear",
        });
      };

      const onLeave = () => {
        glintTween?.kill();
        glintTween = null;
        gsap.set(glintEl, { clearProps: "transform" });
      };

      approachBtn.addEventListener("pointerenter", onEnter);
      approachBtn.addEventListener("pointerleave", onLeave);

      cleanupGlintHover = () => {
        glintTween?.kill();
        approachBtn.removeEventListener("pointerenter", onEnter);
        approachBtn.removeEventListener("pointerleave", onLeave);
      };
    }

    if (!coarsePointer && approachBtn) {
      const xTo = gsap.quickTo(approachBtn, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(approachBtn, "y", { duration: 0.45, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rect = approachBtn.getBoundingClientRect();
        const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        xTo(dx);
        yTo(dy);
      };

      const onLeaveMag = () => {
        xTo(0);
        yTo(0);
      };

      approachBtn.addEventListener("pointermove", onMove);
      approachBtn.addEventListener("pointerleave", onLeaveMag);

      cleanupMagnetic = () => {
        approachBtn.removeEventListener("pointermove", onMove);
        approachBtn.removeEventListener("pointerleave", onLeaveMag);
      };
    }

    const interactiveCards = Array.from(
      introRef.current?.querySelectorAll<HTMLElement>(".hero-kpi-card, .hero-side-row") ?? [],
    );

    if (interactiveCards.length) {
      const cleanups: Array<() => void> = [];

      interactiveCards.forEach((card) => {
        const xTo = gsap.quickTo(card, "x", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.35, ease: "power3.out" });
        const rxTo = gsap.quickTo(card, "rotationX", { duration: 0.45, ease: "power3.out" });
        const ryTo = gsap.quickTo(card, "rotationY", { duration: 0.45, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
          const ny = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
          xTo(nx * 5);
          yTo(ny * 5);
          rxTo(-ny * 4);
          ryTo(nx * 6);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
          rxTo(0);
          ryTo(0);
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      cleanupCardTilt = () => {
        cleanups.forEach((fn) => fn());
      };
    }

    return () => {
      splits.forEach((s) => s.revert());
      cleanupGlintHover?.();
      cleanupMagnetic?.();
      cleanupCardTilt?.();
      ctx.revert();
    };
  }, [entranceUnlocked]);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3 — Scroll animations (needs Lenis scroller)
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!lenis || !entranceUnlocked) return;
    if (!introRef.current) return;
    const reduced = prefersReducedMotion();
    const scroller = getScroller();

    if (reduced) {
      const ctx = gsap.context(() => {
        gsap.set(
          [
            ".hero-content-layer",
            ".hero-left-col",
            ".hero-right-col",
            ".hero-kpi-strip",
            ".hero-kpi-card",
            ".hero-outcome-chip",
            ".hero-side-row",
            ".hero-why-row",
            ".hero-approach-btn",
            ".hero-canvas-wrap",
          ],
          { clearProps: "transform,filter,opacity" },
        );
      }, introRef);
      scheduleScrollTriggerRefresh();
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      // hero content fades on scroll
      gsap.to(".hero-content-layer", {
        opacity: 0.12, y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      // Parallax background layers (pixel motion, eased scrub)
      gsap.fromTo(
        ".hero-parallax-slow",
        { y: 0 },
        {
          y: 20,
          ease: "power1.out",
          scrollTrigger: {
            trigger: introRef.current,
            scroller,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );

      gsap.fromTo(
        ".hero-parallax-fast",
        { y: 0 },
        {
          y: 50,
          ease: "power1.out",
          scrollTrigger: {
            trigger: introRef.current,
            scroller,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );

      // Column drift to create depth while keeping readability.
      gsap.to(".hero-left-col", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".hero-kpi-card", {
        yPercent: (i) => (i % 2 === 0 ? -2.2 : 2.2),
        rotate: (i) => (i === 0 ? -0.45 : i === 1 ? 0.45 : 0),
        transformOrigin: "50% 50%",
        ease: "none",
        stagger: 0.03,
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.3,
        },
      });

      gsap.to(".hero-outcome-chip", {
        yPercent: (i) => (i % 2 === 0 ? -2 : 2),
        ease: "none",
        stagger: 0.03,
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".hero-kpi-strip", {
        yPercent: -4.5,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-right-col", {
        yPercent: 7,
        scale: 0.985,
        transformOrigin: "50% 30%",
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      // Subtle card-line drift makes the stack feel less static.
      gsap.to(".hero-side-row", {
        yPercent: (i) => (i % 2 === 0 ? -4 : 4),
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Why Wincore rows get enhanced depth parallax with stagger
      gsap.to(".hero-why-row", {
        yPercent: (i) => (i % 2 === 0 ? -5 : 5),
        rotationZ: (i) => (i % 2 === 0 ? -0.5 : 0.5),
        ease: "none",
        stagger: 0.06,
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.6,
        },
      });

      // Why Wincore card container fades and drifts
      gsap.to(".hero-why-card", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.3,
        },
      });

      // Why Wincore glow pulses and expands on scroll
      gsap.to(".hero-why-glow", {
        scale: 1.2,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      // Keep Process CTA alive through the hero scroll range.
      gsap.to(".hero-approach-btn", {
        y: -5,
        boxShadow: "0 18px 44px rgba(0,191,255,0.15)",
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-approach-arrow-wrap", {
        rotate: 16,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      // WebGL canvas fades out
      gsap.to(".hero-canvas-wrap", {
        opacity: 0.08,
        scale: 1.05,
        rotation: 0.3,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: introRef.current,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });
    }, introRef);

    // ── reel section ──────────────────────────────────────────────────────
    const ctxReel = gsap.context(() => {
      const items: [string, number][] = [
        [".reel-kicker", 88],
        [".reel-title", 86],
        [".reel-copy", 84],
        [".reel-video-shell", 78],
      ];
      items.forEach(([sel, pct], idx) => {
        gsap.from(sel, {
          autoAlpha: 0,
          y: idx === items.length - 1 ? 40 : 20,
          duration: idx === items.length - 1 ? 1 : 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: reelRef.current,
            scroller,
            start: `top ${pct}%`,
            once: true,
          },
        });
      });
    }, reelRef);

    scheduleScrollTriggerRefresh();
    return () => { ctx.revert(); ctxReel.revert(); };
  }, [lenis, entranceUnlocked]);

  return (
    <>
      <section
        id="hero-section"
        ref={introRef}
        className="relative flex min-h-[100svh] flex-col justify-center bg-background px-5 pt-16 pb-8 sm:px-6 md:px-10 md:pt-20 md:pb-10 lg:px-12"
      >
        {/* tftl-style soft top wash + floating tip badges */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-accent/[0.07] via-transparent to-transparent"
          aria-hidden
        />

        {/* background layers */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="hero-parallax-slow absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(255,255,255,0.1),transparent_58%)]" />
          <div className="hero-parallax-fast absolute bottom-0 left-1/2 h-[min(60vh,520px)] w-[min(100%,900px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_72%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,white_92%)]" />
        </div>

        <div className="hero-canvas-wrap pointer-events-none absolute inset-0 z-[1] opacity-[0.34] md:opacity-[0.4]">
          <HeroScene heroId="hero-section" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_85%_55%_at_50%_35%,transparent_0%,rgba(255,255,255,0.2)_70%,rgba(255,255,255,0.8)_100%)]" />

        <div className="hero-content-layer _container relative z-10 mx-auto w-full max-w-[1240px]">
          <div className="grid min-h-[min(78vh,820px)] grid-cols-1 items-start gap-10 md:gap-12 lg:grid-cols-12 lg:gap-12 lg:items-center">

            {/* ── LEFT column ── */}
            <div className="hero-left-col flex flex-col text-left lg:col-span-6">

              <p className="hero-eyebrow mb-5 text-[10px] font-black uppercase tracking-[0.5em] text-black/40">
                <span className="hero-eyebrow-part inline-block">Wincore Agency · </span>
                <span className="hero-eyebrow-part inline-block text-accent/90">Colombo &amp; global</span>
              </p>

              {/*
                Lines 1–2: .hero-line-split → SplitType words. Line 3: gradient word in .hero-performs-inner (no split).
              */}
              <h1 className="hero-headline font-heading text-[2.1rem] font-black uppercase leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.35rem] lg:leading-[1.05]">
                <span className="hero-line block overflow-hidden pb-[0.2em]">
                  <span className="hero-line-inner hero-line-split block">Creative digital</span>
                </span>
                <span className="hero-line block overflow-hidden pb-[0.2em]">
                  <span className="hero-line-inner hero-line-split block text-black/35">that actually</span>
                </span>
                <span className="hero-line block overflow-hidden pb-[0.2em]">
                  <span className="hero-performs-inner block will-change-transform">
                    <span className="hero-performs inline-block bg-gradient-to-r from-foreground via-foreground/85 to-accent bg-[length:200%_100%] bg-clip-text text-transparent">
                      performs
                    </span>
                  </span>
                </span>
              </h1>

              <div className="hero-sub mt-7 max-w-xl text-base font-light leading-relaxed text-black/45 md:mt-8 md:text-lg">
                <p className="hero-sub-line">
                  Brand systems, motion, WebGL, and AI-accelerated delivery — one team, one standard.
                </p>
                <p className="hero-sub-line mt-3">
                  Built for clarity, speed, and measurable outcomes.
                </p>
                <div className="hero-sub-line mt-8 flex flex-wrap gap-2.5">
                  {HERO_TIPS.map((tip) => (
                    <span
                      key={tip.text}
                      className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm transition-transform hover:scale-[1.03]"
                      style={{ background: tip.bg, color: tip.color }}
                    >
                      {tip.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT column (side card) ── */}
            <aside className="hero-right-col hero-side-card lg:col-span-6 lg:self-center">
              <div className="hero-why-card relative overflow-visible rounded-[2.5rem] border border-black/[0.06] bg-gradient-to-br from-white via-white to-black/[0.02] px-8 pt-10 pb-10 pr-8 shadow-[0_24px_48px_rgba(0,0,0,0.04)] sm:px-10 sm:pt-12 sm:pb-12 md:px-12 md:pt-14 md:pb-14 lg:px-14 lg:pt-16 lg:pb-16 lg:pl-[4.25rem] lg:pr-10">
                <div className="hero-why-glow pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-accent/10 opacity-90" />

                <header className="hero-why-header mb-10 flex items-center gap-6 md:mb-12">
                  <p className="text-[12px] md:text-[13px] font-black uppercase tracking-[0.3em] text-accent whitespace-nowrap">Why Wincore</p>
                  <div className="h-[1px] flex-1 bg-accent/20" />
                </header>

                <ul className="space-y-4 md:space-y-5">
                  {FOCUS.map((item, idx) => (
                    <li
                      key={item.label}
                      className="hero-why-row hero-side-row group/row relative rounded-2xl border border-transparent px-6 py-7 md:px-7 md:py-8 transition-all duration-500 hover:border-accent/30 hover:bg-accent/5"
                      data-index={idx}
                    >
                      <div className="flex items-start gap-5 py-1">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/[0.03] transition-all duration-500 group-hover/row:scale-110 group-hover/row:bg-accent group-hover/row:shadow-[0_8px_16px_rgba(0,191,255,0.25)]">
                          <item.icon
                            className="text-black/30 transition-colors duration-500 group-hover/row:text-white"
                            size={22}
                            strokeWidth={1.3}
                          />

                        </div>
                        <div className="flex flex-col gap-2 pr-1 pb-0 min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-3">
                            <span className="text-[16px] md:text-[18px] font-bold tracking-tight text-foreground">{item.label}</span>
                            <span className="shrink-0 rounded-full border border-accent/25 bg-accent/8 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-accent">
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-[14px] md:text-[15px] leading-relaxed text-black/40 transition-colors group-hover/row:text-foreground/70 break-words">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="hero-side-cta mt-10 border-t border-black/[0.08] pt-8.5 md:mt-11 md:pt-9">
                  <Link
                    href="/about"
                    className={`hero-approach-btn cursor-hover group/btn relative flex w-full items-center justify-between gap-5 overflow-hidden rounded-2xl border border-black/[0.11] bg-gradient-to-r from-black/[0.07] via-black/[0.03] to-transparent px-5 py-4 transition-all duration-300 hover:border-accent/45 hover:shadow-[0_16px_40px_rgba(0,191,255,0.14)] md:px-6 md:py-[1.125rem] ${ctaHover}`}
                  >
                    <div className="hero-approach-glint pointer-events-none absolute inset-y-0 left-[-35%] w-[28%] -skew-x-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-accent/60 to-transparent transition-all duration-700 group-hover/btn:w-full" />

                    <div className="relative z-10 flex min-w-0 items-center gap-4">
                      <span className="hero-approach-chip shrink-0 rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.28em] text-accent/90">
                        Process
                      </span>
                      <span className="hero-approach-title text-[11px] font-black uppercase tracking-[0.3em] text-foreground pb-0.5 transition-colors group-hover/btn:text-accent">
                        Our approach
                      </span>
                    </div>

                    <span className="hero-approach-arrow-wrap relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/12 bg-black/[0.03] transition-all duration-500 group-hover/btn:border-accent/45 group-hover/btn:bg-accent/10">
                      <ArrowRight
                        className="text-foreground/45 transition-all duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:text-accent"
                        size={16}
                        strokeWidth={2.5}
                      />
                    </span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <div className="hero-kpi-strip mt-10 md:mt-12 lg:mt-16">
            <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-12 lg:gap-6">
              <article className="hero-kpi-card group relative overflow-visible rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl px-7 py-9 shadow-[0_30px_60px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] transition-shadow duration-500 hover:shadow-[0_45px_100px_rgba(0,191,255,0.08)] md:px-9 md:py-10 lg:px-10 lg:py-11 lg:col-span-4 [transform-style:preserve-3d]">
                <div className="hero-metric-sweep pointer-events-none absolute inset-y-0 left-[-34%] w-[24%] -skew-x-12 bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
                <div className="mb-6 md:mb-7 flex items-center justify-between">
                  <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-black/35">Outcomes</p>
                  <span className="h-2 w-2 rounded-full bg-accent/80" aria-hidden />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
                  {OUTCOMES.map((p) => (
                    <span
                      key={p}
                      className="hero-outcome-chip inline-flex min-h-12 items-center justify-center rounded-xl border border-black/10 bg-black/[0.03] px-5 py-4 text-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] leading-tight text-foreground/70"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </article>

              <article className="hero-kpi-card group relative overflow-visible rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl px-7 py-9 shadow-[0_30px_60px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] transition-shadow duration-500 hover:shadow-[0_45px_100px_rgba(0,191,255,0.08)] md:px-9 md:py-10 lg:px-10 lg:py-11 lg:col-span-4 [transform-style:preserve-3d]">
                <div className="hero-metric-sweep pointer-events-none absolute inset-y-0 left-[-34%] w-[24%] -skew-x-12 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
                <div className="mb-6 md:mb-7 flex flex-col gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-black/35">Actions</p>
                    <p className="mt-2 text-[13px] md:text-[14px] leading-relaxed text-black/45">Choose a path and we will turn it into a high-performing launch.</p>
                  </div>
                  <span className="hidden text-[8px] font-black uppercase tracking-[0.2em] text-black/20 sm:block whitespace-nowrap">Fast response</span>
                </div>
                <div className="grid grid-cols-1 gap-3.5">
                  <Link
                    href="/contact"
                    className={`hero-action-btn cursor-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-accent/45 bg-accent px-5 py-3.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(0,191,255,0.35)] ${ctaHover}`}
                  >
                    Start a project
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                      href="/works"
                      className={`hero-action-btn cursor-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-black/[0.04] px-4 py-3.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:border-accent/50 hover:text-accent ${ctaHover}`}
                    >
                      View work
                    </Link>
                    <Link
                      href="/services"
                      className={`hero-action-btn cursor-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/5 bg-transparent px-4 py-3.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] text-black/60 transition-colors hover:border-black/20 hover:text-black/90 ${ctaHover}`}
                    >
                      Services
                    </Link>
                  </div>
                </div>
              </article>

              <article className="hero-kpi-card group relative overflow-visible rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl px-7 py-9 shadow-[0_30px_60px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] transition-shadow duration-500 hover:shadow-[0_45px_100px_rgba(0,191,255,0.08)] md:px-9 md:py-10 lg:px-10 lg:py-11 lg:col-span-4 [transform-style:preserve-3d]">
                <div className="hero-metric-sweep pointer-events-none absolute inset-y-0 left-[-34%] w-[24%] -skew-x-12 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                <p className="mb-6 md:mb-7 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-black/35">Performance Snapshot</p>
                <dl className="space-y-3.5">
                  {KPI_STATS.map((stat, i) => (
                    <div key={stat.label} className="hero-stat relative flex items-center justify-between rounded-xl border border-black/10 bg-black/[0.02] px-5 py-5 transition-colors duration-500 group-hover:border-black/20">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-black/20 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <stat.icon className={`${stat.color} opacity-70 shrink-0`} size={16} />
                        <dt className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.1em] text-black/45 leading-tight">{stat.label}</dt>
                      </div>
                      <dd className="flex items-baseline gap-1.5 shrink-0 ml-3">
                        <span className="stat-value text-[1.9rem] md:text-[2.1rem] font-black tracking-tight text-foreground" data-target={stat.value}>0</span>
                        <span className={`text-[0.9rem] font-black ${stat.color}`}>{stat.suffix}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="hero-scroll-hint pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <div className="flex flex-col items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-black/30">
            <span>Scroll</span>
            <div className="hero-scroll-line h-10 w-px origin-top bg-gradient-to-b from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Reel section ── */}
      <section
        ref={reelRef}
        className="hero-reel-block relative border-t border-black/5 bg-background px-5 py-12 sm:px-6 md:px-[5vw] md:py-16"
      >
        <div className="_container mx-auto mb-8 flex flex-col gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="reel-kicker text-[10px] font-black uppercase tracking-[0.45em] text-accent">Showreel</p>
            <h2 className="reel-title mt-2 text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
              Motion <span className="text-foreground/30 italic">&amp;</span> craft
            </h2>
          </div>
          <p className="reel-copy max-w-md text-sm text-foreground/50 md:text-base">
            A short reel — hover for colour, tap to expand on desktop.
          </p>
        </div>

        <div className="reel-video-shell group relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-black/10 bg-muted md:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-4 grid-rows-2 opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-black/[0.08]" />
            ))}
          </div>

          <div className="relative aspect-video w-full md:aspect-[21/9] md:min-h-[320px]">
            <video
              autoPlay loop muted playsInline preload="metadata"
              className={`h-full w-full object-cover transition-transform duration-[2s] ${expanded ? "scale-100" : "scale-[1.02]"
                }`}
            >
              <source src="https://thefirstthelast.agency/assets/video/reel_small.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="absolute bottom-5 right-5 z-20 flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-full border border-black/15 bg-white/90 px-5 py-3 text-[9px] font-black uppercase tracking-widest text-foreground shadow-sm backdrop-blur-md transition-all hover:border-accent hover:bg-accent/10 md:bottom-8 md:right-8"
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