import Link from "next/link";

import { Badge } from "@violetfund/ui";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Tracker", href: "/tracker" },
      { label: "Verify & Improve", href: "/labeling" },
      { label: "Profile wizard", href: "/profile" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Security", href: "/" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Founder guide", href: "/" },
      { label: "Funding playbooks", href: "/" },
      { label: "Partner network", href: "/" },
      { label: "Release notes", href: "/" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="rounded-[var(--vf-radius-3xl)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-10 shadow-[var(--vf-shadow-soft)]">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-lg font-semibold text-[var(--vf-violet-700)]">VioletFund</p>
            <Badge variant="info">Funding intelligence</Badge>
          </div>
          <p className="text-sm text-[var(--vf-ink-600)]">
            VioletFund is the explainable funding command center for women founders. Discover, qualify, and act on the right
            opportunities with calm, evidence-based insights.
          </p>
          <p className="text-xs text-[var(--vf-ink-500)]">© 2024 VioletFund. All rights reserved.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">{group.title}</p>
              <div className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href} className="block transition hover:text-[var(--vf-ink-900)]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
