import * as React from "react";

export interface DiffRow {
  label: string;
  before: string;
  after: string;
}

export function DiffViewer({ rows }: { rows: DiffRow[] }) {
  return (
    <div className="space-y-3 rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-3 md:grid-cols-3">
          <div className="text-sm font-medium text-[var(--vf-ink-700)]">{row.label}</div>
          <div className="rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface-200)] p-2 text-xs text-[var(--vf-ink-600)]">
            {row.before}
          </div>
          <div className="rounded-[var(--vf-radius-md)] border border-[var(--vf-violet-200)] bg-[var(--vf-violet-50)] p-2 text-xs text-[var(--vf-ink-700)]">
            {row.after}
          </div>
        </div>
      ))}
    </div>
  );
}
