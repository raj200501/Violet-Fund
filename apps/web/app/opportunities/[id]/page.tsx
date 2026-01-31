"use client";

import { useEffect, useMemo, useState } from "react";

import AppShell from "@/components/AppShell";
import { apiFetch, safeErrorMessage } from "@/lib/api";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfidenceMeter,
  DiffViewer,
  KeyValue,
  PageHeader,
  ProgressBar,
  StatusBanner,
  Surface,
  Timeline
} from "@violetfund/ui";

interface Opportunity {
  id: number;
  title: string;
  org: string;
  url: string;
  funding_type: string;
  amount_text: string | null;
  deadline: string | null;
  eligibility_text: string;
  description: string;
  raw_text: string;
}

const demoOpportunity: Opportunity = {
  id: 120,
  title: "Aurora Women in Climate Grant",
  org: "Aurora Ventures",
  url: "https://example.com",
  funding_type: "Non-dilutive grant",
  amount_text: "$75,000",
  deadline: "Aug 28",
  eligibility_text: "Women-led, seed-stage companies with measurable climate or sustainability outcomes.",
  description:
    "Aurora Ventures provides catalytic grants for teams building measurable climate solutions. Applicants should demonstrate early traction, a community partnership, and a clear path to product-market fit.",
  raw_text:
    "Applicants must be women-led, seed-stage, and operate within North America or select global regions. Priority is given to climate and sustainability solutions with measurable outcomes."
};

const timelineSteps = [
  {
    title: "Eligibility checklist",
    time: "Today",
    description: "Confirm women-led status, climate impact metrics, and stage fit."
  },
  {
    title: "Narrative refinement",
    time: "Next 2 days",
    description: "Draft a one-page impact narrative aligned to Aurora's climate rubric."
  },
  {
    title: "Financial validation",
    time: "Next week",
    description: "Prepare traction metrics, runway, and budget alignment for grant reviewers."
  }
];

const evidencePoints = [
  "Mentions women-led leadership in founding team section.",
  "Impact metrics include emissions reduction and community benefit.",
  "Eligible geography identified in program description.",
  "Seed-stage funding noted in eligibility block."
];

export default function OpportunityDetail({ params }: { params: { id: string } }) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "warning">("success");
  const [error, setError] = useState<string | null>(null);
  const [collaborationNote] = useState("Collaborators coming soon.");

  useEffect(() => {
    const load = async () => {
      const response = await apiFetch<Opportunity>(`/opportunities/${params.id}`);
      if (response.ok && response.data && typeof response.data === "object") {
        setOpportunity(response.data as Opportunity);
        return;
      }
      setOpportunity(demoOpportunity);
      setError(safeErrorMessage(response, "We could not load live data. Showing a curated demo opportunity."));
    };
    load();
  }, [params.id]);

  const createApplication = async (statusValue: string) => {
    if (!opportunity) return;
    const response = await apiFetch(`/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunity_id: opportunity.id,
        status: statusValue,
        notes: "",
        tasks: {
          checklist: ["Confirm eligibility", "Draft application", "Submit and follow up"]
        },
        due_dates: {}
      })
    });
    if (response.ok) {
      setStatusTone("success");
      setStatus(`Added to tracker as ${statusValue}.`);
    } else {
      setStatusTone("warning");
      setStatus(safeErrorMessage(response, "Please log in to add to tracker."));
    }
  };

  const detailItems = useMemo(
    () =>
      opportunity
        ? [
            { label: "Funding type", value: opportunity.funding_type, hint: "Non-dilutive or accelerator" },
            { label: "Award amount", value: opportunity.amount_text || "Varies", hint: "Expected grant size" },
            { label: "Deadline", value: opportunity.deadline || "Rolling", hint: "Recommended to apply early" },
            { label: "Region", value: "North America + global pilots", hint: "Evidence supports eligibility" },
            { label: "Stage focus", value: "Seed to Series A", hint: "Based on program guide" },
            { label: "Match confidence", value: "86%", hint: "Derived from profile signals" }
          ]
        : [],
    [opportunity]
  );

  if (!opportunity) {
    return (
      <AppShell>
        <main className="space-y-6">
          <PageHeader eyebrow="Opportunity" title="Loading opportunity" description="Fetching opportunity details." />
          <Surface tone="raised" className="p-6">
            <p className="text-sm text-[var(--vf-ink-600)]">Loading details...</p>
          </Surface>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="space-y-10">
        <PageHeader
          eyebrow="Opportunity"
          title={opportunity.title}
          description={opportunity.org}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Opportunities", href: "/opportunities" },
            { label: opportunity.title }
          ]}
          badges={[opportunity.funding_type, opportunity.deadline || "Rolling", "Explainable"]}
          action={
            <div className="flex flex-wrap gap-3">
              <a href={opportunity.url} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  View source
                </Button>
              </a>
              <Button size="sm" onClick={() => createApplication("Saved")}>Save opportunity</Button>
            </div>
          }
        />

        {error ? (
          <StatusBanner tone="warning" title="Demo data enabled" description={error} />
        ) : null}
        {status ? <StatusBanner tone={statusTone} title={status} /> : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Surface tone="raised" className="space-y-6 p-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--vf-ink-900)]">Opportunity overview</h2>
              <p className="text-sm text-[var(--vf-ink-600)]">{opportunity.description}</p>
            </div>
            <KeyValue items={detailItems} columns={2} />
            <Card className="border-[var(--vf-border-subtle)]">
              <CardHeader>
                <CardTitle>Eligibility evidence</CardTitle>
                <CardDescription>Highlights extracted from the source application guide.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                  {evidencePoints.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--vf-violet-500)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface-200)] p-4 text-xs text-[var(--vf-ink-700)]">
                  {opportunity.eligibility_text}
                </div>
              </CardContent>
            </Card>
            <Card className="border-[var(--vf-border-subtle)]">
              <CardHeader>
                <CardTitle>Funding confidence</CardTitle>
                <CardDescription>How aligned your profile is with the program criteria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ConfidenceMeter score={86} label="Match confidence" />
                <ProgressBar value={74} tone="warning" label="Evidence completeness" />
                <ProgressBar value={90} tone="success" label="Mission alignment" />
              </CardContent>
            </Card>
          </Surface>

          <div className="space-y-6">
            <Surface tone="hero" className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-[var(--vf-ink-900)]">Recommended next actions</h2>
              <Timeline items={timelineSteps} />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => createApplication("Planned")}>Add to tracker</Button>
                <Button variant="outline" size="sm" disabled title={collaborationNote}>
                  Assign owner
                </Button>
              </div>
              <p className="text-xs text-[var(--vf-ink-500)]">{collaborationNote}</p>
            </Surface>

            <Surface tone="raised" className="space-y-4 p-6">
              <h3 className="text-sm font-semibold text-[var(--vf-ink-900)]">Evidence diff preview</h3>
              <DiffViewer
                beforeText="Women-led startups with a climate focus are eligible. Priority for seed-stage teams."
                afterText="Women-led startups with a climate focus are eligible. Priority for seed-stage teams with measurable impact and community partnerships."
              />
              <p className="text-xs text-[var(--vf-ink-500)]">
                Use the labeling workflow to update evidence and improve confidence scores.
              </p>
            </Surface>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
