"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, Badge, Button, Command, Input, Popover } from "@violetfund/ui";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Copilot", href: "/copilot" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Tracker", href: "/tracker" },
  { label: "Verify & Improve", href: "/labeling" },
  { label: "Profile", href: "/profile" }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const [notifications] = useState([
    {
      title: "Copilot analysis complete",
      description: "Aurora Women in Climate Grant now has evidence snippets.",
      time: "2m ago"
    },
    {
      title: "Deadline approaching",
      description: "Catalyst Women in Tech closes in 8 days.",
      time: "Today"
    },
    {
      title: "Tracker updated",
      description: "Two tasks moved to In Progress.",
      time: "Yesterday"
    },
    {
      title: "New opportunity found",
      description: "3 new climate grants added to your queue.",
      time: "This week"
    }
  ]);

  const commandItems = useMemo(
    () => [
      { label: "Dashboard", onSelect: () => router.push("/dashboard") },
      { label: "Copilot", onSelect: () => router.push("/copilot") },
      { label: "Opportunities", onSelect: () => router.push("/opportunities") },
      { label: "Tracker", onSelect: () => router.push("/tracker") },
      { label: "Profile", onSelect: () => router.push("/profile") },
      { label: "Labeling", onSelect: () => router.push("/labeling") },
      {
        label: "Search opportunities",
        onSelect: () => {
          const query = searchValue.trim();
          router.push(query ? `/opportunities?q=${encodeURIComponent(query)}` : "/opportunities");
        }
      }
    ],
    [router, searchValue]
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--vf-border)] bg-[var(--vf-surface)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold text-[var(--vf-violet-700)]">
              VioletFund
            </Link>
            <Badge variant="info">Product demo</Badge>
          </div>
          <div className="flex flex-1 items-center gap-3">
            <Input
              placeholder="Search opportunities, founders, or tags"
              className="w-full max-w-md"
              aria-label="Search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  const query = searchValue.trim();
                  router.push(query ? `/opportunities?q=${encodeURIComponent(query)}` : "/opportunities");
                }
              }}
            />
            <Popover
              trigger={
                <Button variant="outline" size="sm" aria-label="Command palette">
                  Command
                </Button>
              }
            >
              <Command placeholder="Search commands" items={commandItems} />
            </Popover>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Popover
              trigger={
                <Button variant="ghost" size="sm">
                  Notifications
                  <Badge variant="info" className="ml-2">
                    {notifications.length}
                  </Badge>
                </Button>
              }
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">
                  Recent activity
                </p>
                <div className="space-y-3">
                  {notifications.map((item) => (
                    <div key={item.title} className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{item.title}</p>
                      <p className="text-xs text-[var(--vf-ink-600)]">{item.description}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--vf-ink-400)]">
                        {item.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Popover>
            <Avatar name="Morgan Lee" size="sm" status="online" />
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 pb-4 text-sm font-medium text-[var(--vf-ink-600)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1 transition hover:bg-[var(--vf-surface-200)] ${
                pathname.startsWith(item.href) ? "bg-[var(--vf-surface-200)] text-[var(--vf-ink-900)]" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  );
}
