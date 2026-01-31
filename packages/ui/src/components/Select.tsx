import * as React from "react";

import { cn } from "../utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, id, options, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <div className="space-y-2">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--vf-ink-800)]">
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface)] px-3 py-2 text-sm text-[var(--vf-ink-900)] outline-none transition duration-[var(--vf-motion-fast)] focus:border-[var(--vf-violet-400)] focus:ring-2 focus:ring-[var(--vf-violet-100)]",
            error ? "border-[var(--vf-rose-500)] focus:border-[var(--vf-rose-500)] focus:ring-[var(--vf-rose-100)]" : "",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-xs text-[var(--vf-rose-600)]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--vf-ink-500)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
