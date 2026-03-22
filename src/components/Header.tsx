"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useLenis } from "@/context/LenisContext";
import type Lenis from "lenis";

const NAV = [
  { label: "Works", href: "/works" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();
  const lastScrollRef = useRef(0);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = (instance: Lenis) => {
      const y = instance.scroll;
      const prev = lastScrollRef.current;
      if (y > prev && y > 120) {
        gsap.to(headerRef.current, { yPercent: -100, duration: 0.45, ease: "power2.inOut" });
      } else {
        gsap.to(headerRef.current, { yPercent: 0, duration: 0.45, ease: "power2.inOut" });
      }
      lastScrollRef.current = y;
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 z-[100] flex w-full items-center justify-between border-b border-white/[0.06] bg-background/80 px-6 py-5 backdrop-blur-xl md:px-10"
      >
        <Link href="/" className="group flex flex-col items-start" onClick={() => setIsMenuOpen(false)}>
          <span className="text-2xl font-black tracking-tighter text-white md:text-3xl">WINCOR</span>
          <span className="-mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Agency</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-hover text-xs font-bold uppercase tracking-[0.35em] text-white/55 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden z-[101]"
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <div className={cn("h-0.5 w-8 bg-white transition-all duration-300", isMenuOpen && "translate-y-2 rotate-45")} />
          <div className={cn("h-0.5 w-8 bg-white transition-all duration-300", isMenuOpen && "opacity-0")} />
          <div className={cn("h-0.5 w-8 bg-white transition-all duration-300", isMenuOpen && "-translate-y-2 -rotate-45")} />
        </button>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[99] bg-background/95 backdrop-blur-xl transition-opacity duration-300 md:hidden",
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-10 px-6" aria-label="Mobile primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-hover text-2xl font-black uppercase tracking-[0.2em] text-white/90"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-6 text-xs font-bold uppercase tracking-[0.4em] text-white/35"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </nav>
      </div>
    </>
  );
}
