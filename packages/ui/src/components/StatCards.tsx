import * as React from "react";

import { cn } from "../utils";

export interface StatCard {
  label: string;
  value: string;
  delta?: string;
  description?: string;
}

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4 shadow-[var(--vf-shadow-soft)]"
          )}
        >
          <p className="text-xs uppercase tracking-wide text-[var(--vf-ink-500)]">{stat.label}</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-[var(--vf-ink-900)]">{stat.value}</p>
            {stat.delta ? <p className="text-xs text-[var(--vf-emerald-600)]">{stat.delta}</p> : null}
          </div>
          {stat.description ? <p className="mt-2 text-xs text-[var(--vf-ink-500)]">{stat.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
