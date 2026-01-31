import * as React from "react";

import { cn } from "../utils";

export interface DialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({ title, description, children, footer }: DialogProps) {
  return (
    <div className="rounded-[var(--vf-radius-xl)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-6 shadow-[var(--vf-shadow-medium)]">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[var(--vf-ink-900)]">{title}</h3>
        {description ? <p className="text-sm text-[var(--vf-ink-600)]">{description}</p> : null}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
      {footer ? <div className={cn("mt-6 flex justify-end gap-2")}>{footer}</div> : null}
    </div>
  );
}
