import * as React from "react";

import { cn } from "../utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--vf-radius-md)] bg-[var(--vf-surface-200)]",
        className
      )}
    />
  );
}
