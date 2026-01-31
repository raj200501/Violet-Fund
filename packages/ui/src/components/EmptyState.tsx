import * as React from "react";

import { cn } from "../utils";
import { Button } from "./Button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  className,
  title,
  description,
  actionLabel,
  onAction,
  icon,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[var(--vf-radius-2xl)] border border-dashed border-[var(--vf-border)] bg-[var(--vf-surface-100)] px-6 py-10 text-center",
        className
      )}
      {...props}
    >
      {icon ? <div className="text-3xl text-[var(--vf-ink-400)]">{icon}</div> : null}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-[var(--vf-ink-900)]">{title}</p>
        {description ? <p className="text-sm text-[var(--vf-ink-600)]">{description}</p> : null}
      </div>
      {actionLabel ? (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
