import type { ReactNode } from "react";

interface StickyActionBarProps {
  children: ReactNode;
}

export default function StickyActionBar({ children }: StickyActionBarProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-3 sm:px-8">
        {children}
      </div>
    </div>
  );
}
