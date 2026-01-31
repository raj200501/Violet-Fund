import * as React from "react";

import { cn } from "../utils";

export interface DropdownItem {
  label: string;
  value: string;
  description?: string;
}

export function Dropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--vf-ink-500)]">{label}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.value}>
            <button
              type="button"
              className={cn(
                "w-full rounded-[var(--vf-radius-md)] border border-transparent px-3 py-2 text-left text-sm text-[var(--vf-ink-700)] transition duration-[var(--vf-motion-fast)] hover:border-[var(--vf-border)] hover:bg-[var(--vf-surface-200)]"
              )}
            >
              <p className="font-medium">{item.label}</p>
              {item.description ? <p className="text-xs text-[var(--vf-ink-500)]">{item.description}</p> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
