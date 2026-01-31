import * as React from "react";

import { cn } from "../utils";
import { Badge } from "./Badge";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: string[];
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
}

export function PageHeader({
  className,
  eyebrow,
  title,
  description,
  badges = [],
  breadcrumbs = [],
  action,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {breadcrumbs.length ? (
        <nav className="flex flex-wrap items-center gap-2 text-xs text-[var(--vf-ink-500)]">
          {breadcrumbs.map((item, index) => (
            <span key={item.label} className="flex items-center gap-2">
              {item.href ? (
                <a className="transition hover:text-[var(--vf-ink-700)]" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 ? <span>/</span> : null}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-[var(--vf-ink-500)]">{eyebrow}</p> : null}
          <h1 className="text-3xl font-semibold text-[var(--vf-ink-900)] sm:text-4xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm text-[var(--vf-ink-600)] sm:text-base">{description}</p> : null}
          {badges.length ? (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge} variant="info">
                  {badge}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        {action ? <div className="flex items-center gap-3">{action}</div> : null}
      </div>
    </div>
  );
}
