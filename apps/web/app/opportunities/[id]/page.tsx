"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AppShell from "@/components/AppShell";
import { apiFetch, safeErrorMessage } from "@/lib/api";
import {
  buildDueDates,
  demoInsights,
  demoPlan,
  flattenPlanTasks,
  CopilotPlan,
  OpportunityInsights
} from "@/lib/copilot";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfidenceMeter,
  Dialog,
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
  regions: string[];
  industries: string[];
  stage_fit: string[];
}

const demoOpportunity: Opportunity = {
  id: 120,
  title: "Aurora Women in Climate Grant",
  org: "Aurora Ventures",
  url: "https://example.com",
  funding_type: "Non-dilutive grant",
  amount_text: "$75,000",
  deadline: "Aug 28, 2026",
  eligibility_text: "Women-led, seed-stage companies with measurable climate or sustainability outcomes.",
  description:
    "Aurora Ventures provides catalytic grants for teams building measurable climate solutions. Applicants should demonstrate early traction, a community partnership, and a clear path to product-market fit.",
  raw_text:
    "Applicants must be women-led, seed-stage, and operate within North America or select global regions. Priority is given to climate and sustainability solutions with measurable outcomes.",
  regions: ["North America"],
  industries: ["Climate"],
  stage_fit: ["Seed"]
};

const ownerOptions = [
  { name: "Morgan Lee", role: "Primary founder" },
  { name: "Priya Shah", role: "Grants lead" },
  { name: "Daniel Ortiz", role: "Ops" }
];

export default function OpportunityDetail({ params }: { params: { id: string } }) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [insights, setInsights] = useState<OpportunityInsights | null>(null);
  const [plan, setPlan] = useState<CopilotPlan | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "warning">("success");
  const [error, setError] = useState<string | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null);

  const loadInsights = async (id: string, showStatus = false) => {
    const response = await apiFetch<OpportunityInsights>(`/copilot/opportunities/${id}/insights`);
    if (response.ok && response.data) {
      setInsights(response.data);
      setInsightsError(null);
      if (showStatus) {
        setStatusTone("success");
        setStatus(`Verified with ${response.data.trust.checks.length} checks.`);
      }
      return response.data;
    }
    setInsights(demoInsights);
    setInsightsError(safeErrorMessage(response, "Unable to load live insights. Showing demo insights."));
    if (showStatus) {
      setStatusTone("warning");
      setStatus(safeErrorMessage(response, "Unable to verify right now."));
    }
    return demoInsights;
  };

  useEffect(() => {
    const load = async () => {
      setPlan(null);
      setShowPlan(false);
      const response = await apiFetch<Opportunity>(`/opportunities/${params.id}`);
      if (response.ok && response.data && typeof response.data === "object") {
        setOpportunity(response.data as Opportunity);
        setError(null);
        loadInsights(params.id);
        return;
      }
      setOpportunity(demoOpportunity);
      setError(safeErrorMessage(response, "We could not load live data. Showing a curated demo opportunity."));
      setInsights(demoInsights);
    };
    load();
  }, [params.id]);

  const ensurePlan = async () => {
    if (plan) return plan;
    setIsPlanning(true);
    const response = await apiFetch<CopilotPlan>(`/copilot/opportunities/${params.id}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (response.ok && response.data) {
      setPlan(response.data);
      setIsPlanning(false);
      return response.data;
    }
    setPlan(demoPlan);
    setIsPlanning(false);
    setStatusTone("warning");
    setStatus(safeErrorMessage(response, "Unable to generate a live plan. Demo plan enabled."));
    return demoPlan;
  };

  const handleAddToTracker = async (statusValue: string) => {
    if (!opportunity) return;
    setIsSaving(true);
    const planData = await ensurePlan();
    const tasks = flattenPlanTasks(planData);
    const dueDates = buildDueDates(tasks);
    const response = await apiFetch(`/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunity_id: opportunity.id,
        status: statusValue,
        notes: insights?.summary || "",
        tasks: { items: tasks, owner: assignedOwner || undefined },
        due_dates: dueDates
      })
    });
    setIsSaving(false);
    if (response.ok) {
      setStatusTone("success");
      setStatus(`Added to tracker as ${statusValue}.`);
    } else {
      setStatusTone("warning");
      setStatus(safeErrorMessage(response, "Please log in to add to tracker."));
    }
  };

  const detailItems = useMemo(() => {
    if (!opportunity) return [];
    const extracted = insights?.extracted || {};
    return [
      { label: "Funding type", value: extracted.funding_type || opportunity.funding_type, hint: "Program type" },
      { label: "Award amount", value: extracted.amount_text || opportunity.amount_text || "Varies", hint: "Expected grant size" },
      { label: "Deadline", value: extracted.deadline || opportunity.deadline || "Rolling", hint: "Recommended to apply early" },
      {
        label: "Regions",
        value: extracted.regions?.join(", ") || opportunity.regions?.join(", ") || "Not listed",
        hint: "Eligible geographies"
      },
      {
        label: "Stage focus",
        value: extracted.stage_fit?.join(", ") || opportunity.stage_fit?.join(", ") || "Not listed",
        hint: "Stage criteria"
      },
      {
        label: "Industries",
        value: extracted.industries?.join(", ") || opportunity.industries?.join(", ") || "Not listed",
        hint: "Primary focus"
      }
    ];
  }, [insights, opportunity]);

  const trustScore = insights?.trust.trust_score ?? 0;
  const evidenceScore = insights ? Math.min(100, insights.evidence.length * 18) : 0;

  const timelineSteps = useMemo(() => {
    if (plan) {
      return flattenPlanTasks(plan)
        .slice(0, 3)
        .map((task) => ({
          title: task.title,
          time: task.due_in_days ? `In ${task.due_in_days} days` : "Next",
          description: task.why
        }));
    }
    if (insights) {
      const times = ["Today", "Next 48 hours", "This week", "Next week"];
      return insights.suggested_tasks.slice(0, 3).map((task, index) => ({
        title: task,
        time: times[index] || "Soon",
        description: task
      }));
    }
    return [];
  }, [insights, plan]);

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

  const extracted = insights?.extracted || {};
  const beforeText = `Deadline: ${extracted.deadline || "Missing"} • Amount: ${extracted.amount_text || "Missing"} • Industries: ${extracted.industries?.join(", ") || "Missing"}`;
  const afterText = `Deadline: ${extracted.deadline ? `${extracted.deadline} (verified)` : "Your correction"} • Amount: ${
    extracted.amount_text ? `${extracted.amount_text} (verified)` : "Your correction"
  } • Industries: ${extracted.industries?.join(", ") || "Your correction"}`;

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
          badges={[
            opportunity.funding_type,
            opportunity.deadline || "Rolling",
            `Trust ${trustScore || 0}`
          ]}
          action={
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => loadInsights(params.id, true)}>
                Verify
              </Button>
              <Button size="sm" onClick={async () => { await ensurePlan(); setShowPlan(true); }} disabled={isPlanning}>
                {isPlanning ? "Improving..." : "Improve"}
              </Button>
              <a href={opportunity.url} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  View source
                </Button>
              </a>
              <Button size="sm" onClick={() => handleAddToTracker("Saved")} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save opportunity"}
              </Button>
            </div>
          }
        />

        {error ? <StatusBanner tone="warning" title="Demo data enabled" description={error} /> : null}
        {insightsError ? <StatusBanner tone="warning" title="Demo insights enabled" description={insightsError} /> : null}
        {status ? <StatusBanner tone={statusTone} title={status} /> : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Surface tone="raised" className="space-y-6 p-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--vf-ink-900)]">Opportunity overview</h2>
              <p className="text-sm text-[var(--vf-ink-600)]">{insights?.summary || opportunity.description}</p>
            </div>
            <KeyValue items={detailItems} columns={2} />
            <Card className="border-[var(--vf-border-subtle)]">
              <CardHeader>
                <CardTitle>Eligibility evidence</CardTitle>
                <CardDescription>Source sentences that justify the extracted fields.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                  {(insights?.evidence || []).map((item) => (
                    <li key={`${item.label}-${item.snippet}`} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--vf-violet-500)]" />
                      <span>
                        <span className="font-semibold text-[var(--vf-ink-800)]">{item.label}: </span>
                        {item.snippet}
                      </span>
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
                <CardTitle>Trust & completeness</CardTitle>
                <CardDescription>Evidence coverage and verification checks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ConfidenceMeter score={trustScore} label="Trust score" />
                <ProgressBar value={evidenceScore} tone="primary" label="Evidence completeness" />
                <div className="space-y-2 text-xs text-[var(--vf-ink-600)]">
                  {insights?.trust.checks.map((check) => (
                    <div key={check.name} className="flex items-start gap-2">
                      <span className={`mt-1 h-2 w-2 rounded-full ${check.ok ? "bg-[var(--vf-success-500)]" : "bg-[var(--vf-warning-500)]"}`} />
                      <div>
                        <p className="font-semibold text-[var(--vf-ink-800)]">{check.name}</p>
                        <p>{check.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {insights?.trust.flags.length ? (
                  <div className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface-200)] p-3 text-xs text-[var(--vf-ink-600)]">
                    <p className="text-xs font-semibold text-[var(--vf-ink-900)]">Flags</p>
                    <ul className="mt-2 space-y-1">
                      {insights.trust.flags.map((flag) => (
                        <li key={flag}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <Surface tone="default" className="space-y-3 p-4">
              <p className="text-sm font-semibold text-[var(--vf-ink-900)]">What the AI did</p>
              <p className="text-sm text-[var(--vf-ink-600)]">
                We semantic-embed the source text, extract fields with rules, then highlight the sentences that support each
                field. This keeps the reasoning traceable and editable.
              </p>
            </Surface>
          </Surface>

          <div className="space-y-6">
            <Surface tone="hero" className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-[var(--vf-ink-900)]">Recommended next actions</h2>
              {timelineSteps.length ? <Timeline items={timelineSteps} /> : null}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => handleAddToTracker("Planned")} disabled={isSaving}>
                  {isSaving ? "Adding..." : "Send to tracker"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowOwnerDialog(true)}>
                  Assign owner
                </Button>
              </div>
              {assignedOwner ? (
                <p className="text-xs text-[var(--vf-ink-500)]">Owner: {assignedOwner}</p>
              ) : (
                <p className="text-xs text-[var(--vf-ink-500)]">Assign an owner to store with tracker tasks.</p>
              )}
              <Link href="/labeling">
                <Button size="sm" variant="ghost">
                  Go to Verify & Improve
                </Button>
              </Link>
            </Surface>

            <Surface tone="raised" className="space-y-4 p-6">
              <h3 className="text-sm font-semibold text-[var(--vf-ink-900)]">What changes when you correct fields</h3>
              <DiffViewer beforeText={beforeText} afterText={afterText} />
              <p className="text-xs text-[var(--vf-ink-500)]">
                Corrections refresh extracted fields, evidence snippets, and trust checks.
              </p>
            </Surface>
          </div>
        </div>

        {showPlan ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <Dialog
              title="Improvement plan & drafts"
              description="Generated checklist and messaging drafts for this opportunity."
              footer={
                <>
                  <Button variant="ghost" size="sm" onClick={() => setShowPlan(false)}>
                    Close
                  </Button>
                  <Button size="sm" onClick={() => handleAddToTracker("Planned")} disabled={isSaving}>
                    {isSaving ? "Adding..." : "Send to tracker"}
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                {plan?.phases.map((phase) => (
                  <div key={phase.name} className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4">
                    <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{phase.name}</p>
                    <ul className="mt-2 space-y-2 text-sm text-[var(--vf-ink-600)]">
                      {phase.tasks.map((task) => (
                        <li key={task.title}>
                          <p className="font-semibold text-[var(--vf-ink-800)]">{task.title}</p>
                          <p className="text-xs text-[var(--vf-ink-500)]">{task.why}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {plan ? (
                  <Surface tone="default" className="space-y-3 p-4">
                    <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Outreach email draft</p>
                    <p className="whitespace-pre-wrap text-xs text-[var(--vf-ink-600)]">{plan.drafts.outreach_email}</p>
                    <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Narrative bullets</p>
                    <ul className="space-y-2 text-xs text-[var(--vf-ink-600)]">
                      {plan.drafts.application_bullets.map((bullet) => (
                        <li key={bullet}>• {bullet}</li>
                      ))}
                    </ul>
                    {plan.drafts.risks.length ? (
                      <>
                        <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Risks to address</p>
                        <ul className="space-y-2 text-xs text-[var(--vf-ink-600)]">
                          {plan.drafts.risks.map((risk) => (
                            <li key={risk}>• {risk}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </Surface>
                ) : null}
              </div>
            </Dialog>
          </div>
        ) : null}

        {showOwnerDialog ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <Dialog
              title="Assign owner"
              description="Pick who will own the application tasks."
              footer={
                <Button variant="ghost" size="sm" onClick={() => setShowOwnerDialog(false)}>
                  Done
                </Button>
              }
            >
              <div className="space-y-2">
                {ownerOptions.map((owner) => (
                  <button
                    key={owner.name}
                    type="button"
                    onClick={() => {
                      setAssignedOwner(`${owner.name} · ${owner.role}`);
                      setShowOwnerDialog(false);
                    }}
                    className="flex w-full items-center justify-between rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] px-4 py-3 text-left text-sm text-[var(--vf-ink-700)] transition hover:border-[var(--vf-violet-300)]"
                  >
                    <span>{owner.name}</span>
                    <Badge variant="info">{owner.role}</Badge>
                  </button>
                ))}
              </div>
            </Dialog>
          </div>
        ) : null}
      </main>
    </AppShell>
  );
}
