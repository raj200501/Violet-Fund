import * as React from "react";

import { cn } from "../utils";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--vf-surface-200)] text-[var(--vf-ink-700)]",
  success: "bg-[var(--vf-emerald-100)] text-[var(--vf-emerald-700)]",
  warning: "bg-[var(--vf-amber-100)] text-[var(--vf-amber-700)]",
  danger: "bg-[var(--vf-rose-100)] text-[var(--vf-rose-700)]",
  info: "bg-[var(--vf-violet-100)] text-[var(--vf-violet-700)]"
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
