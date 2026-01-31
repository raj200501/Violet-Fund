import * as React from "react";

import { cn } from "../utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  tone?: "primary" | "success" | "warning" | "danger";
  label?: string;
}

const toneStyles: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  primary: "bg-[var(--vf-violet-600)]",
  success: "bg-[var(--vf-emerald-500)]",
  warning: "bg-[var(--vf-amber-500)]",
  danger: "bg-[var(--vf-rose-600)]"
};

export function ProgressBar({ className, value, max = 100, tone = "primary", label, ...props }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = (clamped / max) * 100;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label ? <div className="text-xs font-semibold text-[var(--vf-ink-500)]">{label}</div> : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--vf-surface-300)]">
        <div
          className={cn("h-full rounded-full transition-all duration-[var(--vf-motion-medium)]", toneStyles[tone])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--vf-ink-500)]">
        <span>{Math.round(percentage)}%</span>
        <span>
          {clamped} / {max}
        </span>
      </div>
    </div>
  );
}
