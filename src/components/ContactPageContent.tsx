"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ArrowUpRight, MapPin, Clock, Mail } from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

type SubmitState = "idle" | "loading" | "sent" | "error";

const NAV_LINKS = [
  ["/", "Home"],
  ["/works", "Works"],
  ["/services", "Services"],
  ["/about", "About"],
] as const;

function useColomboTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-LK", {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          hour12: false, timeZone: "Asia/Colombo",
        }).format(new Date())
      );
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function ContactPageContent() {
  const rootRef    = useRef<HTMLElement>(null);
  const formRef    = useRef<HTMLFormElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const colomboTime = useColomboTime();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback,    setFeedback   ] = useState("");

  /* ── GSAP entrance ── */
  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced  = prefersReducedMotion();
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".ct-reveal, .ct-line, .ct-fade", { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)" });
        return;
      }

      /* 1 — Page-load curtain wipe */
      gsap.set(curtainRef.current, { scaleY: 1, transformOrigin: "top center" });
      gsap.to(curtainRef.current, {
        scaleY: 0,
        duration: 1.1,
        ease: "expo.inOut",
        delay: 0.1,
      });

      /* 2 — Hero heading: typewriter-style char reveal from clip */
      const headingEl = rootRef.current?.querySelector(".ct-hero-title") as HTMLElement | null;
      if (headingEl) {
        const split = new SplitType(headingEl, { types: "chars,words" });
        splits.push(split);
        gsap.set(split.chars, { yPercent: 115, opacity: 0 });
        gsap.to(split.chars, {
          yPercent: 0, opacity: 1,
          duration: 1,
          stagger: 0.025,
          ease: "expo.out",
          delay: 0.9,
          clearProps: "transform,opacity",
        });
      }

      /* 3 — Kicker + sub paragraph */
      gsap.fromTo(
        ".ct-fade",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 1.1, clearProps: "transform,opacity" }
      );

      /* 4 — Meta pills slide in */
      gsap.fromTo(
        ".ct-pill",
        { opacity: 0, scale: 0.82, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "back.out(1.8)", delay: 1.3, clearProps: "all" }
      );

      /* 5 — Form rows reveal on scroll */
      gsap.fromTo(
        ".ct-line",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: formRef.current, scroller, start: "top 85%", once: true },
        }
      );

      /* 6 — submit row */
      gsap.fromTo(
        ".ct-submit-row",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".ct-submit-row", scroller, start: "top 95%", once: true },
        }
      );

      /* 7 — Ambient orb parallax */
      gsap.to(".ct-orb-1", {
        y: -80, ease: "none",
        scrollTrigger: { trigger: rootRef.current, scroller, start: "top top", end: "bottom top", scrub: 1.6 },
      });
      gsap.to(".ct-orb-2", {
        y: 60, ease: "none",
        scrollTrigger: { trigger: rootRef.current, scroller, start: "top top", end: "bottom top", scrub: 2 },
      });

    }, rootRef);

    scheduleScrollTriggerRefresh();
    return () => { splits.forEach(s => s.revert()); ctx.revert(); };
  }, []);

  /* ── Form submit ── */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd      = new FormData(e.currentTarget);
    const name    = String(fd.get("name")    ?? "").trim();
    const email   = String(fd.get("email")   ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const type    = String(fd.get("type")    ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) { setSubmitState("error"); setFeedback("Please complete all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setSubmitState("error"); setFeedback("Please enter a valid email address."); return; }

    setSubmitState("loading"); setFeedback("");
    window.setTimeout(() => {
      const body    = [`Name: ${name}`, `Email: ${email}`, company ? `Company: ${company}` : "", type ? `Project type: ${type}` : "", "", message].filter(Boolean).join("\n");
      const mailto  = `mailto:hello@wincore.media?subject=${encodeURIComponent(`Project inquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
      setSubmitState("sent");
      setFeedback("Opening your email app now. If it does not open, send directly to hello@wincore.media.");
      formRef.current?.reset();
      window.location.href = mailto;
    }, 420);
  }

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-background min-h-screen" aria-label="Contact">

      {/* Page-load curtain */}
      <div ref={curtainRef} className="fixed inset-0 z-[200] bg-accent origin-top pointer-events-none" />

      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="ct-orb-1 absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full bg-accent/[0.04] blur-[130px]" />
        <div className="ct-orb-2 absolute -bottom-20 -left-40 h-[600px] w-[600px] rounded-full bg-secondary/[0.03] blur-[130px]" />
        {/* Fine dot grid — very subtle */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.7) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="_container relative z-10">

        {/* ── HERO HEADER ─────────────────────────────── */}
        <header className="pt-36 md:pt-48 pb-24 md:pb-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">

            {/* Left: mega headline */}
            <div className="flex-1">
              <span className="ct-fade block text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-8">
                Start a project
              </span>
              {/* Clip container prevents descenders clipping during anim */}
              <div className="overflow-hidden pb-2">
                <h1
                  className="ct-hero-title font-heading text-[13vw] md:text-[9vw] lg:text-[8vw] font-black leading-[0.88] tracking-[-0.02em] text-foreground uppercase"
                  style={{ perspective: "900px" }}
                >
                  Let&apos;s build<br />
                  <span className="italic text-black/20 font-normal lowercase tracking-tighter">something</span>
                  <br />remarkable.
                </h1>
              </div>
            </div>

            {/* Right: meta pills + descriptor */}
            <div className="flex flex-col gap-8 md:max-w-[340px] md:pb-2">
              <p className="ct-fade text-base md:text-lg font-light leading-relaxed text-black/50">
                New brand, campaign, or digital platform — share your vision and we&apos;ll respond within two business days.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="ct-pill inline-flex items-center gap-2.5 rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-semibold shadow-sm">
                  <Mail size={12} className="text-accent" />
                  hello@wincore.media
                </div>
                <div className="ct-pill inline-flex items-center gap-2.5 rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-semibold shadow-sm">
                  <MapPin size={12} className="text-accent" />
                  Colombo, Sri Lanka
                </div>
                <div className="ct-pill inline-flex items-center gap-2.5 rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-semibold shadow-sm tabular-nums" suppressHydrationWarning>
                  <Clock size={12} className="text-accent" />
                  {colomboTime || "—:—:—"} LK
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── FULL-WIDTH FORM ──────────────────────────── */}
        <form ref={formRef} onSubmit={handleSubmit} className="border-t border-black/[0.07] pb-24 md:pb-40">

          {/* Row 1 — Name */}
          <label className="ct-line group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 border-b border-black/[0.07] py-8 md:py-12 transition-colors duration-500 focus-within:border-accent/40">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/25 group-focus-within:text-accent transition-colors duration-500 md:w-[220px] shrink-0">
              01 / Name
            </span>
            <input
              name="name" type="text" placeholder="Your full name *" required disabled={submitState === "loading"}
              className="flex-1 bg-transparent text-2xl md:text-4xl font-light text-foreground placeholder:text-black/15 outline-none disabled:opacity-50 caret-accent"
            />
          </label>

          {/* Row 2 — Email */}
          <label className="ct-line group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 border-b border-black/[0.07] py-8 md:py-12 transition-colors duration-500 focus-within:border-accent/40">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/25 group-focus-within:text-accent transition-colors duration-500 md:w-[220px] shrink-0">
              02 / Email
            </span>
            <input
              name="email" type="email" placeholder="your@email.com *" required disabled={submitState === "loading"}
              className="flex-1 bg-transparent text-2xl md:text-4xl font-light text-foreground placeholder:text-black/15 outline-none disabled:opacity-50 caret-accent"
            />
          </label>

          {/* Row 3 — Company */}
          <label className="ct-line group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 border-b border-black/[0.07] py-8 md:py-12 transition-colors duration-500 focus-within:border-accent/40">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/25 group-focus-within:text-accent transition-colors duration-500 md:w-[220px] shrink-0">
              03 / Company
            </span>
            <input
              name="company" type="text" placeholder="Company / Brand (optional)" disabled={submitState === "loading"}
              className="flex-1 bg-transparent text-2xl md:text-4xl font-light text-foreground placeholder:text-black/15 outline-none disabled:opacity-50 caret-accent"
            />
          </label>

          {/* Row 4 — Project Type */}
          <div className="ct-line group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 border-b border-black/[0.07] py-8 md:py-12 transition-colors duration-500 focus-within:border-accent/40">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/25 group-focus-within:text-accent transition-colors duration-500 md:w-[220px] shrink-0">
              04 / Project Type
            </span>
            <div className="flex flex-wrap gap-3">
              {["Branding", "Website", "Motion", "WebGL", "Marketing", "Other"].map((tag) => (
                <label key={tag} className="group/chip cursor-pointer">
                  <input type="radio" name="type" value={tag} className="sr-only" disabled={submitState === "loading"} />
                  <span className="inline-flex items-center rounded-full border border-black/[0.10] px-5 py-2 text-sm font-semibold text-black/50 transition-all duration-300 group/chip:hover:border-accent group/chip:hover:text-accent has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-white">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Row 5 — Message */}
          <label className="ct-line group flex flex-col md:flex-row md:items-start gap-4 md:gap-12 border-b border-black/[0.07] py-8 md:py-12 transition-colors duration-500 focus-within:border-accent/40">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/25 group-focus-within:text-accent transition-colors duration-500 md:w-[220px] shrink-0 md:pt-3">
              05 / Message
            </span>
            <textarea
              name="message" rows={4} placeholder="Goals, timeline, budget, references... *" required disabled={submitState === "loading"}
              className="flex-1 bg-transparent text-xl md:text-2xl font-light text-foreground placeholder:text-black/15 outline-none resize-none disabled:opacity-50 leading-relaxed caret-accent"
            />
          </label>

          {/* Feedback alerts */}
          {submitState === "error" && feedback && (
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm font-medium text-red-800 leading-relaxed">{feedback}</p>
            </div>
          )}
          {submitState === "sent" && feedback && (
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-sm font-medium text-emerald-800 leading-relaxed">{feedback}</p>
            </div>
          )}

          {/* Submit row */}
          <div className="ct-submit-row mt-16 md:mt-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex flex-col gap-1">
              <a href="mailto:hello@wincore.media" className="text-sm font-semibold text-black/40 hover:text-accent transition-colors">
                hello@wincore.media
              </a>
              <p className="text-xs text-black/30 font-medium">Prefer email? Drop us a direct line.</p>
            </div>

            <button
              type="submit"
              disabled={submitState === "loading"}
              className="group relative inline-flex items-center gap-5 overflow-hidden rounded-full bg-foreground py-5 pl-10 pr-6 text-white transition-all duration-700 hover:bg-accent disabled:opacity-50"
            >
              {/* Animated background fill on hover */}
              <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0 rounded-full" />

              <span className="relative text-[11px] font-black uppercase tracking-[0.35em]">
                {submitState === "loading" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "240ms" }} />
                    Sending
                  </span>
                ) : "Send Inquiry"}
              </span>

              {submitState !== "loading" && (
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* ── FOOTER NAV ───────────────────────────────── */}
        <nav className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-black/[0.07] py-12">
          <div className="flex flex-wrap justify-center gap-8 md:justify-start">
            {NAV_LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 hover:text-foreground transition-colors duration-300">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
            © {new Date().getFullYear()} Wincore Media
          </p>
        </nav>

      </div>
    </section>
  );
}
