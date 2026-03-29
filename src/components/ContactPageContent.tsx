"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Send, Sparkles, Palette, HardDrive, Cpu, Lightbulb, PenTool, Check } from "lucide-react";
import { prefersReducedMotion, registerGsapPlugins, scheduleScrollTriggerRefresh, getScroller } from "@/lib/motion";

type SubmitState = "idle" | "loading" | "sent" | "error";

const SERVICES: { label: string; icon: any }[] = [
  { label: "Design & Branding", icon: Palette },
  { label: "Digital Products", icon: PenTool },
  { label: "Creative Development", icon: HardDrive },
  { label: "AI Architecture", icon: Cpu },
  { label: "Content & Strategy", icon: Lightbulb },
];

/** Input / chip fill — explicit hex so layout never depends on theme merge quirks */
const fieldBg = "bg-[#f4f4f5]";

/** Readable gaps between words + lines (body copy) */
const wordEase =
  "[word-spacing:0.06em] [overflow-wrap:break-word] [word-break:normal] leading-[1.85]";

export default function ContactPageContent() {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  function toggleService(svc: string) {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc],
    );
  }

  useEffect(() => {
    registerGsapPlugins();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          ".ct-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "expo.out", delay: 0.1 },
        );

        // Intro Card fade-up
        gsap.fromTo(
          ".ct-intro-card",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", delay: 0.2 }
        );

        // Sidebar staggered reveal
        gsap.fromTo(
          ".ct-side-item",
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.5,
          }
        );

        // Form Fields staggered reveal
        gsap.fromTo(
          ".ct-field",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".ct-field-wrap",
              scroller: getScroller(),
              start: "top 90%",
            },
          }
        );

        // Staggered service chips reveal
        gsap.fromTo(
          ".ct-chip",
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".ct-chip-grid",
              scroller: getScroller(),
              start: "top 95%",
            },
          }
        );
      }
    }, rootRef);

    scheduleScrollTriggerRefresh();
    return () => ctx.revert();
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitState("error");
      setFeedback("Please fill in all fields.");
      return;
    }

    setSubmitState("loading");
    setFeedback("Opening mail…");

    setTimeout(() => {
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Interest: ${selectedServices.join(", ") || "General Inquiry"}`,
        `Message:`,
        message,
      ].join("\n");
      window.location.href = `mailto:hello@wincore.media?subject=Inquiry: ${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`;
      setSubmitState("sent");
      setFeedback("Check your email app.");
      formRef.current?.reset();
      setSelectedServices([]);
    }, 600);
  }

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-x-clip border-t border-black/10 bg-background pb-16 pt-6 md:pb-24 md:pt-8"
    >
      <div className="_container">
        <div className="mb-10">
          <div
            className="ct-line h-0.5 w-20 rounded-full bg-accent md:w-28"
            style={{ transformOrigin: "left center" }}
          />
        </div>

        <div className="ct-intro-card !mb-[150px] rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 md:p-10 lg:rounded-3xl">
          <p className="mb-4 text-[13px] font-black uppercase tracking-[0.55em] text-accent leading-normal">
            Contact
          </p>
          <h1 className="font-heading max-w-4xl text-balance text-4xl font-black uppercase leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl [word-spacing:0.04em]">
            Let&apos;s build something
            <br className="sm:hidden" />{" "}
            <span>that performs.</span>
          </h1>
          <div className={`mt-8 max-w-3xl space-y-5 text-lg text-foreground/60 md:mt-12 md:text-xl ${wordEase}`}>
            <p className="font-medium">
              Share the brief: goals, timeline, and budget band.
            </p>
            <p>We&apos;ll reply with a clear scope and next steps.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24 lg:items-start">
          <aside className="lg:col-span-4 translate-y-[3px]">
            <div className="space-y-10 rounded-2xl border border-black/10 bg-white p-6 md:p-9">
              <div className="ct-side-item">
                <p className="mb-4 text-[15px] font-black uppercase tracking-[0.45em] text-foreground/45">
                  Email
                </p>
                <a
                  href="mailto:hello@wincore.media"
                  className="font-heading text-xl font-black tracking-tight text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline md:text-2xl"
                >
                  hello@wincore.media
                </a>
              </div>
              <div className="ct-side-item h-px bg-black/10" />
              <div className="ct-side-item">
                <p className="mb-4 text-[15px] font-black uppercase tracking-[0.4em] text-foreground/45">
                  Studio
                </p>
                <p className={`text-lg font-bold text-foreground ${wordEase}`}>
                  Colombo · Remote worldwide
                </p>
              </div>
              <div className="ct-side-item">
                <p className="mb-4 text-[15px] font-black uppercase tracking-[0.4em] text-foreground/45">
                  Schedule
                </p>
                <a
                  href="https://cal.com/wincore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-accent transition-opacity hover:opacity-80"
                >
                  Book a call
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-8">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="space-y-16 rounded-2xl border border-black/10 bg-white p-6 sm:p-10 md:space-y-20 md:p-14 lg:rounded-3xl"
            >
              <div className="space-y-10">
                <div className="mb-10 flex items-center gap-3 text-accent/60">
                  <Sparkles size={18} className="shrink-0" aria-hidden />
                  <span className="text-[14px] font-[1000] uppercase tracking-[0.5em] [word-spacing:0.12em]">
                    Services <span className="text-foreground/30 font-bold lowercase tracking-normal">(Select any)</span>
                  </span>
                </div>
                <div className="ct-chip-grid grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SERVICES.map((svc) => {
                    const active = selectedServices.includes(svc.label);
                    return (
                      <button
                        key={svc.label}
                        type="button"
                        onClick={() => toggleService(svc.label)}
                        className={`ct-chip group relative flex items-center gap-4 overflow-hidden rounded-2xl border px-6 py-5 text-left transition-all duration-300 ${
                          active
                            ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                            : `border-black/[0.06] ${fieldBg} hover:border-accent/30 hover:bg-accent/[0.02]`
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                          active ? "bg-accent text-white scale-110" : "bg-black/[0.04] text-foreground/40 group-hover:bg-accent/10 group-hover:text-accent"
                        }`}>
                          {active ? <Check size={20} strokeWidth={3} /> : <svc.icon size={20} strokeWidth={1.5} />}
                        </div>
                        <span className={`text-[15px] font-bold uppercase tracking-widest transition-colors ${
                          active ? "text-foreground" : "text-foreground/50 group-hover:text-foreground"
                        }`}>
                          {svc.label}
                        </span>
                        {/* Interactive fill effect */}
                        {active && (
                          <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-accent/5 to-transparent animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ct-field-wrap mt-20 space-y-12 border-t border-black/10 pt-16 md:space-y-14 md:pt-20">
                <div className="ct-field">
                  <label
                    htmlFor="ct-name"
                    className="mb-3 block text-[13px] font-black uppercase tracking-[0.4em] text-foreground/45"
                  >
                    Name *
                  </label>
                  <input
                    id="ct-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={`m-[3px] w-full rounded-lg border border-black/10 ${fieldBg} px-4 py-4 text-[1.125rem] [word-spacing:0.04em] text-foreground outline-none ring-0 transition placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/20`}
                    placeholder="Your name"
                  />
                </div>

                <div className="ct-field">
                  <label
                    htmlFor="ct-email"
                    className="mb-3 block text-[13px] font-black uppercase tracking-[0.4em] text-foreground/45"
                  >
                    Email *
                  </label>
                  <input
                    id="ct-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={`m-[3px] w-full rounded-lg border border-black/10 ${fieldBg} px-4 py-4 text-[1.125rem] [word-spacing:0.04em] text-foreground outline-none transition placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/20`}
                    placeholder="you@company.com"
                  />
                </div>

                <div className="ct-field">
                  <label
                    htmlFor="ct-message"
                    className="mb-4 block text-[13px] font-black uppercase tracking-[0.45em] text-foreground/45"
                  >
                    Message *
                  </label>
                  <textarea
                    id="ct-message"
                    name="message"
                    required
                    rows={5}
                    className={`m-[3px] w-full resize-y rounded-lg border border-black/10 ${fieldBg} px-4 py-4 text-[1.125rem] leading-[1.75] [word-spacing:0.05em] text-foreground outline-none transition placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/20`}
                    placeholder="Project goals, timeline, budget…"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className={`max-w-sm text-xs text-foreground/50 ${wordEase}`}>
                  We usually reply within two business days.
                </p>
                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-[14px] font-[1000] uppercase tracking-[0.3em] text-white shadow-lg shadow-accent/25 transition-transform active:scale-95 hover:opacity-95 disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
                >
                  {submitState === "loading" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send message
                      <Send size={17} />
                    </>
                  )}
                </button>
              </div>

              {feedback ? (
                <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-accent sm:text-left">
                  {feedback}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
