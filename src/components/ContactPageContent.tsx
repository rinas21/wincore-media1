"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Send, Sparkles } from "lucide-react";
import { registerGsapPlugins, scheduleScrollTriggerRefresh } from "@/lib/motion";

type SubmitState = "idle" | "loading" | "sent" | "error";

const SERVICES = [
  "Design & Branding",
  "Digital Products",
  "Creative Development",
  "AI Architecture",
  "Content & Strategy",
];

export default function ContactPageContent() {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  function toggleService(svc: string) {
    setSelectedServices(prev =>
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    );
  }

  useEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      // 01: Line drawing effect
      gsap.fromTo(".ct-line", 
        { scaleX: 0, opacity: 0 }, 
        { scaleX: 1, opacity: 1, duration: 1.8, ease: "expo.out", delay: 0.2 }
      );

      // 02: Cinematic text reveals
      gsap.fromTo(".ct-reveal",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power4.out", delay: 0.4 }
      );

      // 03: Field sequential reveal
      gsap.fromTo(".ct-field",
        { y: 30, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: ".ct-field-wrap", start: "top 90%" }
        }
      );
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
      setFeedback("Identification required.");
      return;
    }

    setSubmitState("loading");
    setFeedback("Syncing mission parameters...");

    setTimeout(() => {
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Interest: ${selectedServices.join(", ") || "General Inquiry"}`,
        `Message:`,
        message,
      ].join("\n");
      window.location.href = `mailto:hello@wincore.media?subject=Inquiry: ${name}&body=${encodeURIComponent(body)}`;
      setSubmitState("sent");
      setFeedback("Transmission successful.");
      formRef.current?.reset();
      setSelectedServices([]);
    }, 1200);
  }

  return (
    <section ref={rootRef} className="bg-white text-black min-h-screen relative">
      
      {/* ── ARCHITECTURAL GUTTER (LEFT) ──────────────── */}
      {/* Using a fluid left-margin strategy: 10% viewport width for massive breathing room */}
      <div className="w-full pl-[5vw] sm:pl-[8vw] lg:pl-[12vw] pr-6 sm:pr-12 md:pr-24 lg:pr-32 py-32 md:py-48 overflow-visible">
        
        {/* TOP LINE ACCENT */}
        <div className="w-32 h-[1px] bg-accent mb-12 ct-line origin-left" />

        {/* ── HEADER ────────────────────────────────────── */}
        <div className="mb-32 md:mb-40 ct-reveal">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-accent mb-6">Uplink Initiation</p>
          <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-bold tracking-[-0.07em] leading-[0.8] uppercase">
            Start <br />
            <span className="text-black/5 italic font-serif lowercase font-light">Further.</span>
          </h1>
        </div>

        {/* ── MAIN GRID ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-40 items-start">
          
          {/* INFO COLUMN (4/12) */}
          <div className="lg:col-span-4 space-y-24 ct-reveal">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20 mb-8 underline underline-offset-[12px] decoration-accent/20">Operational Node</p>
              <a href="mailto:hello@wincore.media" className="text-3xl md:text-5xl font-black tracking-tight hover:text-accent transition-all duration-700 block leading-none">
                hello@<br />wincore.media
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-black/5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/15 mb-4 font-serif">Presence</p>
                <p className="text-lg font-black tracking-tighter uppercase">Colombo, LK</p>
                <p className="text-[10px] text-black/30 mt-2 font-bold italic tracking-widest lowercase">Global Remote Node</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/15 mb-4 font-serif">Strategy</p>
                <a href="https://cal.com/wincore" target="_blank" className="flex items-center gap-2 text-lg font-black hover:text-accent transition-colors group">
                  Book Call
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-accent" />
                </a>
              </div>
            </div>

            <div className="pt-12 opacity-10">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4">Trajectory</p>
              <div className="flex flex-col gap-2">
                 {['Fortune 500', 'Innovators', 'Boutique Builders'].map(t => (
                   <span key={t} className="text-xl font-black uppercase tracking-tighter">{t}</span>
                 ))}
              </div>
            </div>
          </div>

          {/* FORM COLUMN (8/12) */}
          <div className="lg:col-span-8 w-full">
            <form ref={formRef} onSubmit={onSubmit} className="space-y-24">
              
              {/* SERVICE SELECTION */}
              <div className="space-y-12 ct-reveal">
                <div className="flex items-center gap-4">
                  <Sparkles size={16} className="text-accent" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Spectrum of Action *</p>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-8">
                  {SERVICES.map(svc => {
                    const active = selectedServices.includes(svc);
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`text-2xl md:text-5xl font-black tracking-tighter transition-all duration-700 text-left relative group ${
                          active ? "text-black scale-[1.03]" : "text-black/5 hover:text-black/10"
                        }`}
                      >
                        <span className="relative z-10">{svc}</span>
                        {active && (
                          <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-accent ct-line origin-left" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* INPUT FIELDS */}
              <div className="ct-field-wrap space-y-20 pt-16 border-t border-black/5">
                
                <div className="ct-field relative group">
                  <input 
                    name="name" type="text" required placeholder=" "
                    className="w-full bg-transparent py-6 text-3xl md:text-5xl font-black tracking-tight outline-none focus:text-accent transition-colors peer border-b border-black/10 focus:border-accent"
                  />
                  <label className="absolute left-0 top-6 text-black/10 text-3xl md:text-5xl font-black tracking-tight transition-all duration-500 pointer-events-none peer-focus:-translate-y-12 peer-focus:text-[10px] peer-focus:tracking-[0.5em] peer-focus:text-accent peer-not-placeholder-shown:-translate-y-12 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:tracking-[0.5em]">
                    Identity Name *
                  </label>
                </div>

                <div className="ct-field relative group">
                  <input 
                    name="email" type="email" required placeholder=" "
                    className="w-full bg-transparent py-6 text-3xl md:text-5xl font-black tracking-tight outline-none focus:text-accent transition-colors peer border-b border-black/10 focus:border-accent"
                  />
                  <label className="absolute left-0 top-6 text-black/10 text-3xl md:text-5xl font-black tracking-tight transition-all duration-500 pointer-events-none peer-focus:-translate-y-12 peer-focus:text-[10px] peer-focus:tracking-[0.5em] peer-focus:text-accent peer-not-placeholder-shown:-translate-y-12 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:tracking-[0.5em]">
                    Digital Uplink *
                  </label>
                </div>

                <div className="ct-field relative group pt-4">
                  <textarea 
                    name="message" required rows={4} placeholder=" "
                    className="w-full bg-transparent py-6 text-3xl md:text-5xl font-black tracking-tight outline-none focus:text-accent transition-colors peer resize-none border-b border-black/10 focus:border-accent"
                  />
                  <label className="absolute left-0 top-6 text-black/10 text-3xl md:text-5xl font-black tracking-tight transition-all duration-500 pointer-events-none peer-focus:-translate-y-16 peer-focus:text-[10px] peer-focus:tracking-[0.5em] peer-focus:text-accent peer-not-placeholder-shown:-translate-y-16 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:tracking-[0.5em]">
                    Vision Mission Overview *
                  </label>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-16 border-t border-black/10">
                 <div className="flex flex-col gap-1 opacity-20 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Wincore Studio</p>
                    <p className="text-[10px] font-bold italic lowercase">selective partnerships &middot; world wide</p>
                 </div>

                 {/* No-Crop Button Wrapper */}
                 <div className="w-full sm:w-auto overflow-visible">
                    <button
                      type="submit"
                      disabled={submitState === "loading"}
                      className="group relative h-28 w-full sm:min-w-[400px] rounded-[1rem] bg-black text-white px-12 overflow-hidden shadow-2xl transition-all duration-700 active:scale-95 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-accent translate-y-full transition-transform duration-700 ease-expo group-hover:translate-y-0" />
                      <div className="relative z-10 flex items-center justify-between gap-12">
                        {submitState === "loading" ? (
                          <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                           <>
                            <div className="text-left">
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Authorization</p>
                               <span className="text-[14px] font-black uppercase tracking-[0.4em]">Establish Link</span>
                            </div>
                            <Send size={24} className="transition-all duration-700 group-hover:translate-x-4 group-hover:-translate-y-4 text-accent" />
                           </>
                        )}
                      </div>
                    </button>
                 </div>
              </div>

              {feedback && (
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-accent animate-pulse pt-8 text-left">
                   &raquo; {feedback}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
