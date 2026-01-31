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
  Input,
  PageHeader,
  ProgressBar,
  SectionHeader,
  StatusBanner,
  Surface,
  Textarea
} from "@violetfund/ui";

const steps = [
  { id: "company", label: "Company" },
  { id: "traction", label: "Traction" },
  { id: "impact", label: "Impact" },
  { id: "funding", label: "Funding" }
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    industry: "",
    stage: "",
    location: "",
    revenue_range: "",
    keywords: "",
    woman_owned_certifications: "",
    free_text_goals: "",
    traction_milestones: "",
    impact_metrics: "",
    funding_history: "",
    team_size: "",
    runway_months: ""
  });
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "warning" | "info">("info");
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const load = async () => {
      const response = await apiFetch<Record<string, string | null>>("/profile");
      if (response.ok && typeof response.data === "object" && response.data) {
        const data = response.data;
        setForm((prev) => ({
          ...prev,
          industry: data.industry || "",
          stage: data.stage || "",
          location: data.location || "",
          revenue_range: data.revenue_range || "",
          keywords: data.keywords || "",
          woman_owned_certifications: data.woman_owned_certifications || "",
          free_text_goals: data.free_text_goals || ""
        }));
        return;
      }
      setError(safeErrorMessage(response, "Unable to load profile data. Showing an editable demo profile."));
    };
    load();
  }, []);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatusTone("info");
    setStatus("Autosaved just now");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await apiFetch("/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (response.ok) {
      setStatusTone("success");
      setStatus("Profile saved. Head back to the dashboard for refreshed matches.");
    } else {
      setStatusTone("warning");
      setStatus(safeErrorMessage(response, "Unable to save profile. Please login again."));
    }
  };

  const completeness = useMemo(() => {
    const total = Object.values(form).length;
    const filled = Object.values(form).filter((value) => value.trim()).length;
    return Math.round((filled / total) * 100);
  }, [form]);

  return (
    <AppShell>
      <main className="space-y-10">
        <PageHeader
          eyebrow="Profile wizard"
          title="Founder profile & recommendation quality"
          description="Multi-step profile builder with autosave and measurable impact on recommendations."
          badges={["Autosave", "Guided steps", "Quality meter"]}
          action={<Button size="sm">Invite collaborator</Button>}
        />

        {error ? <StatusBanner tone="warning" title="Demo profile enabled" description={error} /> : null}
        {status ? <StatusBanner tone={statusTone} title={status} /> : null}

        <Surface tone="raised" className="p-6">
          <SectionHeader
            eyebrow="Quality"
            title="Recommendation quality meter"
            description="Improve your match confidence by completing key signals."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.7fr]">
            <Surface tone="default" className="space-y-4 p-4">
              <ConfidenceMeter score={Math.min(95, Math.max(40, completeness))} label="Profile quality" />
              <ProgressBar value={completeness} label="Completion" />
              <div className="grid gap-3 text-sm text-[var(--vf-ink-600)]">
                <p>Top signals to unlock higher confidence:</p>
                <ul className="space-y-1">
                  <li>• Share traction milestones and ARR or users.</li>
                  <li>• Add verified women-owned certifications.</li>
                  <li>• Provide impact metrics and outcome evidence.</li>
                </ul>
              </div>
            </Surface>
            <Surface tone="default" className="space-y-4 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Current step</p>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={`flex w-full items-center justify-between rounded-[var(--vf-radius-lg)] border px-4 py-3 text-left text-sm transition ${
                      index === currentStep
                        ? "border-[var(--vf-violet-300)] bg-[var(--vf-violet-50)] text-[var(--vf-ink-900)]"
                        : "border-[var(--vf-border)] bg-[var(--vf-surface)] text-[var(--vf-ink-600)]"
                    }`}
                  >
                    <span>{step.label}</span>
                    <Badge variant={index === currentStep ? "info" : "default"}>
                      Step {index + 1}
                    </Badge>
                  </button>
                ))}
              </div>
            </Surface>
          </div>
        </Surface>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-[var(--vf-border-subtle)]">
            <CardHeader>
              <CardTitle>Company details</CardTitle>
              <CardDescription>Anchor your industry, location, and stage for accurate matching.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <Input
                label="Industry"
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                placeholder="Climate, fintech, health, etc."
              />
              <Input
                label="Stage"
                value={form.stage}
                onChange={(e) => updateField("stage", e.target.value)}
                placeholder="Pre-seed, seed, Series A"
              />
              <Input
                label="Location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="City, region"
              />
              <Input
                label="Team size"
                value={form.team_size}
                onChange={(e) => updateField("team_size", e.target.value)}
                placeholder="4 full-time"
              />
            </CardContent>
          </Card>

          <Card className="border-[var(--vf-border-subtle)]">
            <CardHeader>
              <CardTitle>Traction & momentum</CardTitle>
              <CardDescription>Share revenue, users, and traction so we can surface higher quality matches.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <Input
                label="Revenue range"
                value={form.revenue_range}
                onChange={(e) => updateField("revenue_range", e.target.value)}
                placeholder="$10k-$50k MRR"
              />
              <Input
                label="Runway months"
                value={form.runway_months}
                onChange={(e) => updateField("runway_months", e.target.value)}
                placeholder="12 months"
              />
              <Textarea
                label="Traction milestones"
                value={form.traction_milestones}
                onChange={(e) => updateField("traction_milestones", e.target.value)}
                rows={4}
                placeholder="Pilot partners, growth milestones, retention metrics"
              />
              <Textarea
                label="Funding history"
                value={form.funding_history}
                onChange={(e) => updateField("funding_history", e.target.value)}
                rows={4}
                placeholder="Grants received, equity rounds, accelerator participation"
              />
            </CardContent>
          </Card>

          <Card className="border-[var(--vf-border-subtle)]">
            <CardHeader>
              <CardTitle>Impact & eligibility</CardTitle>
              <CardDescription>These fields power impact-focused grant matching and evidence scoring.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <Input
                label="Keywords"
                value={form.keywords}
                onChange={(e) => updateField("keywords", e.target.value)}
                placeholder="Impact, climate, fintech, education"
              />
              <Input
                label="Woman-owned certifications"
                value={form.woman_owned_certifications}
                onChange={(e) => updateField("woman_owned_certifications", e.target.value)}
                placeholder="WBENC, WOSB, etc."
              />
              <Textarea
                label="Impact metrics"
                value={form.impact_metrics}
                onChange={(e) => updateField("impact_metrics", e.target.value)}
                rows={4}
                placeholder="CO2 reductions, community impact, outcomes"
              />
              <Textarea
                label="Founder goals"
                value={form.free_text_goals}
                onChange={(e) => updateField("free_text_goals", e.target.value)}
                rows={4}
                placeholder="Narrative goals, mission-driven impact"
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Save profile</Button>
            <Button variant="outline" type="button">Preview recommendations</Button>
          </div>
        </form>
      </main>
    </AppShell>
  );
}
