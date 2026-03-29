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
  const isHiddenRef = useRef(false);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!lenis || !headerEl) return;

    const yTo = gsap.quickTo(headerEl, "yPercent", {
      duration: 0.45,
      ease: "power2.inOut",
    });

    const onScroll = (instance: Lenis) => {
      const y = instance.scroll;
      const prev = lastScrollRef.current;
      const shouldHide = y > prev && y > 120;

      if (shouldHide !== isHiddenRef.current) {
        yTo(shouldHide ? -100 : 0);
        isHiddenRef.current = shouldHide;
      }

      lastScrollRef.current = y;
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      gsap.killTweensOf(headerEl);
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
        className="fixed top-1.5 left-1.5 right-1.5 z-[100] flex items-center justify-between border border-black/[0.05] bg-background/85 px-5 py-4 backdrop-blur-2xl rounded-2xl transition-all duration-300 md:px-12 lg:px-16"
      >
        <Link href="/" className="group flex items-center gap-1.5 md:gap-2.5 transition-transform hover:scale-[1.02]" onClick={() => setIsMenuOpen(false)}>
          <span className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
            WINCORE
          </span>
          <span className="flex h-4 items-center rounded bg-black/5 px-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-black/60 md:h-5 md:px-2 md:text-[10px]">
            Agency
          </span>
        </Link>

        <div className="flex md:gap-8 items-center">
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-hover relative text-xs font-bold uppercase tracking-[0.2em] text-black/50 transition-colors pb-1 hover:text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
            ))}
          </nav>
          
          <Link
            href="/contact"
            className="hidden items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-transform hover:scale-105 md:flex"
          >
            Start Project
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden z-[101]"
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <div className={cn("h-0.5 w-8 bg-foreground transition-all duration-300", isMenuOpen && "translate-y-2 rotate-45")} />
          <div className={cn("h-0.5 w-8 bg-foreground transition-all duration-300", isMenuOpen && "opacity-0")} />
          <div className={cn("h-0.5 w-8 bg-foreground transition-all duration-300", isMenuOpen && "-translate-y-2 -rotate-45")} />
        </button>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[99] bg-background/95 backdrop-blur-xl transition-opacity duration-300 md:hidden",
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8 px-6 pt-24 pb-12 overflow-y-auto" aria-label="Mobile primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-hover text-2xl font-black uppercase tracking-[0.2em] text-black/80"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-6 text-xs font-bold uppercase tracking-[0.4em] text-black/30"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </nav>
      </div>
    </>
  );
}
