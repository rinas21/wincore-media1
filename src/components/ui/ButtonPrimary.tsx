"use client";

import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

const HOVER = {
  scale: 1.05,
  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  duration: 0.35,
  ease: "power3.out" as const,
};

const MAGNETIC = 0.2;

type ButtonPrimaryProps = {
  className?: string;
  children: ReactNode;
  href?: string;
  /** Use a plain <a> (e.g. external URL) instead of Next.js Link */
  external?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
};

/**
 * Unified primary CTA: magnetic hover (quickTo x/y) + GSAP scale + shadow.
 * Uses class `btn-primary`.
 */
export function ButtonPrimary({
  className,
  children,
  href,
  external,
  type = "button",
  disabled,
}: ButtonPrimaryProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (prefersReducedMotion()) return;
    const coarse =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      const onEnter = () => {
        gsap.to(el, { ...HOVER, overwrite: "auto" });
      };
      const onLeave = () => {
        gsap.to(el, {
          scale: 1,
          duration: HOVER.duration,
          ease: HOVER.ease,
          overwrite: "auto",
          onComplete: () => {
            gsap.set(el, { clearProps: "boxShadow" });
          },
        });
      };
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      };
    }

    gsap.set(el, { x: 0, y: 0, transformOrigin: "50% 50%" });
    xTo.current = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: Event) => {
      const pe = e as PointerEvent;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      xTo.current?.((pe.clientX - cx) * MAGNETIC);
      yTo.current?.((pe.clientY - cy) * MAGNETIC);
    };

    const onEnter = () => {
      gsap.to(el, { ...HOVER, overwrite: "auto" });
      el.addEventListener("pointermove", onMove);
    };

    const onLeave = () => {
      el.removeEventListener("pointermove", onMove);
      xTo.current?.(0);
      yTo.current?.(0);
      gsap.to(el, {
        scale: 1,
        duration: HOVER.duration,
        ease: HOVER.ease,
        overwrite: "auto",
        onComplete: () => {
          gsap.set(el, { clearProps: "boxShadow" });
        },
      });
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointermove", onMove);
    };
  }, [disabled, href, type]);

  const base =
    "btn-primary inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (href && external) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, className)}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={cn(base, className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={cn(base, className)}
    >
      {children}
    </button>
  );
}
