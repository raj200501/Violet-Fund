import * as React from "react";

import { cn } from "../utils";

export interface CommandItem {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
}

export function Command({ placeholder, items }: { placeholder?: string; items: CommandItem[] }) {
  const [query, setQuery] = React.useState("");
  const filteredItems = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-3 shadow-[var(--vf-shadow-soft)]">
      <input
        type="text"
        placeholder={placeholder ?? "Search commands"}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={cn(
          "mb-3 w-full rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface-200)] px-3 py-2 text-sm text-[var(--vf-ink-900)] outline-none placeholder:text-[var(--vf-ink-400)]"
        )}
      />
      <div className="space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onSelect}
            className="flex w-full items-center justify-between rounded-[var(--vf-radius-md)] px-3 py-2 text-left text-sm text-[var(--vf-ink-700)] hover:bg-[var(--vf-surface-200)]"
          >
            <span>{item.label}</span>
            {item.shortcut ? (
              <span className="text-xs text-[var(--vf-ink-500)]">{item.shortcut}</span>
            ) : null}
          </button>
        ))}
        {filteredItems.length === 0 ? (
          <p className="px-3 py-2 text-xs text-[var(--vf-ink-500)]">No commands found.</p>
        ) : null}
      </div>
    </div>
  );
}
