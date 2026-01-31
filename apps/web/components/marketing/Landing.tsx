import Link from "next/link";

import {
  ActivityFeed,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  ProgressBar,
  SectionHeader,
  StatCards,
  Surface,
  Timeline
} from "@violetfund/ui";
import Footer from "./Footer";

const heroMetrics = [
  {
    label: "Active opportunities",
    value: "1,280",
    delta: "+18%",
    helper: "Seed, grant, and accelerator programs tracked daily.",
    progress: 78,
    tone: "positive" as const
  },
  {
    label: "Founder signal coverage",
    value: "92%",
    delta: "Top quartile",
    helper: "Profile completeness calibrated to funding fit.",
    progress: 92,
    tone: "default" as const
  },
  {
    label: "Time saved per week",
    value: "6.2 hrs",
    delta: "-24%",
    helper: "Automated screening + explainable evidence.",
    progress: 64,
    tone: "warning" as const
  }
];

const trustLogos = ["ImpactHub", "Catalyst", "Aurora Ventures", "Northwind", "Fierce Labs", "Project Bloom"];

const productModules = [
  {
    title: "Explainable match engine",
    description: "See the exact sentences used to tag eligibility, deadlines, and award amounts.",
    bullets: [
      "Evidence snippets tied to each extracted field",
      "Deadline, amount, and region detection",
      "Trust checks you can verify and edit"
    ]
  },
  {
    title: "Founder readiness workspace",
    description: "Fill the profile once, then see which signals raise match quality.",
    bullets: [
      "Recommendation quality meter tied to fields",
      "Suggested edits for missing eligibility data",
      "Verify & Improve queue with before/after impact"
    ]
  },
  {
    title: "Application pipeline",
    description: "Convert any opportunity into a checklist with drafts and due dates.",
    bullets: [
      "Plan phases with tasks and reasons",
      "Tracker stages from Saved to Submitted",
      "Draft outreach email and narrative bullets"
    ]
  }
];

const featureHighlights = [
  {
    title: "Founder-first filters",
    description: "Filter by stage, region, and program type without losing nuance for women-led teams.",
    tags: ["Stage fit", "Program type", "Region coverage"]
  },
  {
    title: "Evidence-first UI",
    description: "Every recommendation shows the lines that justify the match so you can verify quickly.",
    tags: ["Evidence snippets", "Trust checks", "Editable fields"]
  },
  {
    title: "Fast review flow",
    description: "Analyze, verify, and plan in minutes with clear steps and focused panels.",
    tags: ["Three-step copilot", "Focused panels", "Clear actions"]
  },
  {
    title: "Dark mode surfaces",
    description: "Layered surfaces stay legible in both light and dark modes.",
    tags: ["Layered panels", "Soft borders", "Accessible contrast"]
  }
];

const workflowSteps = [
  {
    title: "Profile calibration",
    time: "Week 1",
    description: "Capture traction, team composition, and mission signals to weight top opportunities."
  },
  {
    title: "Explainable ranking",
    time: "Week 2",
    description: "Review the curated queue with highlighted evidence, confidence meters, and risk flags."
  },
  {
    title: "Pipeline execution",
    time: "Ongoing",
    description: "Convert high-fit recommendations into focused application sprints and follow-ups."
  }
];

const activityItems = [
  {
    title: "Updated confidence scores",
    description: "New data from your profile raised three grants to the top of the queue.",
    time: "2 hours ago"
  },
  {
    title: "Accelerator window opens",
    description: "Catalyst Women in Tech is now accepting applications until Aug 30.",
    time: "Yesterday"
  },
  {
    title: "Evidence detected",
    description: "Found eligibility signals in 12 new programs across Europe.",
    time: "Monday"
  }
];

const pricingTiers = [
  {
    title: "Founder",
    price: "$0",
    description: "Early-stage founders getting organized.",
    bullets: [
      "10 opportunities tracked",
      "Weekly confidence refresh",
      "Single-user workspace",
      "Email support"
    ],
    cta: "Start free"
  },
  {
    title: "Growth",
    price: "$69",
    description: "Seed-stage teams applying regularly.",
    bullets: [
      "Unlimited opportunities",
      "Explainable match evidence",
      "Kanban + analytics views",
      "Priority support"
    ],
    cta: "Upgrade to Growth",
    featured: true
  },
  {
    title: "Portfolio",
    price: "$240",
    description: "Accelerators and advisors supporting cohorts.",
    bullets: [
      "Multi-founder dashboards",
      "Shared labeling workflows",
      "Custom evidence tuning",
      "Dedicated CSM"
    ],
    cta: "Talk to sales"
  }
];

const faqs = [
  {
    question: "How does VioletFund score opportunities?",
    answer:
      "We combine structured profile signals with natural-language evidence to compute a confidence score. Every score includes the factors that influenced it so founders can act quickly."
  },
  {
    question: "What data is required to get started?",
    answer:
      "Basic profile data such as stage, location, traction, and impact focus. The system highlights missing fields and suggests edits to raise match quality."
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Yes. Growth and Portfolio plans support shared workspaces, review queues, and delegation workflows."
  },
  {
    question: "Does VioletFund support dark mode?",
    answer:
      "Absolutely. The interface is designed with layered surfaces and subtle contrast for both light and dark environments."
  }
];

const stats = [
  { label: "Opportunities monitored", value: "1,280", delta: "+18%", description: "Curated daily with founder-first filters." },
  { label: "Median match confidence", value: "84%", delta: "+6%", description: "Driven by profile completeness and evidence quality." },
  { label: "Hours saved per founder", value: "6.2", delta: "Weekly", description: "Auto-filtering and explainable summaries." }
];

export default function Landing() {
  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-[var(--vf-radius-3xl)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-10 shadow-[var(--vf-shadow-medium)] md:p-14">
        <div className="absolute inset-0 surface-hero" />
        <div className="absolute inset-0 opacity-40 surface-noise" />
        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="info">Verified funding copilot</Badge>
            <h1 className="text-4xl font-semibold text-[var(--vf-ink-900)] sm:text-5xl">
              Paste a grant link. We extract eligibility, highlight evidence, and generate a to-do plan.
            </h1>
            <p className="text-lg text-[var(--vf-ink-600)]">
              VioletFund turns funding pages into structured fields, trust checks, and application tasks. Review what was found,
              correct missing fields, and move straight into a tracker-ready plan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/signup">
                <Button size="lg">Start your funding plan</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View demo dashboard
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--vf-ink-500)]">
              <span>AA contrast</span>
              <span>•</span>
              <span>Explainable AI</span>
              <span>•</span>
              <span>Founder-first filters</span>
            </div>
          </div>
          <div className="grid gap-4">
            {heroMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Trusted"
          title="Loved by accelerators, funds, and founder communities"
          description="VioletFund is built with the teams who help founders navigate funding."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustLogos.map((logo) => (
            <Surface key={logo} tone="raised" className="flex items-center justify-center px-6 py-8 text-sm font-semibold">
              {logo}
            </Surface>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Product"
          title="Every signal, surfaced with evidence"
          description="Calm density so you always know what matters, why it matters, and what to do next."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {productModules.map((module) => (
            <Card key={module.title} className="gradient-card border-none">
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                  {module.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--vf-violet-500)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Workflow"
            title="Explainable matching, delivered in a focused flow"
            description="Move from discovery to execution with a guided three-step journey."
          />
          <Timeline items={workflowSteps} />
        </div>
        <Surface tone="hero" className="space-y-6 p-8">
          <SectionHeader
            eyebrow="Signals"
            title="Recommendation quality meter"
            description="Track how close your profile is to high-confidence matches."
          />
          <ProgressBar value={82} tone="primary" label="Recommendation quality" />
          <ProgressBar value={68} tone="warning" label="Funding readiness" />
          <ProgressBar value={92} tone="success" label="Evidence coverage" />
          <div className="rounded-[var(--vf-radius-xl)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Suggested next steps</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--vf-ink-600)]">
              <li>Share traction metrics to unlock 12 additional accelerators.</li>
              <li>Upload ESG or impact documentation for 8 climate grants.</li>
              <li>Confirm women-owned certification status to increase match score by 6%.</li>
            </ul>
          </div>
        </Surface>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Highlights"
          title="Designed for fast verification"
          description="Every panel is tuned for quick review, evidence checks, and next-step clarity."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {featureHighlights.map((feature) => (
            <Surface key={feature.title} tone="raised" className="space-y-4 p-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--vf-ink-900)]">{feature.title}</h3>
                <p className="mt-2 text-sm text-[var(--vf-ink-600)]">{feature.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--vf-ink-600)]">
                {feature.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--vf-border)] px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </Surface>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <Surface tone="hero" className="space-y-6 p-8">
          <SectionHeader
            eyebrow="Live activity"
            title="Daily updates with context"
            description="Stay ahead of deadlines with evidence-based highlights."
          />
          <ActivityFeed items={activityItems} />
        </Surface>
        <Surface tone="raised" className="space-y-6 p-8">
          <SectionHeader
            eyebrow="Momentum"
            title="Founder outcomes that compound"
            description="Teams using VioletFund report higher-quality applications with less research time."
          />
          <StatCards stats={stats} />
        </Surface>
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Pricing"
          title="Plans that scale with your funding journey"
          description="Start free, and upgrade when you are ready for deeper insights."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Surface
              key={tier.title}
              tone={tier.featured ? "hero" : "raised"}
              className={`space-y-5 p-6 ${tier.featured ? "border-[var(--vf-violet-200)]" : ""}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--vf-ink-900)]">{tier.title}</h3>
                  {tier.featured ? <Badge variant="info">Most popular</Badge> : null}
                </div>
                <p className="text-3xl font-semibold text-[var(--vf-ink-900)]">
                  {tier.price}
                  <span className="text-sm font-normal text-[var(--vf-ink-500)]">/month</span>
                </p>
                <p className="text-sm text-[var(--vf-ink-600)]">{tier.description}</p>
              </div>
              <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                {tier.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--vf-violet-500)]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <Button variant={tier.featured ? "primary" : "outline"} className="w-full">
                {tier.cta}
              </Button>
            </Surface>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Surface tone="raised" className="space-y-6 p-8">
          <SectionHeader
            eyebrow="FAQ"
            title="Common questions"
            description="We are here to support founders at every step."
          />
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4">
                <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{faq.question}</p>
                <p className="mt-2 text-sm text-[var(--vf-ink-600)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Surface>
        <Surface tone="hero" className="space-y-6 p-8">
          <SectionHeader
            eyebrow="Ready"
            title="Launch your funding plan today"
            description="Guided, explainable, and always founder-first."
          />
          <div className="space-y-4 text-sm text-[var(--vf-ink-600)]">
            <p>Get a curated list of opportunities within 24 hours.</p>
            <p>See every eligibility signal and highlight that drove the match.</p>
            <p>Track every application with a calm, data-rich pipeline.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth/signup">
              <Button size="lg">Start free</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Preview dashboard
              </Button>
            </Link>
          </div>
        </Surface>
      </section>

      <Footer />
    </div>
  );
}
