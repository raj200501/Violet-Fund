import * as React from "react";

import { cn } from "../utils";

export type StatusTone = "info" | "success" | "warning" | "danger";

const toneStyles: Record<StatusTone, string> = {
  info: "border-[var(--vf-violet-200)] bg-[var(--vf-violet-50)] text-[var(--vf-ink-700)]",
  success: "border-[var(--vf-emerald-200)] bg-[var(--vf-emerald-100)] text-[var(--vf-emerald-700)]",
  warning: "border-[var(--vf-amber-200)] bg-[var(--vf-amber-100)] text-[var(--vf-amber-700)]",
  danger: "border-[var(--vf-rose-200)] bg-[var(--vf-rose-100)] text-[var(--vf-rose-700)]"
};

export interface StatusBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: StatusTone;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function StatusBanner({ className, tone = "info", title, description, action, ...props }: StatusBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--vf-radius-xl)] border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      <div>
        <p className="font-semibold">{title}</p>
        {description ? <p className="text-xs opacity-80 sm:text-sm">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
