import * as React from "react";

import { cn } from "../utils";

export interface KeyValueItem {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

export interface KeyValueProps extends React.HTMLAttributes<HTMLDivElement> {
  items: KeyValueItem[];
  columns?: 1 | 2 | 3;
}

const columnStyles: Record<NonNullable<KeyValueProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 gap-4 sm:grid-cols-2",
  3: "grid-cols-1 gap-4 sm:grid-cols-3"
};

export function KeyValue({ className, items, columns = 2, ...props }: KeyValueProps) {
  return (
    <div className={cn("grid gap-3", columnStyles[columns], className)} {...props}>
      {items.map((item) => (
        <div key={item.label} className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">{item.label}</p>
          <div className="mt-2 text-sm font-semibold text-[var(--vf-ink-900)]">{item.value}</div>
          {item.hint ? <p className="mt-1 text-xs text-[var(--vf-ink-500)]">{item.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
