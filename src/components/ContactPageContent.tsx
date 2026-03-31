"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Send } from "lucide-react";
import { prefersReducedMotion, registerGsapPlugins, scheduleScrollTriggerRefresh } from "@/lib/motion";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

type SubmitState = "idle" | "loading" | "sent" | "error";

const SERVICES = [
  "Design & Branding",
  "Digital Products",
  "Creative Development",
  "AI Architecture",
  "Content & Strategy",
] as const;

const inputLine =
  "min-h-[3.25rem] w-full border-0 border-b-2 border-black/12 bg-transparent px-0 py-4 text-xl leading-snug text-foreground outline-none transition-[border-color] placeholder:text-foreground/30 focus:border-accent focus:ring-0 md:min-h-[3.5rem] md:py-5 md:text-2xl lg:text-[1.65rem]";

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

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const els = [".ct-h1", ".ct-lead", ".ct-aside"];
    if (reduced) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(els, { opacity: 0, y: 20 });
  }, []);

  useEffect(() => {
    registerGsapPlugins();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".ct-h1", { opacity: 1, y: 0, duration: 0.75 }, 0)
        .to(".ct-lead", { opacity: 1, y: 0, duration: 0.65 }, 0.12)
        .to(".ct-aside", { opacity: 1, y: 0, duration: 0.55 }, 0.2);
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
      className="relative overflow-x-clip bg-[#fafafa] pb-32 pt-12 text-base md:pb-40 md:pt-16 lg:pb-48"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--accent)_4%,transparent)_45%,transparent_100%)] opacity-60" aria-hidden />

      <div className="_container relative z-10 max-w-[1240px]">
        {/* Hero — asymmetric, editorial */}
        <div className="mb-16 grid gap-10 md:mb-24 md:gap-14 lg:mb-32 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <p className="ct-h1 mb-5 font-mono text-sm font-medium uppercase tracking-[0.28em] text-foreground/45 md:mb-6 md:text-base">
              Contact
            </p>
            <h1 className="ct-h1 font-heading text-[clamp(2.75rem,8vw,5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-foreground">
              Start a project.
            </h1>
            <p className="ct-lead mt-8 max-w-[48ch] text-lg leading-relaxed text-foreground/50 md:mt-10 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-relaxed">
              Tell us what you&apos;re building. We respond with scope, timeline, and a clear next step—no
              pitch deck required.
            </p>
          </div>
          <aside className="ct-aside hidden lg:flex lg:flex-col lg:items-end lg:gap-7 lg:pb-1 lg:text-right">
            <a
              href="mailto:hello@wincore.media"
              className="font-mono text-base font-medium tracking-tight text-accent underline decoration-accent/30 underline-offset-[5px] transition-colors hover:decoration-accent md:text-lg"
            >
              hello@wincore.media
            </a>
            <p className="max-w-[18ch] font-mono text-sm leading-relaxed tracking-wide text-foreground/40 md:text-base">
              Colombo — remote worldwide
            </p>
            <a
              href="https://cal.com/wincore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-mono text-base font-medium text-foreground transition-colors hover:text-accent md:text-lg"
            >
              Book 30 min
              <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
            </a>
          </aside>
        </div>

        <div className="grid gap-14 lg:grid-cols-[minmax(200px,260px)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          {/* Left rail — mobile contact + desktop label */}
          <div className="ct-aside flex flex-col gap-10 lg:gap-12">
            <div className="space-y-5 lg:sticky lg:top-36">
              <p className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-foreground/40 md:text-base">
                Direct
              </p>
              <div className="flex flex-col gap-7 font-mono text-base text-foreground/85 md:text-lg lg:hidden">
                <a href="mailto:hello@wincore.media" className="break-all text-accent hover:underline">
                  hello@wincore.media
                </a>
                <span className="leading-relaxed text-foreground/50">Colombo · Remote worldwide</span>
                <a
                  href="https://cal.com/wincore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-foreground"
                >
                  Book 30 min
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                </a>
              </div>
              <p className="hidden max-w-[16rem] font-mono text-sm leading-relaxed tracking-wide text-foreground/45 md:text-base lg:block">
                Prefer email. We read everything and reply within two working days.
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-16 md:gap-[4.5rem]">
              <div data-reveal className="space-y-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <label className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base">
                    Focus
                  </label>
                  <span className="font-mono text-sm text-foreground/40 md:text-base">Tap to toggle</span>
                </div>
                <div className="flex flex-wrap gap-x-1.5 gap-y-3 leading-snug">
                  {SERVICES.map((svc, i) => {
                    const active = selectedServices.includes(svc);
                    return (
                      <span key={svc} className="inline-flex items-center">
                        {i > 0 ? (
                          <span className="mr-1.5 font-mono text-lg text-foreground/20 select-none md:text-xl" aria-hidden>
                            ·
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggleService(svc)}
                          className={`rounded-full px-0 py-2 text-left font-mono text-base transition-colors md:text-lg lg:text-xl ${
                            active
                              ? "font-semibold text-accent"
                              : "text-foreground/45 hover:text-foreground/75"
                          }`}
                        >
                          {svc}
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div data-reveal className="space-y-12 md:space-y-14">
                <div className="ct-field space-y-3">
                  <label htmlFor="ct-name" className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base">
                    Name
                  </label>
                  <input
                    id="ct-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={inputLine}
                    placeholder="Jane Doe"
                    aria-label="Name"
                  />
                </div>

                <div className="ct-field space-y-3">
                  <label htmlFor="ct-email" className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base">
                    Email
                  </label>
                  <input
                    id="ct-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={inputLine}
                    placeholder="you@studio.com"
                    aria-label="Email"
                  />
                </div>

                <div className="ct-field space-y-3">
                  <label htmlFor="ct-message" className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base">
                    Message
                  </label>
                  <textarea
                    id="ct-message"
                    name="message"
                    required
                    rows={6}
                    className={`${inputLine} min-h-[12rem] resize-y leading-[1.65]`}
                    placeholder="Timeline, budget range, links…"
                    aria-label="Message"
                  />
                </div>
              </div>

              <div data-reveal className="flex flex-col gap-8 border-t border-black/[0.08] pt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-12 md:pt-14">
                <p className="max-w-md font-mono text-base leading-relaxed text-foreground/45 md:text-lg">
                  We usually reply within two business days.
                </p>
                <ButtonPrimary
                  type="submit"
                  disabled={submitState === "loading"}
                  className="min-h-[3.25rem] rounded-none bg-foreground px-12 py-4 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-foreground/90 disabled:opacity-50 md:min-h-[3.5rem] md:px-14 md:text-base md:tracking-[0.2em] sm:min-w-[220px]"
                >
                  {submitState === "loading" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send
                      <Send size={20} />
                    </>
                  )}
                </ButtonPrimary>
              </div>

              {feedback ? (
                <p role="status" aria-live="polite" className="font-mono text-base text-foreground/55 md:text-lg">
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
