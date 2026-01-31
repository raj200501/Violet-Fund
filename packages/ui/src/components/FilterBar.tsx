import * as React from "react";

import { Button } from "./Button";
import { Input } from "./Input";

export interface FilterBarProps {
  searchPlaceholder?: string;
  filters: Array<{ label: string; value: string }>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  activeFilters?: string[];
  onToggleFilter?: (value: string) => void;
  onSaveView?: () => void;
}

export function FilterBar({
  searchPlaceholder,
  filters,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeFilters,
  onToggleFilter,
  onSaveView
}: FilterBarProps) {
  const isControlled = typeof searchValue === "string" && typeof onSearchChange === "function";
  const [internalValue, setInternalValue] = React.useState("");
  const value = isControlled ? searchValue : internalValue;
  const selectedFilters = activeFilters ?? [];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-3">
      <div className="min-w-[220px] flex-1">
        <Input
          placeholder={searchPlaceholder ?? "Search opportunities"}
          value={value}
          onChange={(event) => {
            if (isControlled) {
              onSearchChange?.(event.target.value);
            } else {
              setInternalValue(event.target.value);
              onSearchChange?.(event.target.value);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearchSubmit?.(value);
            }
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilters.includes(filter.value) ? "primary" : "ghost"}
            size="sm"
            onClick={() => onToggleFilter?.(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={onSaveView}>
        Save view
      </Button>
    </div>
  );
}
