import * as React from "react";

import { cn } from "../utils";

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Toolbar({ className, title, description, action, ...props }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--vf-radius-2xl)] border border-[var(--vf-border)] bg-[var(--vf-surface-100)] px-5 py-4 shadow-[var(--vf-shadow-soft)] sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {title ? <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{title}</p> : null}
        {description ? <p className="text-xs text-[var(--vf-ink-500)]">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}
