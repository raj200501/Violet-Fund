import * as React from "react";

import { cn } from "../utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ className, eyebrow, title, description, action, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-semibold text-[var(--vf-ink-900)] sm:text-3xl">{title}</h2>
        {description ? <p className="text-sm text-[var(--vf-ink-600)] sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}
