"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

function useColomboTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-LK", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Colombo",
      });
      setTime(formatter.format(now));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function ContactFooter() {
  const colomboTime = useColomboTime();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cf-kicker",
        { y: reduced ? 0 : 20, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.8,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".cf-kicker", scroller, start: "top 90%", once: true },
        },
      );

      const titleLines = gsap.utils.toArray<HTMLElement>(".cf-title-line");
      titleLines.forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: reduced ? 0 : 110, opacity: reduced ? 1 : 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: reduced ? 0 : 1,
            ease: "expo.out",
            delay: i * 0.08,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, scroller, start: "top 92%", once: true },
          },
        );
      });

      gsap.fromTo(
        ".cf-contact-block",
        { y: reduced ? 0 : 36, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.9,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".cf-contact-block", scroller, start: "top 88%", once: true },
        },
      );


      const reveals = gsap.utils.toArray<HTMLElement>(".cf-reveal");
      reveals.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: reduced ? 0 : 60, opacity: reduced ? 1 : 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduced ? 0 : 1,
            ease: "expo.out",
            delay: i * 0.07,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, scroller, start: "top 90%", once: true },
          },
        );
      });

      gsap.fromTo(
        ".cf-company-name",
        { yPercent: reduced ? 0 : 105, opacity: reduced ? 1 : 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: reduced ? 0 : 1.05,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".cf-company-shell",
            scroller,
            start: "top 92%",
            once: true,
          },
        },
      );
    }, footerRef);

    scheduleScrollTriggerRefresh();

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative overflow-hidden border-t border-black/5 bg-background pb-16 pt-20 md:pb-24 md:pt-28"
    >
      <div className="_container relative z-10">
        {/* ── Main Contact Section ── */}
        <div className="mb-16 flex flex-col items-center justify-center text-center md:mb-24">
          <span className="cf-kicker mb-6 text-[11px] font-black uppercase tracking-[0.5em] text-accent">
            Let&apos;s Build Together
          </span>
          <h2 className="mb-14 pb-1 text-[16vw] font-black uppercase leading-[0.9] tracking-tighter md:text-[14vw]">
            <span className="block overflow-hidden">
              <span className="cf-title-line block text-foreground">GOT A</span>
            </span>
            <span className="block overflow-hidden flex items-center justify-center gap-4">
              <span className="cf-title-line block italic text-transparent [-webkit-text-stroke:2px_rgba(0,0,0,0.8)] md:[-webkit-text-stroke:4px_rgba(0,0,0,0.8)]">
                VISION?
              </span>
            </span>
          </h2>

          <div className="cf-contact-block relative z-20">
            <a
              href="mailto:hello@wincore.media"
              className="group relative flex items-center gap-6 overflow-hidden rounded-full border border-black/10 bg-white/60 py-5 pl-10 pr-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all duration-500 hover:border-accent/50 hover:bg-white/80 hover:shadow-[0_8px_32px_rgba(0,191,255,0.15)]"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-accent/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-black/90 transition-colors group-hover:text-foreground md:text-xl">
                hello@wincore.media
              </span>
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-foreground">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </a>
          </div>
        </div>

        <nav
          className="cf-reveal mb-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-b border-black/5 pb-12 md:justify-between"
          aria-label="Footer"
        >
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.45em] text-black/35 transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="/works" className="text-[10px] font-black uppercase tracking-[0.45em] text-black/35 transition-colors hover:text-accent">
            Works
          </Link>
          <Link href="/services" className="text-[10px] font-black uppercase tracking-[0.45em] text-black/35 transition-colors hover:text-accent">
            Services
          </Link>
          <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.45em] text-black/35 transition-colors hover:text-accent">
            About
          </Link>
          <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.45em] text-black/35 transition-colors hover:text-accent">
            Contact
          </Link>
        </nav>

        {/* ── Secondary Footer ── */}
        <div className="cf-reveal border-t border-black/5 pt-12 md:pt-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7 flex flex-col gap-6">
              <Link href="/" className="cursor-hover flex flex-col items-start">
                <span className="text-4xl font-black tracking-tighter text-foreground">WINCOR</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent -mt-1">
                  Agency
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">
                  Time in Colombo:
                </span>
                <span className="text-lg font-black italic tracking-widest text-accent/80">
                  {colomboTime || "--:--"}
                </span>
              </div>

              <div className="cf-company-shell mt-3 overflow-visible">
                <p className="cf-company-name text-left font-black uppercase leading-[0.9] tracking-tight text-black/90 text-[clamp(2.4rem,10vw,8.5rem)]">
                  WINCORE MEDIA
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col items-start gap-8 md:items-end md:justify-end">
              <p className="text-left text-[11px] font-bold uppercase tracking-[0.5em] text-black/30 md:text-right">
                Sri Lanka&apos;s AI Native <br />
                Digital Experience Studio®
              </p>
              <div className="text-left text-[10px] font-black uppercase tracking-[0.5em] text-black/10 md:text-right">
                © {new Date().getFullYear()} WINCORE MEDIA. <br />
                All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

