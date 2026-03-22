"use client";

import { createContext, useContext, type ReactNode } from "react";
import type Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Lenis | null;
}) {
  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
