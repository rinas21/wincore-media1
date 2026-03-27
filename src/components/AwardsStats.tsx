"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import SplitType from "split-type";
import { ArrowUpRight } from "lucide-react";
import {
  registerGsapPlugins,
  getScroller,
  scheduleScrollTriggerRefresh,
  prefersReducedMotion,
} from "@/lib/motion";

const stats = [
  {
    value: 200,
    suffix: "+",
    label: "Campaigns Delivered",
    desc: "Full-funnel campaigns across every vertical — built to perform and scale.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400",
  },
  {
    value: 95,
    suffix: "%",
    label: "Client Retention",
    desc: "Clients stay because trust is earned, not assumed.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1400",
  },
  {
    value: 10,
    suffix: "y",
    label: "Years in the Game",
    desc: "A decade of digital authority and measurable outcomes.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1400",
  },
  {
    value: 12,
    suffix: "+",
    label: "Awards Won",
    desc: "Local and international creative excellence recognised globally.",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=1400",
  },
];

export default function AwardsStats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      // Heading Entry animations
      const headingEl = sectionRef.current?.querySelector(".aw-heading") as HTMLElement | null;
      if (headingEl) {
        const split = new SplitType(headingEl, { types: "chars,words" });
        splits.push(split);
        if (split.chars) {
          gsap.fromTo(
            split.chars,
            { yPercent: reduced ? 0 : 100, opacity: reduced ? 1 : 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: reduced ? 0 : 1.2,
              stagger: 0.02,
              ease: "expo.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: headingEl, scroller, start: "top 85%", once: true },
            }
          );
        }
      }

      gsap.fromTo(
        ".aw-fade-up",
        { y: reduced ? 0 : 30, opacity: reduced ? 1 : 0 },
        {
          y: 0, opacity: 1, duration: reduced ? 0 : 1, ease: "expo.out", stagger: 0.1, clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".aw-header-container", scroller, start: "top 85%", once: true },
        }
      );

      // Desktop Image Accordion Hover Logic
      const panels = gsap.utils.toArray<HTMLElement>(".aw-panel");
      if (panels.length && !reduced) {
        panels.forEach((panel, i) => {
          gsap.fromTo(
            panel,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1, scale: 1, duration: 1.2, stagger: 0.1, ease: "power3.out", clearProps: "transform,opacity",
              scrollTrigger: { trigger: ".aw-accordion-container", scroller, start: "top 80%", once: true }
            }
          );

          panel.addEventListener("mouseenter", () => {
            panels.forEach(p => {
              p.style.flex = "1";
              gsap.to(p.querySelector(".aw-panel-expanded"), { opacity: 0, duration: 0.4, ease: "power2.out" });
              gsap.to(p.querySelector(".aw-panel-collapsed"), { opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.1 });
            });

            panel.style.flex = "7";
            gsap.to(panel.querySelector(".aw-panel-expanded"), { opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.3 });
            gsap.to(panel.querySelector(".aw-panel-collapsed"), { opacity: 0, duration: 0.2, ease: "power2.out" });
          });
        });
      }

      // Mobile Image Accordion Interaction Array
      const mobilePanels = gsap.utils.toArray<HTMLElement>(".aw-mobile-panel");
      if (mobilePanels.length && !reduced) {
        gsap.fromTo(
          mobilePanels,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".aw-accordion-mobile", scroller, start: "top 85%", once: true } }
        );

        mobilePanels.forEach((panel) => {
          panel.addEventListener("click", () => {
            mobilePanels.forEach(p => {
              p.style.height = "90px";
              gsap.to(p.querySelector(".aw-mobile-expanded"), { opacity: 0, duration: 0.3 });
              gsap.to(p.querySelector(".aw-mobile-collapsed"), { opacity: 1, duration: 0.4, delay: 0.1 });
            });

            panel.style.height = "400px";
            gsap.to(panel.querySelector(".aw-mobile-expanded"), { opacity: 1, duration: 0.5, delay: 0.2 });
            gsap.to(panel.querySelector(".aw-mobile-collapsed"), { opacity: 0, duration: 0.2 });
          });
        });
      }

      // Number Count Ups
      const nums = gsap.utils.toArray<HTMLElement>(".aw-num");
      nums.forEach((numEl) => {
        const targetStr = numEl.getAttribute("data-target");
        if (!targetStr) return;

        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: parseFloat(targetStr),
          duration: reduced ? 0 : 2.5,
          ease: "expo.out",
          scrollTrigger: { trigger: numEl.closest("section"), scroller, start: "top 85%", once: true },
          onUpdate() {
            numEl.textContent = Math.round(proxy.val).toString();
          },
        });
      });

    }, sectionRef);

    scheduleScrollTriggerRefresh();

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-visible bg-background py-24 md:py-32" aria-label="Our Impact">
      <div className="_container relative z-10 font-sans">

        {/* Header Section */}
        <div className="aw-header-container mb-20 lg:mb-28 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 px-4 md:px-0">
          <div className="max-w-3xl">
            <span className="aw-fade-up mb-8 block text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Track Record
            </span>
            <h2 className="aw-heading text-[3.5rem] font-medium leading-[0.95] tracking-tight md:text-[6.5rem] lg:text-[8rem]">
              Outcomes<br />
              <span className="text-black/30 italic font-light">that lead.</span>
            </h2>
          </div>
          <p className="aw-fade-up max-w-[28ch] text-lg font-light leading-relaxed text-black/60 md:text-xl md:pb-6">
            Awards are a signal. Outcomes are the standard. We build systems that perform and visuals that move.
          </p>
        </div>

        {/* Desktop Interactive Accordion Gallery */}
        <div className="aw-accordion-container hidden lg:flex w-full h-[650px] xl:h-[750px] gap-4 mb-20 px-4 md:px-0">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`aw-panel relative h-full rounded-[2.5rem] overflow-hidden cursor-pointer bg-black/5 group`}
              style={{
                transition: "flex 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                flex: i === 0 ? "7" : "1"
              }}
            >
              {/* Immersive Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image src={stat.image} alt={stat.label} fill className="object-cover transition-transform duration-[6s] ease-out scale-100 group-hover:scale-110" priority={i === 0} sizes="(max-width: 1400px) 100vw, 1400px" />
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Collapsed State (Rotated Content) */}
              <div
                className="aw-panel-collapsed absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                style={{ opacity: i === 0 ? 0 : 1 }}
              >
                <div className="flex items-center gap-12 rotate-[-90deg] whitespace-nowrap">
                  <span className="text-white/60 font-bold tracking-[0.2em]">0{i + 1}</span>
                  <span className="text-white text-2xl xl:text-3xl font-medium tracking-wide">{stat.label}</span>
                </div>
              </div>

              {/* Expanded State (Full Detail) */}
              <div
                className="aw-panel-expanded absolute inset-0 z-20 flex flex-col justify-between p-12 pointer-events-none"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-white font-bold tracking-[0.2em] bg-white/10 px-6 py-2 rounded-full backdrop-blur-md">0{i + 1} / 04</span>
                  <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-transform duration-700 group-hover:rotate-45">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline mb-4">
                    <span className="aw-num text-white text-[8rem] xl:text-[10rem] font-bold leading-none tracking-tighter" data-target={stat.value}>0</span>
                    <span className="text-accent text-[5rem] xl:text-[6rem] font-bold leading-[0.8] ml-2">{stat.suffix}</span>
                  </div>
                  <h3 className="text-white text-4xl xl:text-5xl font-medium mb-6 tracking-tight">{stat.label}</h3>
                  <p className="text-white/80 max-w-[42ch] text-lg font-light leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Accordion Interaction */}
        <div className="aw-accordion-mobile lg:hidden flex flex-col w-full px-4 md:px-0 gap-3 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`aw-mobile-panel relative w-full rounded-[2rem] overflow-hidden cursor-pointer bg-black`}
              style={{
                transition: "height 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                height: i === 0 ? "460px" : "90px"
              }}
            >
              <div className="absolute inset-0 z-0">
                <Image src={stat.image} alt={stat.label} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              </div>

              {/* Mobile Collapsed State */}
              <div
                className="aw-mobile-collapsed absolute inset-0 z-10 flex items-center px-8 pointer-events-none"
                style={{ opacity: i === 0 ? 0 : 1 }}
              >
                <span className="text-white/60 font-bold tracking-[0.2em] w-12 text-sm">0{i + 1}</span>
                <span className="text-white text-xl font-medium tracking-wide">{stat.label}</span>
              </div>

              {/* Mobile Expanded State */}
              <div
                className="aw-mobile-expanded absolute inset-0 z-20 flex flex-col justify-between p-8 pointer-events-none"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <span className="text-white w-fit font-bold tracking-[0.2em] text-xs bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">0{i + 1} / 04</span>
                <div className="flex flex-col">
                  <div className="flex items-baseline mb-4 mt-auto">
                    <span className="aw-num text-white text-[5.5rem] font-bold leading-none tracking-tighter" data-target={stat.value}>0</span>
                    <span className="text-accent text-[3rem] font-bold leading-none ml-2">{stat.suffix}</span>
                  </div>
                  <h3 className="text-white text-2xl md:text-3xl font-medium mb-3">{stat.label}</h3>
                  <p className="text-white/80 text-sm md:text-base font-light leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
