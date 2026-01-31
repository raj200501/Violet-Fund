import * as React from "react";

import { cn } from "../utils";

export type SurfaceTone = "default" | "raised" | "sunken" | "inset" | "hero";

const toneStyles: Record<SurfaceTone, string> = {
  default: "bg-[var(--vf-surface)]",
  raised: "bg-[var(--vf-surface-100)] shadow-[var(--vf-shadow-soft)]",
  sunken: "bg-[var(--vf-surface-200)]",
  inset: "bg-[var(--vf-surface-300)]",
  hero: "bg-[var(--vf-surface-100)] shadow-[var(--vf-shadow-medium)]"
};

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: SurfaceTone;
  bordered?: boolean;
}

export function Surface({ className, tone = "default", bordered = true, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--vf-radius-2xl)]",
        toneStyles[tone],
        bordered ? "border border-[var(--vf-border)]" : "border border-transparent",
        className
      )}
      {...props}
    />
  );
}
