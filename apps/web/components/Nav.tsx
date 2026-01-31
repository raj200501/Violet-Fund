import Link from "next/link";

import ThemeToggle from "./ThemeToggle";
import { Badge, Button } from "@violetfund/ui";

export default function Nav() {
  return (
    <nav className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xl font-semibold text-[var(--vf-violet-700)]">
          VioletFund
        </Link>
        <Badge variant="info">Funding intelligence</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[var(--vf-ink-700)]">
        <Link href="/dashboard" className="hidden text-sm md:block">
          Product
        </Link>
        <Link href="/copilot" className="hidden text-sm md:block">
          Copilot
        </Link>
        <Link href="/tracker" className="hidden text-sm md:block">
          Tracker
        </Link>
        <Link href="/labeling" className="hidden text-sm md:block">
          Verify & Improve
        </Link>
        <Link href="/profile" className="hidden text-sm md:block">
          Profile
        </Link>
        <ThemeToggle />
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">Start free</Button>
        </Link>
      </div>
    </nav>
  );
}
