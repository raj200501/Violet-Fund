import * as React from "react";

import { cn } from "../utils";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  delta?: string;
  helper?: string;
  progress?: number;
  tone?: "default" | "positive" | "warning";
}

const toneStyles: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "border-[var(--vf-border)]",
  positive: "border-[var(--vf-emerald-200)]",
  warning: "border-[var(--vf-amber-200)]"
};

export function MetricCard({
  className,
  label,
  value,
  delta,
  helper,
  progress,
  tone = "default",
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-[var(--vf-radius-2xl)] border bg-[var(--vf-surface)] p-5 shadow-[var(--vf-shadow-soft)]",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--vf-ink-900)]">{value}</p>
        </div>
        {delta ? <Badge variant={tone === "positive" ? "success" : tone === "warning" ? "warning" : "info"}>{delta}</Badge> : null}
      </div>
      {helper ? <p className="text-sm text-[var(--vf-ink-600)]">{helper}</p> : null}
      {typeof progress === "number" ? <ProgressBar value={progress} tone={tone === "positive" ? "success" : tone === "warning" ? "warning" : "primary"} /> : null}
    </div>
  );
}
