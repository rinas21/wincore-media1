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
        ".cf-contact-block",
        { y: reduced ? 0 : 36, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.9,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".cf-contact-block", scroller, start: "top 98%", once: true },
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
            scrollTrigger: { trigger: el, scroller, start: "top 98%", once: true },
          },
        );
      });

      gsap.fromTo(
        ".cf-main-logo",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".cf-main-logo",
            scroller,
            start: "top 98%",
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
      className="relative overflow-hidden border-t border-black/[0.04] bg-background pb-12 pt-28 md:pb-16 md:pt-36 lg:pt-40"
    >
      {/* Decorative dynamic element */}
      <div className="pointer-events-none absolute right-[-10vw] top-0 h-[60vw] w-[60vw] rounded-full bg-accent/[0.03] blur-[120px]" />

      <div className="_container relative z-10">
        {/* ── Main Contact Section ── */}
        {/* ── Main Contact Section removed as per request ── */}


        {/* ── Massive Brand Centerpiece ── */}
        <div className="cf-reveal mb-20 md:mb-32">
          <Link href="/" className="group cf-main-logo flex flex-col items-start transition-transform hover:scale-[1.01]">
            <span className="text-7xl font-[1000] tracking-[-0.05em] text-foreground md:text-[11rem] lg:text-[13rem] leading-[0.8]">WINCORE</span>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-px w-24 bg-accent/40" />
              <span className="text-xs font-black uppercase tracking-[0.6em] text-accent group-hover:tracking-[0.8em] transition-all duration-700">
                Agency
              </span>
            </div>
          </Link>
        </div>

        {/* ── Corporate Footer Grid ── */}
        <div className="cf-reveal border-t border-black/[0.05] pt-14 md:pt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-12 md:gap-x-8 md:gap-y-0">

            {/* Col 1 — Tagline + Location */}
            <div className="sm:col-span-2 md:col-span-4 flex flex-col gap-6">
              <p className="max-w-[30ch] text-[13px] font-medium leading-[1.7] text-black/40">
                Colombo&apos;s AI Native studio. Cinematic strategy for global outliers since 2014.
              </p>
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-black/20">Operating from</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-base font-black italic tracking-tight text-foreground/60">Colombo, SL</span>
                  <span className="font-mono text-sm font-bold tabular-nums text-accent">{colomboTime || "--:--"}</span>
                </div>
              </div>
            </div>

            {/* Col 2 — Spacer on md */}
            <div className="hidden md:block md:col-span-1" />

            {/* Col 3 — Navigation */}
            <nav className="md:col-span-3 flex flex-col gap-5" aria-label="Footer navigation">
              <span className="text-[9px] font-black uppercase tracking-[0.55em] text-black/20">Navigate</span>
              {[
                { label: "Our Works", href: "/works" },
                { label: "Core Services", href: "/services" },
                { label: "The Studio", href: "/about" },
                { label: "Start a Project", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative w-fit text-[13px] font-bold uppercase tracking-[0.28em] text-black/45 transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Col 4 — Direct Line + Legal */}
            <div className="md:col-span-4 flex flex-col items-start gap-10 md:items-end md:text-right">
              <div className="cf-contact-block flex flex-col gap-2 md:items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.55em] text-black/20">Direct Line</span>
                <a
                  href="mailto:hello@wincore.media"
                  className="group relative text-xl font-black tracking-tight text-foreground/80 transition-colors hover:text-accent md:text-2xl lg:text-3xl"
                >
                  hello@wincore.media
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-accent transition-all duration-500 group-hover:w-full md:left-auto md:right-0" />
                </a>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.55em] text-black/20">Legal</span>
                <p className="text-[11px] font-medium leading-[1.8] tracking-[0.08em] text-black/30">
                  © {new Date().getFullYear()} WINCORE<br />
                  All rights reserved.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom micro-bar */}
          <div className="mt-16 flex items-center justify-between pb-4">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-black/15">Sri Lanka&apos;s AI Native Digital Studio®</span>
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-black/15">Est. 2014</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
