import * as React from "react";

import { cn } from "../utils";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  rowKey: (row: T) => string;
}

export function DataTable<T extends Record<string, string | number | React.ReactNode>>({
  columns,
  rows,
  rowKey
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--vf-surface-200)] text-xs uppercase tracking-wide text-[var(--vf-ink-500)]">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className={cn("px-4 py-3", column.className)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-[var(--vf-border)]">
              {columns.map((column) => (
                <td key={String(column.key)} className={cn("px-4 py-3 text-[var(--vf-ink-700)]", column.className)}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
