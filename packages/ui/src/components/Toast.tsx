import * as React from "react";

import { cn } from "../utils";

export type ToastVariant = "info" | "success" | "warning" | "danger";

const variantStyles: Record<ToastVariant, string> = {
  info: "border-[var(--vf-violet-200)] bg-[var(--vf-violet-50)] text-[var(--vf-ink-800)]",
  success: "border-[var(--vf-emerald-200)] bg-[var(--vf-emerald-100)] text-[var(--vf-emerald-700)]",
  warning: "border-[var(--vf-amber-200)] bg-[var(--vf-amber-100)] text-[var(--vf-amber-700)]",
  danger: "border-[var(--vf-rose-200)] bg-[var(--vf-rose-100)] text-[var(--vf-rose-700)]"
};

export function Toast({ title, description, variant = "info" }: { title: string; description?: string; variant?: ToastVariant }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[var(--vf-radius-lg)] border px-4 py-3 text-sm shadow-[var(--vf-shadow-soft)]",
        variantStyles[variant]
      )}
    >
      <span className="mt-1 h-2 w-2 rounded-full bg-current" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? <p className="text-xs text-[var(--vf-ink-600)]">{description}</p> : null}
      </div>
    </div>
  );
}
