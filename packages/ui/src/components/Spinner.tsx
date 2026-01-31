import * as React from "react";

import { cn } from "../utils";

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";

  return (
    <div className={cn("inline-flex items-center justify-center", sizeClasses)}>
      <span className={cn("h-full w-full animate-spin rounded-full border-2 border-[var(--vf-violet-200)] border-t-[var(--vf-violet-600)]")} />
    </div>
  );
}
