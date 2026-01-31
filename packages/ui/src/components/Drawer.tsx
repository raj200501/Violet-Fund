import * as React from "react";

import { cn } from "../utils";

export interface DrawerProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({ title, children, footer }: DrawerProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-full max-w-sm flex-col gap-4 border-l border-[var(--vf-border)] bg-[var(--vf-surface)] p-6 shadow-[var(--vf-shadow-medium)]"
      )}
    >
      <h3 className="text-lg font-semibold text-[var(--vf-ink-900)]">{title}</h3>
      <div className="flex-1 space-y-4">{children}</div>
      {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
    </aside>
  );
}
