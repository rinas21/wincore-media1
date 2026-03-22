"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    gsap.set([cursor, ring], { x: 0, y: 0, xPercent: -50, yPercent: -50, opacity: 0 });

    const move = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.08,
        opacity: 1,
        ease: "power2.out",
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.35,
        opacity: 0.85,
        ease: "power3.out",
      });
    };

    const onEnter = () => {
      gsap.to(cursor, { scale: 0.5, opacity: 0.5, duration: 0.2 });
      gsap.to(ring, { scale: 1.2, borderColor: "rgba(0,191,255,0.85)", duration: 0.25 });
    };

    const onLeave = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(ring, { scale: 1, borderColor: "rgba(0,191,255,0.35)", duration: 0.25 });
    };

    window.addEventListener("mousemove", move);

    const timer = window.setInterval(() => {
      document.querySelectorAll("a, button, [role='button'], .cursor-hover").forEach((el) => {
        const anyEl = el as HTMLElement & { _c?: boolean };
        if (anyEl._c) return;
        anyEl._c = true;
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }, 700);

    return () => {
      window.removeEventListener("mousemove", move);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden overflow-hidden lg:block">
      <div ref={ringRef} className="absolute h-9 w-9 rounded-full border border-accent/35 bg-transparent" />
      <div ref={cursorRef} className="absolute h-1.5 w-1.5 rounded-full bg-accent" />
    </div>
  );
}
