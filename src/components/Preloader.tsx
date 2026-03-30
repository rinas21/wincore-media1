"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsapPlugins } from "@/lib/motion";
import { usePreloaderMarkComplete } from "@/context/PreloaderContext";

gsap.registerPlugin(ScrollTrigger);

/** Floating tags — tftl-agency Preloader.tsx pattern */
const PRELOADER_TAGS: { text: string; bg: string; style: CSSProperties }[] = [
  { text: "Wincore", bg: "var(--accent-preloader-pill)", style: { left: "18%", top: "22%" } },
  { text: "Brand · Motion", bg: "var(--secondary-wash)", style: { left: "12%", top: "42%" } },
  { text: "WebGL", bg: "var(--accent-preloader-pill-2)", style: { left: "62%", top: "28%" } },
  { text: "Performance", bg: "var(--foreground-wash-6)", style: { right: "14%", bottom: "26%" } },
];

export default function Preloader() {
  const [percentage, setPercentage] = useState(0);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasExitedRef = useRef(false);
  const markPreloaderComplete = usePreloaderMarkComplete();

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  const finishPreloader = useCallback(() => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    const target = preloaderRef.current;
    if (!target) return;

    document.body.style.overflow = "hidden";

    const exitCtx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          target.style.display = "none";
          document.body.style.overflow = "";
          markPreloaderComplete();
          window.setTimeout(() => ScrollTrigger.refresh(), 150);
          window.setTimeout(() => ScrollTrigger.refresh(), 600);
          exitCtx?.revert();
        },
      });

      tl.to(".preloader-reveal", {
        yPercent: -110,
        skewY: -6,
        duration: 1.1,
        stagger: 0.05,
        ease: "expo.inOut",
        delay: 0.3,
      }).to(
        target,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
        },
        "-=0.85",
      );
    }, preloaderRef);
  }, [markPreloaderComplete]);

  useEffect(() => {
    if (!preloaderRef.current) return;

    const ctx = gsap.context(() => {
      const tags = tagRefs.current.filter(Boolean);
      gsap.set(".preloader-reveal", { yPercent: 100, skewY: 5 });

      const tl = gsap.timeline();
      tl.from(
        tags,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        },
        0.2,
      );
      tl.to(
        ".preloader-reveal",
        {
          yPercent: 0,
          skewY: 0,
          duration: 1.4,
          stagger: 0.08,
          ease: "expo.out",
        },
        0,
      );
    }, preloaderRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const inc = Math.random() > 0.84 ? 5 : 1;
        return Math.min(prev + inc, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const forceComplete = window.setTimeout(() => {
      setPercentage((prev) => (prev < 100 ? 100 : prev));
    }, 5200);

    const onRuntimeError = () => {
      setPercentage((prev) => (prev < 100 ? 100 : prev));
    };

    window.addEventListener("error", onRuntimeError);
    window.addEventListener("unhandledrejection", onRuntimeError);

    return () => {
      window.clearTimeout(forceComplete);
      window.removeEventListener("error", onRuntimeError);
      window.removeEventListener("unhandledrejection", onRuntimeError);
    };
  }, []);

  useEffect(() => {
    if (percentage === 100) {
      finishPreloader();
    }
  }, [percentage, finishPreloader]);

  // Safety: always unblock the app + hero animations if exit timeline never completes
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!hasExitedRef.current) {
        hasExitedRef.current = true;
        const el = preloaderRef.current;
        if (el) {
          el.style.display = "none";
        }
        document.body.style.overflow = "";
        markPreloaderComplete();
        window.setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    }, 6500);
    return () => window.clearTimeout(id);
  }, [markPreloaderComplete]);

  return (
    <div
      ref={preloaderRef}
      data-preloader=""
      className="fixed inset-0 z-[9999] bg-background flex flex-col justify-between p-10 md:p-24 overflow-hidden"
      aria-hidden="true"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="overflow-hidden">
          <span className="preloader-reveal block text-[10px] uppercase tracking-[0.4em] font-black text-accent">
            WINCOR <span className="text-black/30">Agency</span>
          </span>
        </div>
        <div className="overflow-hidden hidden md:block">
          <span className="preloader-reveal block text-[10px] uppercase tracking-[0.4em] font-black text-black/15 italic">
            Initializing cinematic experience…
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-10 relative z-10">
        <div className="max-w-[820px] overflow-hidden">
          <h1 className="preloader-reveal text-[14vw] md:text-[7vw] font-black leading-[0.85] uppercase tracking-tighter text-foreground">
            Success <br />
            <span className="text-black/10 italic">Designed</span>
          </h1>
        </div>

        <div className="overflow-hidden">
          <div className="preloader-reveal flex items-baseline gap-4 text-foreground">
            <span className="text-[26vw] md:text-[12vw] font-black leading-none italic">
              {percentage}
            </span>
            <span className="text-[6vw] md:text-[2.5vw] text-accent font-black tracking-widest">
              %
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-300 shadow-[var(--shadow-accent-preloader)]"
        style={{ width: `${percentage}%` }}
      />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid grid-cols-12 h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-black/20 h-full" />
        ))}
      </div>

      {PRELOADER_TAGS.map((t, i) => (
        <div
          key={t.text}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          className="preloader-tag pointer-events-none absolute z-[1] hidden sm:block"
          style={t.style}
        >
          <div
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[0.75rem] font-medium text-foreground/90"
            style={{ background: t.bg }}
          >
            {t.text}
          </div>
        </div>
      ))}
    </div>
  );
}
