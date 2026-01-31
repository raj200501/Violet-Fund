import * as React from "react";

import { cn } from "../utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <div className="space-y-2">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--vf-ink-800)]">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface)] px-3 py-2 text-sm text-[var(--vf-ink-900)] outline-none transition duration-[var(--vf-motion-fast)] placeholder:text-[var(--vf-ink-400)] focus:border-[var(--vf-violet-400)] focus:ring-2 focus:ring-[var(--vf-violet-100)]",
            error ? "border-[var(--vf-rose-500)] focus:border-[var(--vf-rose-500)] focus:ring-[var(--vf-rose-100)]" : "",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[var(--vf-rose-600)]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--vf-ink-500)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
