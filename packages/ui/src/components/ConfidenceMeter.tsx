import * as React from "react";

import { cn } from "../utils";

export function ConfidenceMeter({ score, label }: { score: number; label?: string }) {
  const clamped = Math.min(100, Math.max(0, score));
  const tone =
    clamped >= 80 ? "bg-[var(--vf-emerald-500)]" : clamped >= 60 ? "bg-[var(--vf-violet-500)]" : "bg-[var(--vf-amber-500)]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[var(--vf-ink-500)]">
        <span>{label ?? "Confidence score"}</span>
        <span>{clamped}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--vf-surface-200)]">
        <div className={cn("h-2 rounded-full transition-all", tone)} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
