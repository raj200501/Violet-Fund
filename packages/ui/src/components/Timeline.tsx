import * as React from "react";

import { cn } from "../utils";

export interface TimelineItem {
  title: string;
  time: string;
  description: string;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={`${item.title}-${item.time}`} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--vf-violet-600)]" />
            {index < items.length - 1 ? (
              <span className="mt-1 h-full w-px flex-1 bg-[var(--vf-border)]" aria-hidden />
            ) : null}
          </div>
          <div className={cn("rounded-[var(--vf-radius-md)] bg-[var(--vf-surface)] p-3")}>
            <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{item.title}</p>
            <p className="text-xs text-[var(--vf-ink-500)]">{item.time}</p>
            <p className="mt-2 text-xs text-[var(--vf-ink-600)]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
