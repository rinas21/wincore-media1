"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import ProjectModal from "@/components/ProjectModal";
import { PROJECTS, type Project } from "@/lib/projects";
import {
  registerGsapPlugins,
  getScroller,
  prefersReducedMotion,
} from "@/lib/motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function WorkCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".wc-card-wrapper");

      cards.forEach((card) => {
        if (reduced) return;

        // Hover Parallax Tilt
        const inner = card.querySelector(".wc-inner");
        card.addEventListener("mousemove", (e) => {
          const { left, top, width, height } = card.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          gsap.to(inner, { 
            rotateY: x * 15, rotateX: -y * 15, 
            x: x * 20, y: y * 20, 
            duration: 0.6, ease: "power2.out" 
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(inner, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        });
      });

      // Horizontal Text Scrub
      gsap.to(".wc-scrub", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white py-16 md:py-24 overflow-visible">
      
      <div className="_container relative">
        
        {/* HEADER AREA */}
        <div className="mb-16 flex flex-col items-start gap-6">
          <div className="space-y-1">
             <div data-reveal className="flex items-center gap-4">
               <div className="w-10 h-[1px] bg-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Wincore Archives</span>
             </div>
             <h2 data-reveal className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-black leading-[0.8] tracking-[-0.07em] uppercase">
                Works <br />
                <span className="text-black/5 italic font-serif lowercase font-light">that lead.</span>
             </h2>
          </div>
          <p data-reveal className="max-w-md text-xl font-light leading-relaxed text-black/40">
             Navigate through our primary digital orbit. Each project represent a milestone in Wincore Media engineering.
          </p>
        </div>

        {/* ULTRA-MODERN ARCHITECTURAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-32 items-center">
          {PROJECTS.map((p, i) => {
             const isEven = i % 2 === 0;
             return (
               <div
                 key={p.id}
                 data-reveal
                 className={`wc-card-wrapper col-span-1 md:col-span-10 ${isEven ? 'md:col-start-1 text-left' : 'md:col-start-3 text-right'} perspective-[2000px]`}
               >
                 <button 
                   onClick={() => setSelectedProject(p)}
                   className="wc-inner relative group w-full outline-none transform-gpu"
                 >
                    {/* Background Indexing */}
                    <div className={`absolute -top-12 ${isEven ? 'left-0' : 'right-0'} text-[18vw] font-black italic text-black/[0.03] leading-none pointer-events-none transition-all duration-1000 group-hover:text-black/[0.06] group-hover:translate-y-[-10px]`}>
                       0{p.id}
                    </div>

                    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-end gap-6 lg:gap-12`}>
                       
                       {/* IMAGE MONOLITH */}
                       <div className="relative w-full md:w-[60%] aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-black/5 shadow-[0_60px_100px_rgba(0,0,0,0.08)] transform-gpu transition-all duration-1000">
                          <Image 
                            src={p.image} 
                            alt={p.title} 
                            fill 
                            className="object-cover transition-all duration-1000 group-hover:scale-110" 
                            sizes="(max-width: 1400px) 100vw, 800px" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-center justify-center">
                             <Link 
                               href={`/work/${p.slug}`}
                               className="scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-accent hover:text-white"
                             >
                               View Case Study <ArrowUpRight size={14} />
                             </Link>
                          </div>
                       </div>

                       {/* CONTENT BLOCK */}
                       <div className={`w-full md:w-[40%] pb-4 ${isEven ? 'text-left' : 'text-right'} space-y-2`}>
                          <div className={`flex items-center gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
                             <div className="w-6 h-[1px] bg-accent/30" />
                             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">{p.category}</span>
                          </div>
                          <h3 className="text-4xl lg:text-7xl font-black uppercase tracking-[-0.03em] leading-none group-hover:text-accent transition-colors duration-700">
                             {p.title}
                          </h3>
                          <div className={`flex items-center gap-6 pt-4 ${isEven ? 'justify-start' : 'justify-end'}`}>
                             <Link href={`/work/${p.slug}`} className="text-[10px] font-black text-black/20 hover:text-accent transition-colors uppercase tracking-[0.2em] underline decoration-accent/30 underline-offset-4">Full Case Study</Link>
                             <span className="text-[10px] font-black text-black/20 group-hover:text-black transition-colors uppercase tracking-[0.2em]">Mission {p.duration}</span>
                          </div>
                       </div>
                    </div>
                 </button>
               </div>
             );
          })}
        </div>
      </div>

      <div className="absolute top-1/2 left-0 w-full pointer-events-none opacity-[0.02] overflow-hidden">
         <div className="wc-scrub text-[25vw] font-black uppercase whitespace-nowrap leading-none tracking-[-0.05em]">
            Wincore Media &middot; Selective Engineering &middot; Immersive Systems &middot; Digital Command
         </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
