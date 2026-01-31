import * as React from "react";

import { cn } from "../utils";

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2 rounded-[var(--vf-radius-sm)] bg-[var(--vf-ink-900)] px-2 py-1 text-xs text-white opacity-0 shadow-[var(--vf-shadow-soft)] transition duration-[var(--vf-motion-fast)] group-hover:opacity-100"
        )}
      >
        {label}
      </span>
    </span>
  );
}
