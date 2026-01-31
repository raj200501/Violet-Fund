"use client";

import Link from "next/link";

import { Button } from "@violetfund/ui";

export default function GlobalError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--vf-surface-100)] px-6 py-16">
      <div className="w-full max-w-xl rounded-[var(--vf-radius-2xl)] border border-[var(--vf-border)] bg-white p-8 text-center shadow-[var(--vf-shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--vf-ink-500)]">
          VioletFund
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--vf-ink-900)]">Something went wrong</h1>
        <p className="mt-3 text-sm text-[var(--vf-ink-600)]">
          The page hit an unexpected snag. Reload the page or head back to your dashboard to continue.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
