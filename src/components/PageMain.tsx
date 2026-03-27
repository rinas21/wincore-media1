import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageMainProps = {
  children: ReactNode;
  className?: string;
  /** Home hero is full-bleed; inner pages need space under fixed header */
  variant?: "home" | "inner";
};

export default function PageMain({ children, className, variant = "inner" }: PageMainProps) {
  return (
    <main
      className={cn(
        "bg-background text-foreground min-h-screen",
        variant === "inner" && "is-inner-page",
        className,
      )}
    >
      {children}
    </main>
  );
}
