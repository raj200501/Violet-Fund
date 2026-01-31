import * as React from "react";

export interface ActivityItem {
  title: string;
  time: string;
  detail: string;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-4 rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4">
      {items.map((item) => (
        <div key={`${item.title}-${item.time}`} className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-[var(--vf-emerald-500)]" />
          <div>
            <p className="text-sm font-medium text-[var(--vf-ink-900)]">{item.title}</p>
            <p className="text-xs text-[var(--vf-ink-500)]">{item.time}</p>
            <p className="mt-1 text-xs text-[var(--vf-ink-600)]">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
