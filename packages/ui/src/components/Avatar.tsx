import * as React from "react";

import { cn } from "../utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-14 w-14 text-lg"
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "away";
}

const statusStyles: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-[var(--vf-emerald-500)]",
  offline: "bg-[var(--vf-ink-400)]",
  away: "bg-[var(--vf-amber-500)]"
};

export function Avatar({ className, name, src, size = "md", status, ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={cn("relative inline-flex items-center", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full border border-[var(--vf-border)] bg-[var(--vf-surface-200)] font-semibold text-[var(--vf-ink-600)]",
          sizeStyles[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--vf-surface)]",
            statusStyles[status]
          )}
        />
      ) : null}
    </div>
  );
}
