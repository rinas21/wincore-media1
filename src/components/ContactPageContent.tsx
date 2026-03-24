"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Sparkles,
  AlertCircle,
} from "lucide-react";
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
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-LK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Colombo",
        }).format(new Date()),
      );
    };

    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export default function ContactPageContent() {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const colomboTime = useColomboTime();

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    let split: SplitType | null = null;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          [
            ".contact-kicker",
            ".contact-title",
            ".contact-lead",
            ".contact-meta-item",
            ".contact-card",
            ".contact-form-wrap",
            ".contact-footer",
          ],
          { autoAlpha: 1, y: 0 },
        );
        return;
      }

      gsap.set(
        [
          ".contact-kicker",
          ".contact-title",
          ".contact-lead",
          ".contact-meta-item",
          ".contact-card",
          ".contact-form-wrap",
          ".contact-footer",
        ],
        { autoAlpha: 0, y: 24 },
      );

      const title = rootRef.current?.querySelector(".contact-title");
      if (title) {
        split = new SplitType(title as HTMLElement, { types: "words,chars" });
        if (split.words) {
          gsap.set(split.words, { overflow: "visible" });
        }
        gsap.set(split.chars, {
          yPercent: 110,
          opacity: 0,
          display: "inline-block",
          willChange: "transform,opacity",
        });
      }

      const introTl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.08 });

      introTl
        .to(".contact-kicker", { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
        .to(
          split?.chars ?? ".contact-title",
          split?.chars
            ? {
                yPercent: 0,
                opacity: 1,
                duration: 0.95,
                stagger: 0.012,
                ease: "power4.out",
              }
            : { autoAlpha: 1, y: 0, duration: 0.85 },
          0.05,
        )
        .to(".contact-lead", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.3)
        .to(
          ".contact-meta-item",
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.42,
        );

      gsap.to(".contact-card", {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-cards-wrap",
          scroller,
          start: "top 84%",
          once: true,
        },
      });

      gsap.to(".contact-form-wrap", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-form-wrap",
          scroller,
          start: "top 86%",
          once: true,
        },
      });

      gsap.fromTo(
        ".contact-form-field",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-form-wrap",
            scroller,
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.to(".contact-footer", {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-footer",
          scroller,
          start: "top 92%",
          once: true,
        },
      });
    }, rootRef);

    scheduleScrollTriggerRefresh();

    return () => {
      if (split) split.revert();
      ctx.revert();
    };
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const type = String(fd.get("type") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitState("error");
      setFeedback("Please complete all required fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setSubmitState("error");
      setFeedback("Please enter a valid email address.");
      return;
    }

    setSubmitState("loading");
    setFeedback("");

    window.setTimeout(() => {
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : "",
        type ? `Project type: ${type}` : "",
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");

      const subject = encodeURIComponent(`Project inquiry from ${name}`);
      const mailto = `mailto:hello@wincore.media?subject=${subject}&body=${encodeURIComponent(body)}`;

      setSubmitState("sent");
      setFeedback("Opening your email app now. If it does not open, send directly to hello@wincore.media.");

      gsap.fromTo(
        ".contact-status-icon",
        { scale: 0.45, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" },
      );

      if (formRef.current) {
        formRef.current.reset();
      }

      window.location.href = mailto;
    }, 420);
  }

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-background pb-24 pt-12 md:pb-32 md:pt-16"
      aria-label="Contact"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[360px] w-[min(95vw,980px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(0,136,204,0.18),transparent_62%)]" />
        <div className="absolute -left-28 top-1/3 h-64 w-64 rounded-full bg-secondary/[0.10] blur-[110px]" />
        <div className="absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-accent/[0.12] blur-[95px]" />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "58px 58px",
            maskImage: "radial-gradient(ellipse 80% 65% at 50% 18%, black 24%, transparent 72%)",
          }}
        />
      </div>

      <div className="_container relative z-10">
        <header className="mb-14 overflow-visible md:mb-16">
          <p className="contact-kicker mb-5 opacity-0 text-[10px] font-black uppercase tracking-[0.52em] text-accent">
            Contact
          </p>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="overflow-visible lg:col-span-8">
              <h1 className="contact-title min-h-[2.15em] overflow-visible py-2 opacity-0 font-heading text-[14vw] font-black uppercase leading-[0.96] tracking-[-0.02em] text-foreground sm:text-[11vw] md:text-[8.4vw] lg:text-[6.2vw]">
                <span className="block">Tell us what</span>
                <span className="mt-2 block text-secondary/90 italic">you&apos;re building</span>
              </h1>
            </div>

            <div className="lg:col-span-4">
              <p className="contact-lead opacity-0 text-sm leading-relaxed text-foreground/60 md:text-base">
                New brand, campaign, site, or WebGL build. Share your goals and we will reply within
                two business days.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div
                  className="contact-meta-item contact-fx-box isolate overflow-visible opacity-0"
                  style={{ ["--card-grad" as string]: "linear-gradient(315deg, rgba(0,136,204,0.92), rgba(0,208,255,0.8))" }}
                >
                  <span className="contact-fx-glow" aria-hidden />
                  <div className="contact-fx-content p-5">
                    <p className="text-[9px] font-black uppercase leading-[1.45] tracking-[0.3em] text-white/75">Response</p>
                    <p className="mt-1 text-sm font-semibold text-white">Within two business days</p>
                  </div>
                </div>
                <div
                  className="contact-meta-item contact-fx-box isolate overflow-visible opacity-0"
                  style={{ ["--card-grad" as string]: "linear-gradient(315deg, rgba(35,35,35,0.86), rgba(90,90,90,0.72))" }}
                >
                  <span className="contact-fx-glow" aria-hidden />
                  <div className="contact-fx-content p-5">
                    <p className="text-[9px] font-black uppercase leading-[1.45] tracking-[0.3em] text-white/75">Focus</p>
                    <p className="mt-1 text-sm font-semibold text-white">Branding, Web, Motion, WebGL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10">
          <aside className="contact-cards-wrap flex flex-col gap-4 lg:col-span-4">
            <a
              href="mailto:hello@wincore.media"
              className="contact-card contact-fx-box group isolate overflow-visible opacity-0"
              style={{ ["--card-grad" as string]: "linear-gradient(315deg, rgba(255,188,0,0.95), rgba(255,0,88,0.85))" }}
            >
              <span className="contact-fx-glow" aria-hidden />
              <div className="contact-fx-content p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                    <Mail size={18} />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-[9px] font-black uppercase leading-[1.45] tracking-[0.35em] text-white/75">Email</p>
                <p className="mt-1 text-base font-semibold text-white">hello@wincore.media</p>
              </div>
            </a>

            <div
              className="contact-card contact-fx-box isolate overflow-visible opacity-0"
              style={{ ["--card-grad" as string]: "linear-gradient(315deg, rgba(3,169,244,0.9), rgba(255,0,88,0.82))" }}
            >
              <span className="contact-fx-glow" aria-hidden />
              <div className="contact-fx-content p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                    <MapPin size={18} />
                  </span>
                  <Sparkles className="h-4 w-4 text-white/80" />
                </div>
                <p className="text-[9px] font-black uppercase leading-[1.45] tracking-[0.35em] text-white/75">Studio</p>
                <p className="mt-1 text-sm leading-relaxed text-white">
                  Colombo, Sri Lanka, collaborating with teams globally.
                </p>
              </div>
            </div>

            <div
              className="contact-card contact-fx-box isolate overflow-visible opacity-0"
              style={{ ["--card-grad" as string]: "linear-gradient(315deg, rgba(77,255,3,0.85), rgba(0,208,255,0.88))" }}
            >
              <span className="contact-fx-glow" aria-hidden />
              <div className="contact-fx-content p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                    <Clock3 size={18} />
                  </span>
                  <span className="text-[10px] font-black uppercase leading-[1.35] tracking-[0.25em] text-white/75">Live</span>
                </div>
                <p className="text-[9px] font-black uppercase leading-[1.45] tracking-[0.35em] text-white/75">Local time</p>
                <p suppressHydrationWarning className="mt-1 font-mono text-xl font-semibold tabular-nums text-white">
                  {colomboTime || "00:00:00"}
                </p>
                <p className="mt-1 text-[11px] text-white/80">Asia/Colombo (GMT+5:30)</p>
              </div>
            </div>
          </aside>

          <div className="contact-form-wrap relative z-20 opacity-0 lg:col-span-8">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-fx-form relative isolate overflow-visible rounded-[2rem] bg-white/10 px-8 py-9 backdrop-blur-xl md:px-11 md:py-11"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]" />

              <div className="relative z-10 mb-8 flex flex-col gap-2 pb-6 md:flex-row md:items-end md:justify-between">
                <h2 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                  Project details
                </h2>
                <p className="text-[10px] font-black uppercase leading-[1.35] tracking-[0.32em] text-white/75">
                  Tell us enough to scope quickly
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <label className="contact-form-field contact-input-card flex flex-col gap-2.5">
                  <span className="text-[10px] font-black uppercase leading-[1.35] tracking-[0.25em] text-white/75">Name *</span>
                  <input
                    name="name"
                    type="text"
                    required
                    disabled={submitState === "loading"}
                    autoComplete="name"
                    placeholder="Your name"
                    className="rounded-2xl bg-white/85 px-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:ring-2 focus:ring-white/35 disabled:cursor-not-allowed disabled:opacity-65"
                  />
                </label>

                <label className="contact-form-field contact-input-card flex flex-col gap-2.5">
                  <span className="text-[10px] font-black uppercase leading-[1.35] tracking-[0.25em] text-white/75">Work email *</span>
                  <input
                    name="email"
                    type="email"
                    required
                    disabled={submitState === "loading"}
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="rounded-2xl bg-white/85 px-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:ring-2 focus:ring-white/35 disabled:cursor-not-allowed disabled:opacity-65"
                  />
                </label>

                <label className="contact-form-field contact-input-card flex flex-col gap-2.5 md:col-span-2">
                  <span className="text-[10px] font-black uppercase leading-[1.35] tracking-[0.25em] text-white/75">Company / brand</span>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    disabled={submitState === "loading"}
                    placeholder="Optional"
                    className="rounded-2xl bg-white/85 px-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:ring-2 focus:ring-white/35 disabled:cursor-not-allowed disabled:opacity-65"
                  />
                </label>

                <label className="contact-form-field contact-input-card flex flex-col gap-2.5 md:col-span-2">
                  <span className="text-[10px] font-black uppercase leading-[1.35] tracking-[0.25em] text-white/75">Project type</span>
                  <select
                    name="type"
                    defaultValue=""
                    disabled={submitState === "loading"}
                    className="cursor-pointer rounded-2xl bg-white/85 px-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:ring-2 focus:ring-white/35 disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Branding & identity">Branding & identity</option>
                    <option value="Website / product">Website / product</option>
                    <option value="Motion / video">Motion / video</option>
                    <option value="WebGL / immersive">WebGL / immersive</option>
                    <option value="Performance marketing">Performance marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="contact-form-field contact-input-card flex flex-col gap-2.5 md:col-span-2">
                  <span className="text-[10px] font-black uppercase leading-[1.35] tracking-[0.25em] text-white/75">Message *</span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    disabled={submitState === "loading"}
                    placeholder="Goals, timeline, budget range, and links to references..."
                    className="resize-y rounded-2xl bg-white/85 px-4 py-3.5 text-sm font-medium leading-relaxed text-foreground outline-none transition-all focus:ring-2 focus:ring-white/35 disabled:cursor-not-allowed disabled:opacity-65"
                  />
                </label>
              </div>

              {submitState === "error" && feedback && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-red-500/20 px-4 py-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                  <p className="text-sm text-white">{feedback}</p>
                </div>
              )}

              {submitState === "sent" && feedback && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-white/20 px-4 py-3">
                  <CheckCircle2 className="contact-status-icon h-5 w-5 shrink-0 text-white" />
                  <p className="text-sm text-white">{feedback}</p>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-relaxed text-white/80">
                  Prefer a call? Mention that in your note and we will line it up.
                </p>

                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-[10px] font-black uppercase leading-[1.2] tracking-[0.32em] text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_12px_28px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitState === "loading" ? (
                    <>
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: "120ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: "240ms" }} />
                      </span>
                      Sending
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <ArrowUpRight size={15} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <nav
          className="contact-footer mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-9 opacity-0 md:justify-between"
          aria-label="Footer"
        >
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 md:justify-start">
            {NAV_LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-[9px] font-black uppercase tracking-[0.34em] text-foreground/45 transition-colors hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </div>

          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/35">
            © {new Date().getFullYear()} Wincore Media
          </p>
        </nav>
      </div>
    </section>
  );
}
