"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

function useColomboTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-LK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Colombo",
        }).format(now),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function ContactPageContent() {
  const rootRef = useRef<HTMLElement>(null);
  const colomboTime = useColomboTime();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.05 });
      tl.from(".cp-eyebrow", { opacity: reduced ? 1 : 0, y: reduced ? 0 : 16, duration: reduced ? 0 : 0.65 }, 0)
        .from(".cp-title", { opacity: reduced ? 1 : 0, y: reduced ? 0 : 32, duration: reduced ? 0 : 0.85 }, 0.08)
        .from(".cp-lead", { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20, duration: reduced ? 0 : 0.7 }, 0.18)
        .from(".cp-card", { opacity: reduced ? 1 : 0, y: reduced ? 0 : 36, duration: reduced ? 0 : 0.75, stagger: 0.1 }, 0.22);

      gsap.from(".cp-form-field", {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 20,
        duration: reduced ? 0 : 0.55,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cp-form-shell",
          scroller,
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".cp-footer-row", {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 16,
        duration: reduced ? 0 : 0.6,
        scrollTrigger: {
          trigger: ".cp-footer-row",
          scroller,
          start: "top 94%",
          once: true,
        },
      });
    }, rootRef);

    scheduleScrollTriggerRefresh();

    return () => {
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

    const subject = encodeURIComponent(`Project inquiry from ${name || "website"}`);
    const mailto = `mailto:hello@wincore.media?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-white/5 bg-background pb-20 pt-10 md:pb-28 md:pt-12"
      aria-label="Contact"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[min(50vh,420px)] w-[min(100%,900px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(0,191,255,0.12),transparent_62%)]" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-secondary/[0.05] blur-[100px]" />
      </div>

      <div className="_container relative z-10">
        <header className="mb-12 max-w-3xl md:mb-16">
          <p className="cp-eyebrow mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-accent">
            Contact
          </p>
          <h1 className="cp-title font-heading text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.85rem]">
            Tell us what you&apos;re{" "}
            <span className="text-secondary italic">building</span>
          </h1>
          <p className="cp-lead mt-5 max-w-xl text-sm leading-relaxed text-white/45 md:text-base">
            New brand, campaign, site, or WebGL piece — share a few details and we&apos;ll reply within
            two business days.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Contact cards */}
          <aside className="flex flex-col gap-4 lg:col-span-4">
            <a
              href="mailto:hello@wincore.media"
              className="cp-card group flex items-start gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 transition-colors hover:border-accent/35 md:p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-accent">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/35">Email</p>
                <p className="mt-1 text-sm font-semibold text-white transition-colors group-hover:text-accent md:text-base">
                  hello@wincore.media
                </p>
              </div>
              <ArrowUpRight
                className="ml-auto h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-accent"
                aria-hidden
              />
            </a>

            <div className="cp-card flex items-start gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.02] p-5 md:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-secondary/90">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/35">Studio</p>
                <p className="mt-1 text-sm leading-snug text-white/65">
                  Colombo, Sri Lanka — working with teams globally.
                </p>
              </div>
            </div>

            <div className="cp-card flex items-start gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.02] p-5 md:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-accent/90">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/35">
                  Local time
                </p>
                <p className="mt-1 font-mono text-lg font-bold tabular-nums text-accent/85">
                  {colomboTime || "—"}
                </p>
                <p className="mt-1 text-[11px] text-white/30">Asia/Colombo (GMT+5:30)</p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="cp-form-shell lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.05] to-transparent p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:p-8 lg:p-10"
            >
              <div className="mb-8 flex flex-col gap-2 border-b border-white/[0.06] pb-6 md:flex-row md:items-end md:justify-between">
                <h2 className="text-lg font-black uppercase tracking-tight text-white md:text-xl">
                  Project details
                </h2>
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">
                  All fields help us scope faster
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="cp-form-field flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    Name *
                  </span>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="rounded-xl border border-white/[0.1] bg-[#0c0c0c] px-4 py-3 text-sm text-white outline-none ring-accent/0 transition-[border-color,box-shadow] placeholder:text-white/25 focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
                    placeholder="Your name"
                  />
                </label>
                <label className="cp-form-field flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    Work email *
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="rounded-xl border border-white/[0.1] bg-[#0c0c0c] px-4 py-3 text-sm text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/25 focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
                    placeholder="you@company.com"
                  />
                </label>
                <label className="cp-form-field flex flex-col gap-2 md:col-span-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    Company / brand
                  </span>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="rounded-xl border border-white/[0.1] bg-[#0c0c0c] px-4 py-3 text-sm text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/25 focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
                    placeholder="Optional"
                  />
                </label>
                <label className="cp-form-field flex flex-col gap-2 md:col-span-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    Project type
                  </span>
                  <select
                    name="type"
                    className="cursor-pointer rounded-xl border border-white/[0.1] bg-[#0c0c0c] px-4 py-3 text-sm text-white outline-none transition-[border-color,box-shadow] focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Branding & identity">Branding &amp; identity</option>
                    <option value="Website / product">Website / product</option>
                    <option value="Motion / video">Motion / video</option>
                    <option value="WebGL / immersive">WebGL / immersive</option>
                    <option value="Performance marketing">Performance marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="cp-form-field flex flex-col gap-2 md:col-span-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    Message *
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="resize-y rounded-xl border border-white/[0.1] bg-[#0c0c0c] px-4 py-3 text-sm leading-relaxed text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/25 focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
                    placeholder="Timeline, budget range, links to references…"
                  />
                </label>
              </div>

              {sent && (
                <p className="mt-4 text-sm text-accent/90" role="status">
                  Opening your email app — if nothing opens, write us at hello@wincore.media
                </p>
              )}

              <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-relaxed text-white/30">
                  Prefer a call? Mention it in your message and we&apos;ll schedule.
                </p>
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.35em] text-[#0A0A0A] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send via email
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <nav
          className="cp-footer-row mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/[0.06] pt-10 md:justify-between"
          aria-label="Footer"
        >
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 md:justify-start">
            {[
              ["/", "Home"],
              ["/works", "Works"],
              ["/services", "Services"],
              ["/about", "About"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-[9px] font-black uppercase tracking-[0.35em] text-white/35 transition-colors hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15">
            © {new Date().getFullYear()} Wincore Media
          </p>
        </nav>
      </div>
    </section>
  );
}
