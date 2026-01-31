import * as React from "react";

import { cn } from "../utils";

export interface TabsProps {
  tabs: Array<{ value: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
}

export function Tabs({ tabs, value, onValueChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-full bg-[var(--vf-surface-200)] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition duration-[var(--vf-motion-fast)]",
            value === tab.value
              ? "bg-[var(--vf-surface)] text-[var(--vf-ink-900)] shadow-[var(--vf-shadow-soft)]"
              : "text-[var(--vf-ink-600)] hover:text-[var(--vf-ink-900)]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
