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

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Onyx Luxury",
    category: "High-End Commerce",
    image: "/works/vibrant_webgl.png",
    tags: ["E-Commerce", "WebGL", "Brand Strategy"],
    description: "A flagship digital storefront for Onyx, blending 3D product interaction with seamless conversion architecture. Engineered for elite performance and visceral user engagement.",
    stack: "React, Three.js, Shopify",
    duration: "12 Weeks",
    role: "Full-Service Partner",
    impact: "+40% Conversion",
    link: "https://onyx-luxury.com",
  },
  {
    id: 2,
    title: "Cipher Fintech",
    category: "Financial Systems",
    image: "/works/vibrant_fintech.png",
    tags: ["Product Design", "Security", "AI Systems"],
    description: "Reimagining the security of digital assets. Cipher is a high-security, ultra-efficient fintech dashboard built for real-time transaction monitoring and global scales.",
    stack: "Next.js, D3.js, Rust",
    duration: "16 Weeks",
    role: "Product Architecture",
    impact: "99.9% Efficiency",
    link: "https://cipher-fin.io",
  },
  {
    id: 3,
    title: "Aura Experiences",
    category: "Immersive Motion",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    tags: ["WebGL", "Motion Design", "3D UI"],
    description: "An evocative, atmospheric experience for a luxury wellness brand. We built a fluid, non-linear navigation system that responds to the user's kinetic energy and focus.",
    stack: "GSAP, WebGL, React",
    duration: "8 Weeks",
    role: "Direction & Motion",
    impact: "1.2M+ Reach",
    link: "https://aura-exp.com",
  },
  {
    id: 4,
    title: "Vanguard App",
    category: "Native Mobility",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    tags: ["App Design", "UI/UX", "Prototyping"],
    description: "Leading the charge in premium electric mobility. Vanguard is more than an app; it is a companion for high-performance navigation and vehicle intelligence.",
    stack: "React Native, Swift",
    duration: "14 Weeks",
    role: "Mobile Strategy",
    impact: "4.8 App Rating",
    link: "https://vanguard-drive.ai",
  },
  {
    id: 5,
    title: "Neon Analytics",
    category: "AI Data Platform",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1200",
    tags: ["AI Integration", "Big Data", "Visual Systems"],
    description: "A complex data visualization engine that turns massive datasets into actionable intelligence through an intuitive, dark-mode first interface architecture.",
    stack: "PyTorch, Next.js, D3",
    duration: "10 Weeks",
    role: "Engineering Lead",
    impact: "Seed Funded",
    link: "https://neon-data.tech",
  },
  {
    id: 6,
    title: "Prism Editorial",
    category: "Brand Expression",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200",
    tags: ["Typography", "Editorial", "Web Design"],
    description: "A minimal, brutalist editorial platform for avant-garde architectural designs. Focusing on space, light, and the hierarchy of information over decorative clutter.",
    stack: "Next.js, Sanity.io",
    duration: "6 Weeks",
    role: "Brand & Design",
    impact: "+200% Sessions",
    link: "https://prism-arch.com",
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
    <section ref={sectionRef} className="relative bg-white py-16 md:py-24 overflow-visible">
      
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
        
        {/* HEADER AREA */}
        <div className="mb-16 flex flex-col items-start gap-6">
          <div className="space-y-1">
             <div className="flex items-center gap-4">
               <div className="w-10 h-[1px] bg-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Wincore Archives</span>
             </div>
             <h2 className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-black leading-[0.8] tracking-[-0.07em] uppercase">
                Works <br />
                <span className="text-black/5 italic font-serif lowercase font-light">that lead.</span>
             </h2>
          </div>
          <p className="max-w-md text-xl font-light leading-relaxed text-black/40">
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
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
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
