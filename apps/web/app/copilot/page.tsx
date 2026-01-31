"use client";

import { useMemo, useState } from "react";
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
  Input,
  KeyValue,
  PageHeader,
  ProgressBar,
  SectionHeader,
  StatusBanner,
  Surface,
  Tabs,
  Textarea
} from "@violetfund/ui";

interface OpportunitySummary {
  id: number;
  title: string;
  org: string;
  url: string;
}

const demoOpportunity: OpportunitySummary = {
  id: 120,
  title: "Aurora Women in Climate Grant",
  org: "Aurora Ventures",
  url: "https://example.com"
};

const tabs = [
  { value: "url", label: "URL" },
  { value: "text", label: "Paste text" }
];

export default function CopilotPage() {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [rawText, setRawText] = useState("");
  const [insights, setInsights] = useState<OpportunityInsights | null>(null);
  const [plan, setPlan] = useState<CopilotPlan | null>(null);
  const [opportunity, setOpportunity] = useState<OpportunitySummary | null>(null);
  const [status, setStatus] = useState<{ tone: "success" | "warning" | "info"; message: string } | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const currentStep = plan ? 3 : insights ? 2 : 1;

  const detailItems = useMemo(() => {
    if (!insights) return [];
    const extracted = insights.extracted || {};
    return [
      { label: "Funding type", value: extracted.funding_type || "Not found" },
      { label: "Award amount", value: extracted.amount_text || "Not found" },
      { label: "Deadline", value: extracted.deadline || "Not found" },
      { label: "Regions", value: extracted.regions?.join(", ") || "Not found" },
      { label: "Stage fit", value: extracted.stage_fit?.join(", ") || "Not found" },
      { label: "Industries", value: extracted.industries?.join(", ") || "Not found" }
    ];
  }, [insights]);

  const trustProgress = insights ? Math.max(0, Math.min(100, insights.trust.trust_score)) : 0;

  const handleCopy = async (value: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setStatus({ tone: "success", message: `${label} copied to clipboard.` });
    } catch (error) {
      setStatus({ tone: "warning", message: "Unable to copy right now." });
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setStatus(null);
    setPlan(null);
    if (mode === "url") {
      if (!url.trim()) {
        setStatus({ tone: "warning", message: "Paste a funding URL to continue." });
        setIsAnalyzing(false);
        return;
      }
      const response = await apiFetch<{ opportunity: OpportunitySummary; insights: OpportunityInsights }>(
        "/copilot/ingest-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        }
      );
      if (response.ok && response.data) {
        setInsights(response.data.insights);
        setOpportunity(response.data.opportunity);
        setDemoMode(false);
      } else {
        setInsights(demoInsights);
        setOpportunity(demoOpportunity);
        setDemoMode(true);
        setStatus({ tone: "warning", message: safeErrorMessage(response, "Demo mode enabled.") });
      }
      setIsAnalyzing(false);
      return;
    }

    if (!rawText.trim()) {
      setStatus({ tone: "warning", message: "Paste source text to analyze." });
      setIsAnalyzing(false);
      return;
    }

    const response = await apiFetch<OpportunityInsights>("/copilot/analyze-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text: rawText, title, org, url: url || undefined })
    });
    if (response.ok && response.data) {
      setInsights(response.data);
      setDemoMode(false);
    } else {
      setInsights(demoInsights);
      setDemoMode(true);
      setStatus({ tone: "warning", message: safeErrorMessage(response, "Demo mode enabled.") });
    }
    setOpportunity(null);
    setIsAnalyzing(false);
  };

  const ensureOpportunity = async () => {
    if (opportunity) return opportunity;
    if (!rawText.trim()) return null;
    const response = await apiFetch<{ opportunity: OpportunitySummary; insights: OpportunityInsights }>(
      "/copilot/ingest-text",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText, title, org, url: url || undefined })
      }
    );
    if (response.ok && response.data) {
      setOpportunity(response.data.opportunity);
      setInsights(response.data.insights);
      setDemoMode(false);
      return response.data.opportunity;
    }
    setStatus({ tone: "warning", message: safeErrorMessage(response, "Unable to save the opportunity.") });
    return null;
  };

  const handleGeneratePlan = async (): Promise<CopilotPlan> => {
    setIsPlanning(true);
    setStatus(null);
    let targetOpportunity = opportunity;
    if (!targetOpportunity) {
      targetOpportunity = await ensureOpportunity();
    }
    if (!targetOpportunity) {
      setPlan(demoPlan);
      setDemoMode(true);
      setIsPlanning(false);
      return demoPlan;
    }
    const response = await apiFetch<CopilotPlan>(`/copilot/opportunities/${targetOpportunity.id}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (response.ok && response.data) {
      setPlan(response.data);
      setDemoMode(false);
      setIsPlanning(false);
      return response.data;
    } else {
      setPlan(demoPlan);
      setDemoMode(true);
      setStatus({ tone: "warning", message: safeErrorMessage(response, "Demo plan enabled.") });
    }
    setIsPlanning(false);
    return demoPlan;
  };

  const handleAddToTracker = async () => {
    setIsAdding(true);
    setStatus(null);

    let targetPlan = plan;
    if (!targetPlan) {
      targetPlan = await handleGeneratePlan();
    }
    let targetOpportunity = opportunity;
    if (!targetOpportunity) {
      targetOpportunity = await ensureOpportunity();
    }
    if (!targetOpportunity) {
      setIsAdding(false);
      return;
    }

    const tasks = flattenPlanTasks(targetPlan);
    const dueDates = buildDueDates(tasks);
    const response = await apiFetch("/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunity_id: targetOpportunity.id,
        status: "Planned",
        notes: insights?.summary || "",
        tasks: { items: tasks },
        due_dates: dueDates
      })
    });
    if (response.ok) {
      setStatus({ tone: "success", message: "Added to tracker with tasks and due dates." });
    } else {
      setStatus({ tone: "warning", message: safeErrorMessage(response, "Unable to add to tracker.") });
    }
    setIsAdding(false);
  };

  return (
    <AppShell>
      <main className="space-y-10">
        <PageHeader
          eyebrow="Copilot"
          title="Analyze a funding source in minutes"
          description="Paste a grant link or text. We extract eligibility, highlight evidence, and draft a plan."
          badges={["Offline friendly", "Evidence-first", "Deterministic"]}
          action={
            <Link href="/opportunities">
              <Button variant="outline" size="sm">
                Browse opportunities
              </Button>
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {["Input", "Insights", "Plan"].map((step, index) => (
            <Surface
              key={step}
              tone={currentStep >= index + 1 ? "hero" : "default"}
              className="space-y-2 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Step {index + 1}</p>
              <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{step}</p>
              <p className="text-xs text-[var(--vf-ink-600)]">
                {index === 0 && "Paste a URL or text to analyze."}
                {index === 1 && "Review extracted fields and evidence."}
                {index === 2 && "Generate tasks, drafts, and risks."}
              </p>
            </Surface>
          ))}
        </div>

        {demoMode ? <StatusBanner tone="warning" title="Demo mode enabled" description="Live API unavailable. Showing demo insights." /> : null}
        {status ? <StatusBanner tone={status.tone} title={status.message} /> : null}

        <Surface tone="raised" className="space-y-6 p-6">
          <SectionHeader
            eyebrow="Input"
            title="Paste a funding source"
            description="Choose a URL or paste text to run the Copilot analysis."
          />
          <Tabs tabs={tabs} value={mode} onValueChange={(value) => setMode(value as "url" | "text")} />
          {mode === "url" ? (
            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <Input
                label="Funding URL"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.org/grant"
              />
              <Surface tone="default" className="space-y-2 p-4 text-sm text-[var(--vf-ink-600)]">
                <p className="font-semibold text-[var(--vf-ink-900)]">What happens next</p>
                <p>We fetch the page, extract key fields, and generate evidence snippets you can verify.</p>
              </Surface>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-4">
                <Input
                  label="Title (optional)"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Aurora Women in Climate Grant"
                />
                <Input
                  label="Organization (optional)"
                  value={org}
                  onChange={(event) => setOrg(event.target.value)}
                  placeholder="Aurora Ventures"
                />
                <Textarea
                  label="Paste raw text"
                  value={rawText}
                  onChange={(event) => setRawText(event.target.value)}
                  rows={8}
                  placeholder="Paste the funding description, eligibility, and deadlines here."
                />
              </div>
              <Surface tone="default" className="space-y-3 p-4 text-sm text-[var(--vf-ink-600)]">
                <p className="font-semibold text-[var(--vf-ink-900)]">Offline-friendly mode</p>
                <p>Use raw text from PDFs or emails. Copilot stays deterministic and does not require external APIs.</p>
                <p>When you generate a plan, we save the opportunity so you can track tasks.</p>
              </Surface>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
            {insights ? (
              <Button variant="outline" onClick={handleGeneratePlan} disabled={isPlanning}>
                {isPlanning ? "Generating plan..." : "Generate plan"}
              </Button>
            ) : null}
          </div>
        </Surface>

        {insights ? (
          <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <Surface tone="raised" className="space-y-6 p-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-[var(--vf-ink-900)]">Insights</h2>
                <p className="text-sm text-[var(--vf-ink-600)]">{insights.summary}</p>
              </div>
              <KeyValue items={detailItems} columns={2} />
              <Card className="border-[var(--vf-border-subtle)]">
                <CardHeader>
                  <CardTitle>Evidence snippets</CardTitle>
                  <CardDescription>Source sentences that back each extracted field.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.evidence.map((item) => (
                    <div key={`${item.label}-${item.snippet}`} className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-3">
                      <div className="flex items-center justify-between text-xs text-[var(--vf-ink-500)]">
                        <span>{item.label}</span>
                        <Badge variant="info">{Math.round(item.confidence * 100)}% confidence</Badge>
                      </div>
                      <p className="mt-2 text-sm text-[var(--vf-ink-700)]">{item.snippet}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Surface>

            <div className="space-y-6">
              <Surface tone="hero" className="space-y-4 p-6">
                <h3 className="text-sm font-semibold text-[var(--vf-ink-900)]">Trust & verification</h3>
                <ProgressBar value={trustProgress} label={`Trust score ${trustProgress}`} />
                <div className="space-y-2 text-xs text-[var(--vf-ink-600)]">
                  {insights.trust.checks.map((check) => (
                    <div key={check.name} className="flex items-start gap-2">
                      <span className={`mt-1 h-2 w-2 rounded-full ${check.ok ? "bg-[var(--vf-success-500)]" : "bg-[var(--vf-warning-500)]"}`} />
                      <div>
                        <p className="font-semibold text-[var(--vf-ink-800)]">{check.name}</p>
                        <p>{check.detail}</p>
                      </div>
                    </div>
                  ))}
                  {insights.trust.flags.length ? (
                    <div className="rounded-[var(--vf-radius-lg)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-3">
                      <p className="text-xs font-semibold text-[var(--vf-ink-900)]">Flags</p>
                      <ul className="mt-2 space-y-1 text-xs text-[var(--vf-ink-600)]">
                        {insights.trust.flags.map((flag) => (
                          <li key={flag}>• {flag}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleCopy(insights.summary, "Summary")}>
                    Copy summary
                  </Button>
                  {opportunity ? (
                    <Link href={`/opportunities/${opportunity.id}`}>
                      <Button size="sm" variant="outline">
                        View detail
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </Surface>

              <Surface tone="raised" className="space-y-3 p-6">
                <h3 className="text-sm font-semibold text-[var(--vf-ink-900)]">Suggested next steps</h3>
                <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                  {insights.suggested_tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--vf-violet-500)]" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={handleGeneratePlan} disabled={isPlanning}>
                    {isPlanning ? "Generating..." : "Generate plan"}
                  </Button>
                  <Button size="sm" onClick={handleAddToTracker} disabled={isAdding}>
                    {isAdding ? "Adding..." : "Add to tracker"}
                  </Button>
                </div>
              </Surface>
            </div>
          </section>
        ) : null}

        {plan ? (
          <Surface tone="raised" className="space-y-6 p-6">
            <SectionHeader
              eyebrow="Plan"
              title="Staged checklist + drafts"
              description="Use this plan to coordinate tasks and draft outreach quickly."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {plan.phases.map((phase) => (
                <Surface key={phase.name} tone="default" className="space-y-3 p-4">
                  <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{phase.name}</p>
                  <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                    {phase.tasks.map((task) => (
                      <li key={task.title}>
                        <p className="font-semibold text-[var(--vf-ink-800)]">{task.title}</p>
                        <p className="text-xs text-[var(--vf-ink-500)]">{task.why}</p>
                      </li>
                    ))}
                  </ul>
                </Surface>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <Surface tone="default" className="space-y-3 p-4">
                <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Outreach email draft</p>
                <Textarea value={plan.drafts.outreach_email} rows={8} readOnly />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleCopy(plan.drafts.outreach_email, "Outreach email")}>
                    Copy outreach email
                  </Button>
                  <Button size="sm" onClick={handleAddToTracker} disabled={isAdding}>
                    {isAdding ? "Adding..." : "Add to tracker"}
                  </Button>
                </div>
              </Surface>
              <Surface tone="default" className="space-y-3 p-4">
                <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Narrative bullets</p>
                <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                  {plan.drafts.application_bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
                {plan.drafts.risks.length ? (
                  <>
                    <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Risks to address</p>
                    <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                      {plan.drafts.risks.map((risk) => (
                        <li key={risk}>• {risk}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </Surface>
            </div>
          </Surface>
        ) : null}
      </main>
    </AppShell>
  );
}
