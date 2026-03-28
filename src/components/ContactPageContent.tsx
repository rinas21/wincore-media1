"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Send, Sparkles } from "lucide-react";
import { prefersReducedMotion, registerGsapPlugins, scheduleScrollTriggerRefresh } from "@/lib/motion";

type SubmitState = "idle" | "loading" | "sent" | "error";

const SERVICES = [
  "Design & Branding",
  "Digital Products",
  "Creative Development",
  "AI Architecture",
  "Content & Strategy",
];

/** Input / chip fill — explicit hex so layout never depends on theme merge quirks */
const fieldBg = "bg-[#f4f4f5]";

/** Readable gaps between words + lines (body copy) */
const wordEase =
  "[word-spacing:0.06em] [overflow-wrap:break-word] [word-break:normal] leading-[1.75]";

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
        <div className="mb-8 md:mb-10">
          <div
            className="ct-line h-0.5 w-20 rounded-full bg-accent md:w-28"
            style={{ transformOrigin: "left center" }}
          />
        </div>

        <div className="mb-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 md:mb-12 md:p-10 lg:rounded-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-accent leading-normal">
            Contact
          </p>
          <h1 className="font-heading max-w-3xl text-balance text-3xl font-black uppercase leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.1] lg:text-5xl [word-spacing:0.02em]">
            Let&apos;s build something
            <br className="sm:hidden" />{" "}
            <span>that performs.</span>
          </h1>
          <div className={`mt-5 max-w-xl space-y-3 text-base text-foreground/60 md:mt-6 md:text-lg ${wordEase}`}>
            <p>
              Share the brief: goals, timeline, and budget band.
            </p>
            <p>We&apos;ll reply with a clear scope and next steps.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <aside className="lg:col-span-4">
            <div className="space-y-8 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-foreground/45">
                  Email
                </p>
                <a
                  href="mailto:hello@wincore.media"
                  className="font-heading text-xl font-black tracking-tight text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline md:text-2xl"
                >
                  hello@wincore.media
                </a>
              </div>
              <div className="h-px bg-black/10" />
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-foreground/45">
                  Studio
                </p>
                <p className={`text-sm font-semibold text-foreground ${wordEase}`}>
                  Colombo · Remote worldwide
                </p>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-foreground/45">
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
              className="space-y-10 rounded-2xl border border-black/10 bg-white p-6 sm:p-8 md:space-y-12 md:p-10 lg:rounded-3xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles size={16} className="shrink-0" aria-hidden />
                  <span className="text-[10px] font-black uppercase tracking-[0.35em] [word-spacing:0.12em]">
                    Services (select any)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SERVICES.map((svc) => {
                    const active = selectedServices.includes(svc);
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`rounded-xl border px-4 py-3 text-left text-xs font-semibold uppercase leading-snug tracking-wide [word-spacing:0.05em] transition-colors ${
                          active
                            ? "border-accent bg-accent text-white shadow-sm"
                            : `border-black/10 ${fieldBg} text-foreground hover:border-accent/40`
                        }`}
                      >
                        {svc}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ct-field-wrap space-y-8 border-t border-black/10 pt-8 md:space-y-9 md:pt-10">
                <div className="ct-field">
                  <label
                    htmlFor="ct-name"
                    className="mb-2 block text-[10px] font-black uppercase tracking-[0.35em] text-foreground/45"
                  >
                    Name *
                  </label>
                  <input
                    id="ct-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={`w-full rounded-lg border border-black/10 ${fieldBg} px-3 py-3 text-base [word-spacing:0.04em] text-foreground outline-none ring-0 transition placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/20 md:text-lg`}
                    placeholder="Your name"
                  />
                </div>

                <div className="ct-field">
                  <label
                    htmlFor="ct-email"
                    className="mb-2 block text-[10px] font-black uppercase tracking-[0.35em] text-foreground/45"
                  >
                    Email *
                  </label>
                  <input
                    id="ct-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={`w-full rounded-lg border border-black/10 ${fieldBg} px-3 py-3 text-base [word-spacing:0.04em] text-foreground outline-none transition placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/20 md:text-lg`}
                    placeholder="you@company.com"
                  />
                </div>

                <div className="ct-field">
                  <label
                    htmlFor="ct-message"
                    className="mb-2 block text-[10px] font-black uppercase tracking-[0.35em] text-foreground/45"
                  >
                    Message *
                  </label>
                  <textarea
                    id="ct-message"
                    name="message"
                    required
                    rows={5}
                    className={`w-full resize-y rounded-lg border border-black/10 ${fieldBg} px-3 py-3 text-base leading-[1.75] [word-spacing:0.05em] text-foreground outline-none transition placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/20 md:text-lg`}
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-md shadow-accent/25 transition hover:opacity-95 disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
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
