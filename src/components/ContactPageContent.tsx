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

/** Scales up through md → xl → 2xl (no smaller text on lg than md). */
const inputLine =
  "min-h-[3.25rem] w-full border-0 border-b-2 border-black/12 bg-transparent px-0 py-4 text-xl leading-snug text-foreground outline-none transition-[border-color] placeholder:text-foreground/30 focus:border-accent focus:ring-0 sm:min-h-[3.35rem] md:min-h-[3.5rem] md:py-5 md:text-2xl lg:text-2xl lg:py-[1.35rem] xl:text-[1.75rem] xl:py-6 2xl:min-h-[3.75rem] 2xl:text-3xl 2xl:py-[1.5rem]";

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
      className="relative overflow-x-clip bg-[#fafafa] pb-32 pt-12 text-base sm:pt-14 md:pb-40 md:pt-16 lg:pb-48 xl:pb-52 xl:pt-20 2xl:pb-60 2xl:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--accent)_4%,transparent)_45%,transparent_100%)] opacity-60" aria-hidden />

      <div className="_container relative z-10 w-full max-w-[min(100%,90rem)] 2xl:max-w-[min(100%,96rem)]">
        {/* Hero — asymmetric, editorial */}
        <div className="mb-16 grid gap-10 md:mb-24 md:gap-14 lg:mb-32 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 xl:gap-20 2xl:gap-28">
          <div>
            <p className="ct-h1 mb-5 font-mono text-sm font-medium uppercase tracking-[0.28em] text-foreground/45 sm:text-[0.9375rem] md:mb-6 md:text-base xl:text-lg">
              Contact
            </p>
            <h1 className="ct-h1 font-heading text-[clamp(2.75rem,7vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-foreground xl:text-[clamp(3.25rem,6vw,5.25rem)] 2xl:text-[clamp(3.75rem,5.5vw,6rem)]">
              Start a project.
            </h1>
            <p className="ct-lead mt-8 max-w-[48ch] text-lg leading-relaxed text-foreground/50 sm:max-w-[52ch] md:mt-10 md:text-xl md:leading-relaxed lg:max-w-[54ch] lg:text-2xl xl:mt-12 xl:max-w-[56ch] xl:text-[1.35rem] xl:leading-relaxed 2xl:text-3xl 2xl:leading-relaxed">
              Tell us what you&apos;re building. We respond with scope, timeline, and a clear next step—no
              pitch deck required.
            </p>
          </div>
          <aside className="ct-aside hidden lg:flex lg:min-w-[min(100%,16rem)] lg:flex-col lg:items-end lg:gap-7 lg:pb-1 lg:text-right xl:min-w-[18rem] xl:gap-8 2xl:min-w-[20rem]">
            <a
              href="mailto:hello@wincore.media"
              className="font-mono text-base font-medium tracking-tight text-accent underline decoration-accent/30 underline-offset-[5px] transition-colors hover:decoration-accent md:text-lg xl:text-xl 2xl:text-2xl"
            >
              hello@wincore.media
            </a>
            <p className="max-w-[20ch] font-mono text-sm leading-relaxed tracking-wide text-foreground/40 md:text-base xl:text-lg 2xl:max-w-[22ch]">
              Colombo — remote worldwide
            </p>
            <a
              href="https://cal.com/wincore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-mono text-base font-medium text-foreground transition-colors hover:text-accent md:text-lg xl:text-xl 2xl:text-2xl"
            >
              Book 30 min
              <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8" strokeWidth={2} />
            </a>
          </aside>
        </div>

        <div className="grid gap-14 sm:gap-16 lg:grid-cols-[minmax(11rem,18rem)_minmax(0,1fr)] lg:gap-16 lg:gap-y-0 xl:grid-cols-[minmax(13rem,20rem)_minmax(0,1fr)] xl:gap-20 2xl:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)] 2xl:gap-28">
          {/* Left rail — mobile contact + desktop label */}
          <div className="ct-aside flex flex-col gap-10 lg:gap-12">
            <div className="space-y-5 lg:sticky lg:top-[clamp(7rem,12vw,11rem)] xl:top-40 2xl:top-44">
              <p className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-foreground/40 md:text-base xl:text-lg">
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
              <p className="hidden max-w-[18rem] font-mono text-sm leading-relaxed tracking-wide text-foreground/45 md:text-base lg:block xl:max-w-[22rem] xl:text-lg 2xl:text-xl">
                Prefer email. We read everything and reply within two working days.
              </p>
            </div>
          </div>

          <div className="min-w-0 2xl:max-w-[min(72ch,100%)]">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="flex w-full flex-col gap-16 md:gap-[4.5rem] xl:gap-20 2xl:gap-24"
            >
              <div data-reveal className="space-y-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <label className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base xl:text-lg">
                    Focus
                  </label>
                  <span className="font-mono text-sm text-foreground/40 md:text-base xl:text-lg">
                    Tap to toggle
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-1.5 gap-y-3 leading-snug xl:gap-x-2 xl:gap-y-4 2xl:gap-y-5">
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
                          className={`rounded-full px-0 py-2 text-left font-mono text-base transition-colors md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ${
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

              <div data-reveal className="space-y-12 md:space-y-14 xl:space-y-16">
                <div className="ct-field space-y-3 xl:space-y-4">
                  <label
                    htmlFor="ct-name"
                    className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base xl:text-lg 2xl:text-xl"
                  >
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

                <div className="ct-field space-y-3 xl:space-y-4">
                  <label
                    htmlFor="ct-email"
                    className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base xl:text-lg 2xl:text-xl"
                  >
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

                <div className="ct-field space-y-3 xl:space-y-4">
                  <label
                    htmlFor="ct-message"
                    className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/45 md:text-base xl:text-lg 2xl:text-xl"
                  >
                    Message
                  </label>
                  <textarea
                    id="ct-message"
                    name="message"
                    required
                    rows={6}
                    className={`${inputLine} min-h-[12rem] resize-y leading-[1.65] xl:min-h-[14rem] 2xl:min-h-[16rem]`}
                    placeholder="Timeline, budget range, links…"
                    aria-label="Message"
                  />
                </div>
              </div>

              <div data-reveal className="flex flex-col gap-8 border-t border-black/[0.08] pt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-12 md:pt-14 xl:gap-16 xl:pt-16">
                <p className="max-w-md font-mono text-base leading-relaxed text-foreground/45 md:max-w-lg md:text-lg xl:max-w-xl xl:text-xl 2xl:text-2xl">
                  We usually reply within two business days.
                </p>
                <ButtonPrimary
                  type="submit"
                  disabled={submitState === "loading"}
                  className="min-h-[3.25rem] rounded-none bg-foreground px-12 py-4 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-foreground/90 disabled:opacity-50 sm:min-w-[220px] md:min-h-[3.5rem] md:px-14 md:text-base md:tracking-[0.2em] xl:min-h-[3.75rem] xl:px-16 xl:text-lg 2xl:min-h-[4rem] 2xl:px-20 2xl:text-xl"
                >
                  {submitState === "loading" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send
                      <Send className="h-5 w-5 shrink-0 xl:h-6 xl:w-6" strokeWidth={2} />
                    </>
                  )}
                </ButtonPrimary>
              </div>

              {feedback ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="font-mono text-base text-foreground/55 md:text-lg xl:text-xl"
                >
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
