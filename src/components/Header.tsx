"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { useLenis } from "@/context/LenisContext";
import {
  registerGsapPlugins,
  getScroller,
  prefersReducedMotion,
  scheduleScrollTriggerRefresh,
} from "@/lib/motion";

type PillQuick = {
  x: (v: number) => void;
  w: (v: number) => void;
  h: (v: number) => void;
  o: (v: number) => void;
};

const NAV = [
  { label: "Works", href: "/works" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function navHrefActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const activePillRef = useRef<HTMLDivElement>(null);
  const pillQuickRef = useRef<PillQuick | null>(null);
  const headerYTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const menuOpenRef = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    menuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  /* Scroll-linked shrink — header stays visible, only tightens into a pill bar. */
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!lenis || !headerEl) return;

    registerGsapPlugins();
    const scroller = getScroller();
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(headerEl, {
        height: 56,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 16,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerEl,
        {
          height: 76,
          paddingTop: 16,
          paddingBottom: 16,
          borderRadius: 24,
        },
        {
          height: 56,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 16,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            scroller,
            start: "top top",
            end: "+=120",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        },
      );
    }, headerEl);

    scheduleScrollTriggerRefresh();
    return () => ctx.revert();
  }, [lenis]);

  /* Hide on scroll down, reveal on scroll up (Lenis direction). */
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!lenis || !headerEl) return;

    const reduced = prefersReducedMotion();
    if (reduced) {
      gsap.set(headerEl, { y: 0 });
      return;
    }

    gsap.set(headerEl, { y: 0 });
    headerYTo.current = gsap.quickTo(headerEl, "y", { duration: 0.42, ease: "power3.out" });

    const onScroll = (instance: Lenis) => {
      const yTo = headerYTo.current;
      if (!yTo) return;
      if (menuOpenRef.current) {
        yTo(0);
        return;
      }
      const scroll = instance.scroll;
      if (scroll < 72) {
        yTo(0);
        return;
      }
      const dir = instance.direction;
      const hide = -(headerEl.offsetHeight + 14);
      if (dir === 1) {
        yTo(hide);
      } else if (dir === -1) {
        yTo(0);
      }
    };

    const unsub = lenis.on("scroll", onScroll);
    return () => {
      unsub();
      headerYTo.current = null;
      gsap.set(headerEl, { y: 0 });
    };
  }, [lenis]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.set(el, { y: 0 });
    headerYTo.current?.(0);
  }, [pathname]);

  /* Active route: sliding pill — quickTo for x / width / height / opacity. */
  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = activePillRef.current;
    if (!nav || !pill) return;

    if (!pillQuickRef.current) {
      pillQuickRef.current = {
        x: gsap.quickTo(pill, "x", { duration: 0.38, ease: "power2.out" }),
        w: gsap.quickTo(pill, "width", { duration: 0.38, ease: "power2.out" }),
        h: gsap.quickTo(pill, "height", { duration: 0.38, ease: "power2.out" }),
        o: gsap.quickTo(pill, "opacity", { duration: 0.22, ease: "power2.out" }),
      };
    }
    const q = pillQuickRef.current;

    const update = () => {
      const active = [...nav.querySelectorAll<HTMLAnchorElement>("a[data-nav-link]")].find((a) =>
        navHrefActive(pathname, a.getAttribute("href") ?? ""),
      );

      if (!active) {
        q.o(0);
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const linkRect = active.getBoundingClientRect();
      const x = linkRect.left - navRect.left;
      const w = linkRect.width;
      const h = Math.min(32, linkRect.height + 8);

      q.o(1);
      q.x(x);
      q.w(w);
      q.h(h);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(nav);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

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
        className="fixed top-1.5 left-1.5 right-1.5 z-[100] flex items-center justify-between border border-black/[0.05] bg-background/85 px-5 backdrop-blur-2xl md:px-12 lg:px-16"
        style={{ willChange: "height, padding, border-radius, transform" }}
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-1.5 md:gap-2.5 transition-transform hover:scale-[1.02]"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="text-xl font-extrabold tracking-tight text-foreground md:text-2xl lg:text-3xl">
            WINCORE
          </span>
          <span className="flex h-4 items-center rounded bg-black/5 px-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-black/60 md:h-5 md:px-2 md:text-[10px]">
            Agency
          </span>
        </Link>

        <div className="flex items-center md:gap-8">
          <nav
            ref={navRef}
            className="relative hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            <div
              ref={activePillRef}
              className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 rounded-full bg-accent/[0.14]"
              style={{ width: 0, height: 28, opacity: 0 }}
              aria-hidden
            />
            {NAV.map((item) => {
              const active = navHrefActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav-link
                  className={cn(
                    "nav-primary-link relative z-10 cursor-hover pb-1 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300",
                    active ? "text-foreground" : "text-black/50 hover:text-black",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <ButtonPrimary
            href="/contact"
            className="relative z-10 hidden min-h-[44px] rounded-full bg-foreground px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_8px_22px_rgba(0,0,0,0.14)] md:flex"
          >
            Start Project
          </ButtonPrimary>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="z-[101] flex flex-col gap-1.5 md:hidden"
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <div
            className={cn(
              "h-0.5 w-8 bg-foreground transition-all duration-300",
              isMenuOpen && "translate-y-2 rotate-45",
            )}
          />
          <div
            className={cn(
              "h-0.5 w-8 bg-foreground transition-all duration-300",
              isMenuOpen && "opacity-0",
            )}
          />
          <div
            className={cn(
              "h-0.5 w-8 bg-foreground transition-all duration-300",
              isMenuOpen && "-translate-y-2 -rotate-45",
            )}
          />
        </button>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[99] bg-background/95 backdrop-blur-xl transition-opacity duration-300 md:hidden",
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isMenuOpen}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto px-6 pb-12 pt-24"
          aria-label="Mobile primary"
        >
          {NAV.map((item) => {
            const active = navHrefActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "cursor-hover text-2xl font-black uppercase tracking-[0.2em]",
                  active ? "text-accent" : "text-black/80",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
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
