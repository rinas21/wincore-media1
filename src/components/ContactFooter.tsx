"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      gsap.fromTo(".cf-kicker",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".cf-kicker", start: "top 90%", once: true } }
      );

      // Title lines — each line individually triggered
      const titleLines = gsap.utils.toArray<HTMLElement>(".cf-title-line");
      titleLines.forEach((el, i) => {
        gsap.fromTo(el,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", delay: i * 0.08, clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start: "top 92%", once: true } }
        );
      });

      gsap.fromTo(".cf-contact-block",
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".cf-contact-block", start: "top 88%", once: true } }
      );

      gsap.fromTo(".cf-form-shell",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".cf-form-shell",
            start: "top 88%",
            once: true,
          },
        }
      );

      const reveals = gsap.utils.toArray<HTMLElement>(".cf-reveal");
      reveals.forEach((el, i) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "expo.out", delay: i * 0.07, clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start: "top 90%", once: true } }
        );
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative overflow-hidden border-t border-white/5 bg-background pb-12 pt-[25vw]"
    >
      <div className="_container relative z-10">
        {/* ── Main Contact Section ── */}
        <div className="mb-[15vw] flex flex-col items-center justify-center text-center">
          <span className="cf-kicker mb-6 text-[11px] font-black uppercase tracking-[0.5em] text-accent">
            Let&apos;s Build Together
          </span>
          <h2 className="mb-14 text-[16vw] font-black uppercase leading-[0.75] tracking-tighter md:text-[14vw]">
            <span className="block overflow-hidden">
              <span className="cf-title-line block">GOT A</span>
            </span>
            <span className="block overflow-hidden flex items-center justify-center gap-4">
              <span className="cf-title-line block italic text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.8)] md:[-webkit-text-stroke:4px_rgba(255,255,255,0.8)]">
                VISION?
              </span>
            </span>
          </h2>

          <div className="cf-contact-block relative z-20">
            <a
              href="mailto:hello@wincore.media"
              className="group relative flex items-center gap-6 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-4 pl-8 pr-4 backdrop-blur-xl transition-all duration-500 hover:border-accent/50 hover:bg-white/10"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-accent/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-white/90 transition-colors group-hover:text-white md:text-xl">
                hello@wincore.media
              </span>
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black transition-transform duration-500 group-hover:scale-110 group-hover:bg-white">
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

        {/* ── Secondary Footer ── */}
        <div className="cf-reveal flex flex-col items-start justify-between gap-16 border-t border-white/5 pt-16 md:flex-row md:items-end">
          <div className="flex flex-col gap-6">
            <Link href="/" className="cursor-hover flex flex-col items-start">
              <span className="text-4xl font-black tracking-tighter text-white">WINCOR</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent -mt-1">
                Agency
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                Time in Colombo:
              </span>
              <span className="text-lg font-black italic tracking-widest text-accent/80">
                {colomboTime || "--:--"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-8 md:items-end">
            <p className="text-left text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 md:text-right">
              Sri Lanka&apos;s AI Native <br />
              Digital Experience Studio®
            </p>
            <div className="text-left text-[10px] font-black uppercase tracking-[0.5em] text-white/10 md:text-right">
              © {new Date().getFullYear()} WINCORE MEDIA. <br />
              All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

