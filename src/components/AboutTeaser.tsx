"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

const team = [
  {
    name: "Sanjaya",
    role: "Creative Director",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
  },
  {
    name: "Rina",
    role: "AI Lead",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
  },
  {
    name: "Devin",
    role: "Tech Head",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
  },
  {
    name: "Amali",
    role: "Brand Strategy",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
  },
];

const stats = [
  { value: 10, suffix: "+", label: "Years" },
  { value: 200, suffix: "+", label: "Campaigns" },
];

export default function AboutTeaser() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scroller = document.documentElement;
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      // ── Heading char reveal ──
      const headingEl = sectionRef.current?.querySelector(".abt-heading") as HTMLElement | null;
      if (headingEl) {
        const split = new SplitType(headingEl, { types: "chars" });
        splits.push(split);
        if (split.chars) {
          gsap.from(split.chars, {
            yPercent: 110,
            opacity: 0,
            duration: 1.1,
            stagger: 0.018,
            ease: "expo.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: headingEl,
              scroller,
              start: "top 85%",
              once: true,
            },
          });
        }
      }

      // ── Kicker ──
      gsap.from(".abt-kicker", {
        y: 20, opacity: 0, duration: 0.8, ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".abt-kicker", scroller, start: "top 90%", once: true },
      });

      // ── Lead paragraph ──
      gsap.from(".abt-lead", {
        y: 28, opacity: 0, filter: "blur(8px)", duration: 1, ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".abt-lead", scroller, start: "top 88%", once: true },
      });

      // ── Rule ──
      gsap.from(".abt-rule", {
        scaleX: 0, transformOrigin: "left", duration: 1.1, ease: "expo.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".abt-rule", scroller, start: "top 90%", once: true },
      });

      // ── Stat cards ──
      const statCards = gsap.utils.toArray<HTMLElement>(".abt-stat-card");
      statCards.forEach((card, i) => {
        gsap.from(card, {
          y: 40, opacity: 0, scale: 0.97, duration: 0.9, delay: i * 0.08, ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: card, scroller, start: "top 90%", once: true },
        });

        // Count-up
        const numEl = card.querySelector<HTMLElement>(".abt-counter");
        if (numEl) {
          const target = Number(numEl.dataset.target ?? 0);
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target, duration: 1.8, ease: "power2.out",
            immediateRender: false,
            scrollTrigger: { trigger: card, scroller, start: "top 85%", once: true },
            onUpdate() { numEl.textContent = Math.round(proxy.val).toString(); },
          });
        }
      });

      // ── Photo cards — each triggered independently ──
      const photoCards = gsap.utils.toArray<HTMLElement>(".abt-photo-card");
      photoCards.forEach((card, i) => {
        gsap.from(card, {
          y: 50, opacity: 0,
          clipPath: "inset(16% 0 0 0 round 1.25rem)",
          duration: 1.1, delay: i * 0.07, ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: card, scroller, start: "top 88%", once: true },
        });
      });

      // ── Gallery subtle parallax ──
      gsap.to("[data-about-shift]", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-chapter="custom"
      className="relative overflow-hidden border-t border-white/5 bg-background pb-[18vw] pt-[15vw]"
      aria-label="About"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div
        data-watermark
        className="pointer-events-none absolute left-[-8vw] top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[36vw] font-black uppercase italic text-white/[0.02]"
      >
        Studio
      </div>

      <div className="chapter-inner _container relative z-10">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="abt-kicker mb-8 text-[11px] font-black uppercase tracking-[0.48em] text-secondary">
              About
            </p>

            <h2 className="abt-heading mb-7 text-[11.5vw] font-black uppercase leading-[0.84] tracking-tighter md:text-[5.4vw]">
              Colombo-based.<br />
              <span className="text-white/20 italic">Globally delivered.</span>
            </h2>

            <p className="abt-lead max-w-[52ch] text-lg font-light leading-relaxed text-white/60 md:text-xl">
              10+ years turning numbers into stories. A tight team of strategists, designers,
              filmmakers, and builders creating high-end digital work with measurable outcomes.
            </p>

            <div className="abt-rule mt-7 h-px w-full max-w-md bg-gradient-to-r from-accent via-white/15 to-transparent" />

            <div className="abt-stats mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className="abt-stat-card rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-white/35">
                    {item.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="abt-counter text-5xl font-black leading-none md:text-6xl" data-target={item.value}>
                      0
                    </span>
                    <span className="text-3xl font-bold text-accent md:text-4xl">{item.suffix}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div data-about-shift className="abt-gallery grid grid-cols-2 gap-4 md:gap-5 lg:col-span-7">
            {team.map((member, index) => (
              <article
                key={member.name}
                className={`abt-photo-card group relative overflow-hidden border border-white/10 bg-muted/40 ${
                  index === 0
                    ? "col-span-2 h-[250px] rounded-[1.5rem] md:h-[300px]"
                    : "h-[215px] rounded-[1.3rem] md:h-[250px]"
                }`}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale transition-all duration-[1200ms] group-hover:scale-[1.06] group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 600px"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex translate-y-4 flex-col justify-end p-5 transition-transform duration-500 group-hover:translate-y-0 md:p-6">
                  <p className="text-lg font-bold text-white md:text-xl">{member.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.36em] text-accent opacity-0 transition-opacity delay-100 group-hover:opacity-100">
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
