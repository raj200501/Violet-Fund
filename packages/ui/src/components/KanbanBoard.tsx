import * as React from "react";

import { Badge } from "./Badge";

export interface KanbanItem {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

export function KanbanBoard({ columns }: { columns: KanbanColumn[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((column) => (
        <div key={column.id} className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--vf-ink-800)]">{column.title}</h3>
            <Badge variant="info">{column.items.length}</Badge>
          </div>
          <div className="space-y-3">
            {column.items.map((item) => (
              <div
                key={item.id}
                className="rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface-100)] p-3"
              >
                <p className="text-sm font-medium text-[var(--vf-ink-900)]">{item.title}</p>
                <p className="text-xs text-[var(--vf-ink-500)]">{item.subtitle}</p>
                {item.tag ? (
                  <Badge variant="default" className="mt-2">
                    {item.tag}
                  </Badge>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
