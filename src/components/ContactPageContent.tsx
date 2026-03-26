"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

type SubmitState = "idle" | "loading" | "sent" | "error";

const SERVICES = [
  "Branding & Identity",
  "Website Design & Build",
  "Motion & Video",
  "Performance Marketing",
  "WebGL & Immersive",
  "Strategy & Consulting",
  "Other",
];

function useColomboTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-LK", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false, timeZone: "Asia/Colombo",
      }).format(new Date());
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function ContactPageContent() {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const colomboTime = useColomboTime();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  function toggleService(svc: string) {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  }

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".ct-anim", { opacity: 1, y: 0 });
        return;
      }

      // Hero title — line by line wipe
      const titleEl = rootRef.current?.querySelector<HTMLElement>(".ct-title");
      if (titleEl) {
        const split = new SplitType(titleEl, { types: "lines" });
        splits.push(split);
        if (split.lines) {
          split.lines.forEach((line) => {
            const wrap = document.createElement("div");
            wrap.style.overflow = "hidden";
            line.parentNode?.insertBefore(wrap, line);
            wrap.appendChild(line);
          });
          gsap.fromTo(split.lines,
            { yPercent: 105 },
            { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", delay: 0.1 }
          );
        }
      }

      // Hero sub-elements fade
      gsap.fromTo(".ct-hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.65, clearProps: "transform,opacity" }
      );

      // Info cards stagger
      gsap.fromTo(".ct-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".ct-cards", scroller, start: "top 85%", once: true },
        }
      );

      // Form fields stagger
      gsap.fromTo(".ct-field",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: formRef.current, scroller, start: "top 85%", once: true },
        }
      );
    }, rootRef);

    scheduleScrollTriggerRefresh();
    return () => { splits.forEach((s) => s.revert()); ctx.revert(); };
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name    = String(fd.get("name")    ?? "").trim();
    const email   = String(fd.get("email")   ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const website = String(fd.get("website") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitState("error"); setFeedback("Please fill in all required fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitState("error"); setFeedback("Please enter a valid email address."); return;
    }

    setSubmitState("loading"); setFeedback("");
    window.setTimeout(() => {
      const body = [
        `Name: ${name}`, `Email: ${email}`,
        company ? `Company: ${company}` : "",
        website ? `Website: ${website}` : "",
        selectedServices.length ? `Services: ${selectedServices.join(", ")}` : "",
        "", message,
      ].filter(Boolean).join("\n");

      window.location.href = `mailto:hello@wincore.media?subject=${encodeURIComponent(`Project inquiry — ${name}`)}&body=${encodeURIComponent(body)}`;
      setSubmitState("sent");
      setFeedback("Launching your email client. If nothing opens, write to hello@wincore.media.");
      formRef.current?.reset();
      setSelectedServices([]);
    }, 420);
  }

  return (
    <section ref={rootRef} className="bg-white" aria-label="Contact Wincore">

      {/* ─────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────── */}
      <div className="_container pt-40 pb-16 md:pt-56 md:pb-20">

        {/* breadcrumb */}
        <p className="ct-hero-sub text-[10px] font-black uppercase tracking-[0.45em] text-black/30 mb-10">
          contact us
        </p>

        {/* giant title */}
        <h1
          className="ct-title font-heading font-black uppercase text-black"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)", lineHeight: 0.9 }}
        >
          how to reach
          <br />
          <span className="font-light text-black/15" style={{ letterSpacing: "0.03em" }}>
            wincore
          </span>
        </h1>

        {/* divider + meta */}
        <div className="ct-hero-sub mt-10 md:mt-14 pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-0 sm:justify-between">
          <p className="text-base font-light text-black/40 max-w-sm leading-relaxed">
            New campaign, brand, or product —<br className="hidden md:block" />
            we&apos;d love to hear what you&apos;re building.
          </p>
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <a
              href="mailto:hello@wincore.media"
              className="text-sm font-medium text-black/50 hover:text-black underline underline-offset-4 transition-colors"
            >
              hello@wincore.media
            </a>
            <span className="text-xs text-black/30 tabular-nums" suppressHydrationWarning>
              {colomboTime || "—:—:—"} <span className="not-italic">LK time</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          INFO CARDS (3 col, self-contained)
      ───────────────────────────────────────────── */}
      <div className="ct-cards _container pb-16 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/[0.08]" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>

          {/* card 1 — dark */}
          <div className="ct-card bg-[#0a0a0a] text-white p-8 md:p-10 flex flex-col gap-6">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">01</p>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-1">Colombo</h3>
              <p className="text-xs font-light text-white/40">Sri Lanka · GMT +5:30</p>
            </div>
            <div className="mt-auto pt-6 border-t border-white/10">
              <a href="mailto:hello@wincore.media"
                className="text-xs font-medium text-white/50 hover:text-white underline underline-offset-4 transition-colors">
                hello@wincore.media
              </a>
            </div>
          </div>

          {/* card 2 — light */}
          <div className="ct-card bg-white p-8 md:p-10 flex flex-col gap-6">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/25">02</p>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mb-1">Remote</h3>
              <p className="text-xs font-light text-black/40">Global · Any timezone</p>
            </div>
            <div className="mt-auto pt-6 border-t border-black/[0.07]">
              <a href="https://cal.com/wincore" target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-black/45 hover:text-black underline underline-offset-4 transition-colors">
                Book a discovery call →
              </a>
            </div>
          </div>

          {/* card 3 — light */}
          <div className="ct-card bg-white p-8 md:p-10 flex flex-col gap-6">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/25">03</p>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mb-1">Response</h3>
              <p className="text-xs font-light text-black/40">We reply, always.</p>
            </div>
            <ul className="mt-auto pt-6 border-t border-black/[0.07] space-y-3">
              {[["2 days", "general enquiries"], ["48 hrs", "project briefs"], ["Same day", "urgent work"]].map(([time, label]) => (
                <li key={label} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-black">{time}</span>
                  <span className="text-black/35">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          DARK FORM
      ───────────────────────────────────────────── */}
      <div className="ct-form-section bg-[#0a0a0a] text-white">
        <div className="_container py-20 md:py-32">

          {/* form header */}
          <div className="mb-14 md:mb-20">
            <p className="text-[10px] font-light uppercase tracking-[0.4em] opacity-30 mb-5">
              send us a message
            </p>
            <h2
              className="font-heading font-black uppercase text-white"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", lineHeight: 0.9 }}
            >
              tell us about
              <br />
              <span className="font-light text-white/20" style={{ letterSpacing: "0.03em" }}>
                your project
              </span>
            </h2>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col divide-y divide-white/[0.07]">

              {/* Services */}
              <div className="ct-field py-10 md:py-12">
                <p className="text-[10px] font-light uppercase tracking-[0.35em] opacity-40 mb-7">
                  Which services are you looking for?
                </p>
                <div className="flex flex-wrap gap-3">
                  {SERVICES.map((svc) => {
                    const active = selectedServices.includes(svc);
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`px-5 py-2.5 text-sm font-light border transition-all duration-250 cursor-pointer ${
                          active
                            ? "bg-accent border-accent text-white"
                            : "border-white/20 text-white/45 hover:text-white hover:border-white/50"
                        }`}
                      >
                        {svc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div className="ct-field py-8 md:py-10">
                <label htmlFor="ct-name" className="block text-[10px] font-light uppercase tracking-[0.35em] opacity-40 mb-5">
                  Your name <span className="text-accent">*</span>
                </label>
                <input
                  id="ct-name" name="name" type="text"
                  placeholder="John Doe"
                  required disabled={submitState === "loading"}
                  className="w-full bg-transparent border-b border-white/15 pb-4 text-xl md:text-2xl font-light text-white placeholder:text-white/20 outline-none focus:border-white/40 transition-colors caret-accent"
                />
              </div>

              {/* Email */}
              <div className="ct-field py-8 md:py-10">
                <label htmlFor="ct-email" className="block text-[10px] font-light uppercase tracking-[0.35em] opacity-40 mb-5">
                  Email address <span className="text-accent">*</span>
                </label>
                <input
                  id="ct-email" name="email" type="email"
                  placeholder="john@company.com"
                  required disabled={submitState === "loading"}
                  className="w-full bg-transparent border-b border-white/15 pb-4 text-xl md:text-2xl font-light text-white placeholder:text-white/20 outline-none focus:border-white/40 transition-colors caret-accent"
                />
              </div>

              {/* Company + Website — 2 col */}
              <div className="ct-field py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                <div>
                  <label htmlFor="ct-company" className="block text-[10px] font-light uppercase tracking-[0.35em] opacity-40 mb-5">
                    Company / Brand
                  </label>
                  <input
                    id="ct-company" name="company" type="text" placeholder="Optional"
                    disabled={submitState === "loading"}
                    className="w-full bg-transparent border-b border-white/15 pb-4 text-xl md:text-2xl font-light text-white placeholder:text-white/20 outline-none focus:border-white/40 transition-colors caret-accent"
                  />
                </div>
                <div>
                  <label htmlFor="ct-website" className="block text-[10px] font-light uppercase tracking-[0.35em] opacity-40 mb-5">
                    Current Website
                  </label>
                  <input
                    id="ct-website" name="website" type="url" placeholder="https://example.com"
                    disabled={submitState === "loading"}
                    className="w-full bg-transparent border-b border-white/15 pb-4 text-xl md:text-2xl font-light text-white placeholder:text-white/20 outline-none focus:border-white/40 transition-colors caret-accent"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="ct-field py-8 md:py-10">
                <label htmlFor="ct-message" className="block text-[10px] font-light uppercase tracking-[0.35em] opacity-40 mb-5">
                  Your message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="ct-message" name="message" rows={4}
                  placeholder="Goals, timeline, references, budget..."
                  required disabled={submitState === "loading"}
                  className="w-full bg-transparent border-b border-white/15 pb-4 text-xl md:text-2xl font-light text-white placeholder:text-white/20 outline-none focus:border-white/40 transition-colors resize-none caret-accent leading-relaxed"
                />
              </div>

              {/* Feedback */}
              {submitState === "error" && feedback && (
                <div className="ct-field py-6 flex gap-3 items-start">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm text-red-400">{feedback}</p>
                </div>
              )}
              {submitState === "sent" && feedback && (
                <div className="ct-field py-6 flex gap-3 items-start">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <p className="text-sm text-emerald-400">{feedback}</p>
                </div>
              )}

              {/* Submit */}
              <div className="ct-field pt-10 md:pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <p className="text-xs text-white/25 font-light max-w-xs leading-relaxed">
                  We respond within 2 business days.{" "}
                  <a href="mailto:hello@wincore.media"
                    className="text-white/40 underline underline-offset-4 hover:text-white/70 transition-colors">
                    Direct email
                  </a>
                </p>

                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="group inline-flex items-center gap-3 disabled:opacity-40 cursor-pointer"
                >
                  <span className="relative">
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                    <span className="text-lg md:text-xl font-black uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover:text-accent">
                      {submitState === "loading" ? (
                        <span className="flex items-center gap-2.5">
                          {[0, 120, 240].map((d) => (
                            <span key={d} className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                          Sending
                        </span>
                      ) : "Submit enquiry"}
                    </span>
                  </span>
                  {submitState !== "loading" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="text-white transition-all duration-400 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent">
                      <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                    </svg>
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          BOTTOM NAV
      ───────────────────────────────────────────── */}
      <nav className="_container flex flex-col sm:flex-row items-center justify-between gap-5 py-10 border-t border-black/[0.07]">
        <div className="flex flex-wrap justify-center sm:justify-start gap-8">
          {([["/", "Home"], ["/works", "Works"], ["/services", "Services"], ["/about", "About"]] as [string, string][]).map(([href, label]) => (
            <Link key={href} href={href}
              className="text-[10px] font-black uppercase tracking-[0.45em] text-black/25 hover:text-black transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-black/25">
          © {new Date().getFullYear()} Wincore Media
        </p>
      </nav>
    </section>
  );
}
