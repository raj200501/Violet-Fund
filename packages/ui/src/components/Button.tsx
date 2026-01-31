import * as React from "react";

import { cn } from "../utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--vf-violet-600)] text-white shadow-[var(--vf-shadow-soft)] hover:bg-[var(--vf-violet-700)] focus-visible:ring-[var(--vf-violet-400)]",
  secondary:
    "bg-[var(--vf-surface-200)] text-[var(--vf-ink-900)] hover:bg-[var(--vf-surface-300)] focus-visible:ring-[var(--vf-surface-300)]",
  ghost:
    "bg-transparent text-[var(--vf-ink-700)] hover:bg-[var(--vf-surface-200)] focus-visible:ring-[var(--vf-surface-300)]",
  outline:
    "border border-[var(--vf-border)] text-[var(--vf-ink-800)] hover:border-[var(--vf-violet-400)] focus-visible:ring-[var(--vf-violet-400)]",
  destructive:
    "bg-[var(--vf-rose-600)] text-white hover:bg-[var(--vf-rose-700)] focus-visible:ring-[var(--vf-rose-400)]"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--vf-radius-md)] font-medium transition duration-[var(--vf-motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
      {children}
    </button>
  )
);

Button.displayName = "Button";
