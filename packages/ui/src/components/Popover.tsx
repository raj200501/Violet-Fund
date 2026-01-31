import * as React from "react";

import { cn } from "../utils";

export function Popover({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <details className="group relative">
      <summary className="list-none [&::-webkit-details-marker]:hidden">{trigger}</summary>
      <div
        className={cn(
          "absolute right-0 z-20 mt-2 w-64 rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4 shadow-[var(--vf-shadow-medium)]"
        )}
      >
        {children}
      </div>
    </details>
  );
}
