import * as React from "react";

import { cn } from "../utils";

export interface SegmentedOption {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ className, options, value, onChange, ...props }: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface-100)] p-1 shadow-[var(--vf-shadow-soft)]",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-2 rounded-[var(--vf-radius-md)] px-3 py-2 text-xs font-semibold transition duration-[var(--vf-motion-fast)]",
            value === option.value
              ? "bg-[var(--vf-surface)] text-[var(--vf-ink-900)] shadow-[var(--vf-shadow-soft)]"
              : "text-[var(--vf-ink-500)] hover:text-[var(--vf-ink-700)]"
          )}
        >
          {option.icon ? <span className="text-sm">{option.icon}</span> : null}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
