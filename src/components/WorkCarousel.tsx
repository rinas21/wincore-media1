"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import ProjectModal, { type Project } from "@/components/ProjectModal";
import {
  registerGsapPlugins,
  getScroller,
  prefersReducedMotion,
} from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Luminex Ecosystem",
    category: "Vibrant UI / 3D",
    image: "/works/vibrant_webgl.png",
    tags: ["WebGL", "3D UI", "Performance"],
    description: "A neon-fused, high-performance interface for a decentralized tech network.",
    stack: "React, Three.js, GSAP",
    duration: "10 Weeks",
    role: "Lead Agency",
    impact: "+240% Speed",
    link: "https://luminex.tech",
  },
  {
    id: 2,
    title: "Aurum FinTech",
    category: "Branding / Web Product",
    image: "/works/vibrant_fintech.png",
    tags: ["Fintech", "Glassmorphism", "Branding"],
    description: "Reimagining modern finance with an emerald-gold aesthetic.",
    stack: "Next.js, D3.js, GSAP",
    duration: "8 Weeks",
    role: "Core Studio",
    impact: "99% Uptime",
    link: "https://aurum.finance",
  },
  {
    id: 3,
    title: "Nova AI Studio",
    category: "Product / Motion",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    tags: ["AI", "Creative", "Motion"],
    description: "Vibrant magenta and violet gradients powering next-gen AI platforms.",
    stack: "React, Framer, AI",
    duration: "12 Weeks",
    role: "Creative Partner",
    impact: "1M+ Users",
    link: "https://nova-ai.io",
  },
  {
    id: 4,
    title: "Pulse Tourism",
    category: "Video / Experience",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
    tags: ["Video", "Cinematic", "Tropics"],
    description: "Hyper-colored cinematic tours for luxury island retreats.",
    stack: "After Effects, DaVinci",
    duration: "6 Weeks",
    role: "Production",
    impact: "+300% Booking",
    link: "https://pulse.travel",
  },
  {
    id: 5,
    title: "Vanguard Mobility",
    category: "App / Motion",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    tags: ["Mobile", "Prototyping", "UI/UX"],
    description: "A dark-mode first UI for premium electric mobility.",
    stack: "React Native, Reanimated",
    duration: "14 Weeks",
    role: "UX & Dev Partner",
    impact: "4.9 App Store",
    link: "https://vanguard.eco",
  },
  {
    id: 6,
    title: "Aura Architecture",
    category: "Web / Editorial",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200",
    tags: ["Minimal", "Layout", "Typography"],
    description: "A brutalist yet pristine editorial platform for avant-garde designs.",
    stack: "Next.js, Sanity, GSAP",
    duration: "8 Weeks",
    role: "Full Service",
    impact: "+150% Engagement",
    link: "https://aura-arch.com",
  },
  {
    id: 7,
    title: "Nexus Labs",
    category: "3D / Brand",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1200",
    tags: ["Brand", "3D", "Identity"],
    description: "Brand identity and immersive 3D landing page for deep-tech firm.",
    stack: "Spline, React",
    duration: "6 Weeks",
    role: "Visual Lead",
    impact: "Seed Funded",
    link: "https://nexus-labs.ai",
  },
  {
    id: 8,
    title: "Chroma E-Commerce",
    category: "Commerce / UX",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
    tags: ["Shopify", "Headless", "UX"],
    description: "Blazingly fast headless commerce for high-end streetwear.",
    stack: "Hydrogen, Tailwind",
    duration: "12 Weeks",
    role: "Tech Partner",
    impact: "+35% Conv. Rate",
    link: "https://chroma.store",
  },
];

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
      
      cards.forEach((card, i) => {
        if (reduced) return;

        // Perspective Entrance
        gsap.fromTo(card, 
          { y: 150, opacity: 0, rotateX: 10, scale: 0.95 },
          { 
            y: 0, opacity: 1, rotateX: 0, scale: 1, 
            duration: 1.5, ease: "expo.out",
            scrollTrigger: { trigger: card, scroller, start: "top 95%", once: true }
          }
        );

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
    <section ref={sectionRef} className="relative bg-white py-32 md:py-48 overflow-visible">
      
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
        
        {/* HEADER AREA */}
        <div className="mb-32 flex flex-col items-start gap-12">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
               <div className="w-10 h-[1px] bg-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Selected Archives</span>
             </div>
             <h2 className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-black leading-[0.8] tracking-[-0.07em] uppercase">
                Works <br />
                <span className="text-black/5 italic font-serif lowercase font-light">that rewrite.</span>
             </h2>
          </div>
          <p className="max-w-md text-xl font-light leading-relaxed text-black/40">
             Scroll down to navigate through our primary orbit. Focus shifts as you dwell on the architecture of each system.
          </p>
        </div>

        {/* ULTRA-MODERN ARCHITECTURAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 md:gap-y-64 items-center">
          {PROJECTS.map((p, i) => {
             const isEven = i % 2 === 0;
             return (
               <div 
                 key={p.id} 
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

                    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-end gap-12 lg:gap-24`}>
                       
                       {/* IMAGE MONOLITH */}
                       <div className="relative w-full md:w-[60%] aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-black/5 shadow-[0_60px_100px_rgba(0,0,0,0.08)] transform-gpu transition-all duration-1000 group-hover:shadow-[0_80px_120px_rgba(0,136,204,0.15)] group-hover:scale-[1.02]">
                          <Image 
                            src={p.image} 
                            alt={p.title} 
                            fill 
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                            sizes="(max-width: 1400px) 100vw, 800px" 
                          />
                          {/* Inner Shine Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                       </div>

                       {/* CONTENT BLOCK */}
                       <div className={`w-full md:w-[40%] pb-8 ${isEven ? 'text-left' : 'text-right'} space-y-6`}>
                          <div className={`flex items-center gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
                             <div className="w-6 h-[1px] bg-accent/30" />
                             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">{p.category}</span>
                          </div>
                          <h3 className="text-4xl lg:text-7xl font-black uppercase tracking-[-0.03em] leading-none group-hover:text-accent transition-colors duration-700">
                             {p.title}
                          </h3>
                          <div className={`flex items-center gap-6 pt-4 ${isEven ? 'justify-start' : 'justify-end'}`}>
                             <span className="text-[10px] font-black text-black/20 group-hover:text-black transition-colors">EST. PROJECT {p.duration}</span>
                             <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700">
                                <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform duration-700" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </button>
               </div>
             );
          })}
        </div>
      </div>

      {/* BACKGROUND FLOATING TEXT */}
      <div className="absolute top-1/2 left-0 w-full pointer-events-none opacity-[0.02] overflow-hidden">
         <div className="wc-scrub text-[25vw] font-black uppercase whitespace-nowrap leading-none tracking-[-0.05em]">
            Digital Authority &middot; Selective Engineering &middot; Immersive Systems &middot;
         </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
