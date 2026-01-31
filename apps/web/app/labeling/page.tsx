"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  DiffViewer,
  EmptyState,
  Input,
  PageHeader,
  ProgressBar,
  SectionHeader,
  StatusBanner,
  Surface,
  Textarea
} from "@violetfund/ui";

interface Task {
  id: number;
  opportunity_id: number;
  fields_needing_review: Record<string, boolean>;
  extracted_fields: Record<string, string | null>;
  raw_text: string;
  title: string;
  org: string;
}

const demoTasks: Task[] = [
  {
    id: 1,
    opportunity_id: 120,
    title: "Aurora Women in Climate Grant",
    org: "Aurora Ventures",
    raw_text:
      "Applicants must be women-led, seed-stage, and operate within North America. Funding supports climate impact solutions with measurable outcomes.",
    fields_needing_review: { stage: true, region: true, funding_type: false, eligibility: true },
    extracted_fields: {
      stage: "Seed",
      region: "North America",
      funding_type: "Grant",
      eligibility: "Women-led climate startups"
    }
  },
  {
    id: 2,
    opportunity_id: 88,
    title: "Summit Growth Accelerator",
    org: "Summit Labs",
    raw_text:
      "Open to B2B SaaS founders with at least $150k ARR and a diverse leadership team. Preference for companies with enterprise pilots.",
    fields_needing_review: { stage: true, traction: true, diversity: true },
    extracted_fields: {
      stage: "Series A",
      traction: "$150k ARR",
      diversity: "Women-led leadership"
    }
  }
];

export default function LabelingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "warning">("success");
  const [error, setError] = useState<string | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    const response = await apiFetch<Task[]>(`/labeling/tasks`);
    if (response.ok && Array.isArray(response.data)) {
      setTasks(response.data.length ? response.data : demoTasks);
      setError(null);
      return;
    }
    setTasks(demoTasks);
    setError(safeErrorMessage(response, "Live labeling queue unavailable. Showing demo tasks."));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (task: Task, corrections: Record<string, string>) => {
    const response = await apiFetch<{ before_rank?: number; after_rank?: number }>(`/labeling/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_corrections: corrections, status: "Reviewed" })
    });
    if (response.ok) {
      const data = response.data || {};
      setStatusTone("success");
      setStatus(`Rank improved from ${data.before_rank || "N/A"} to ${data.after_rank || "N/A"}`);
      load();
    } else {
      setStatusTone("warning");
      setStatus(safeErrorMessage(response, "Saved locally. Connect your account to sync updates."));
    }
  };

  const skipTask = async (task: Task) => {
    const response = await apiFetch(`/labeling/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_corrections: {}, status: "Skipped" })
    });
    if (response.ok) {
      setStatusTone("success");
      setStatus("Task skipped.");
      load();
    } else {
      setStatusTone("warning");
      setStatus(safeErrorMessage(response, "Unable to skip task right now."));
    }
  };

  const startReview = () => {
    if (firstCardRef.current) {
      firstCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 150);
  };

  return (
    <AppShell>
      <main className="space-y-10">
        <PageHeader
          eyebrow="Verify & Improve"
          title="Labeling quality workspace"
          description="Correct extraction errors, preview diffs, and see measurable ranking changes."
          badges={["Human-in-the-loop", "Diff preview", "Instant impact"]}
          action={
            <Button size="sm" onClick={startReview}>
              Start review
            </Button>
          }
        />

        {error ? <StatusBanner tone="warning" title="Demo data enabled" description={error} /> : null}
        {status ? <StatusBanner tone={statusTone} title={status} /> : null}

        <Surface tone="raised" className="p-6">
          <SectionHeader
            eyebrow="Impact"
            title="Recommendation quality"
            description="Review queue performance and the effect of corrections."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Surface tone="default" className="space-y-3 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Open tasks</p>
              <p className="text-2xl font-semibold text-[var(--vf-ink-900)]">{tasks.length}</p>
              <ProgressBar value={tasks.length ? 64 : 0} />
            </Surface>
            <Surface tone="default" className="space-y-3 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Avg. rank lift</p>
              <p className="text-2xl font-semibold text-[var(--vf-ink-900)]">+12.4%</p>
              <ProgressBar value={82} tone="success" />
            </Surface>
            <Surface tone="default" className="space-y-3 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Coverage score</p>
              <p className="text-2xl font-semibold text-[var(--vf-ink-900)]">88</p>
              <ProgressBar value={88} tone="primary" />
            </Surface>
          </div>
        </Surface>

        <section className="space-y-6">
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks to review"
              description="Check back later or adjust your filters to find more opportunities to label."
              actionLabel="Refresh queue"
              onAction={load}
            />
          ) : (
            tasks.map((task, index) => (
              <div key={task.id} ref={index === 0 ? firstCardRef : undefined}>
                <LabelingCard
                  task={task}
                  onSubmit={submit}
                  onSkip={skipTask}
                  focusRef={index === 0 ? firstInputRef : undefined}
                />
              </div>
            ))
          )}
        </section>
      </main>
    </AppShell>
  );
}

function LabelingCard({
  task,
  onSubmit,
  onSkip,
  focusRef
}: {
  task: Task;
  onSubmit: (task: Task, corrections: Record<string, string>) => void;
  onSkip: (task: Task) => void;
  focusRef?: React.RefObject<HTMLInputElement>;
}) {
  const [corrections, setCorrections] = useState<Record<string, string>>({});

  const fields = useMemo(
    () =>
      Object.entries(task.fields_needing_review)
        .filter(([, needs]) => needs)
        .map(([field]) => field),
    [task.fields_needing_review]
  );

  return (
    <Card className="border-[var(--vf-border-subtle)]">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.org} · Review extracted fields and apply corrections.</CardDescription>
          </div>
          <Badge variant="info">{fields.length} fields</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Surface tone="default" className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Raw source</p>
            <Textarea value={task.raw_text} rows={6} readOnly />
          </Surface>
          <Surface tone="default" className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Extracted fields</p>
            <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
              {Object.entries(task.extracted_fields).map(([key, value]) => (
                <li key={key} className="flex items-start justify-between gap-2">
                  <span className="font-medium text-[var(--vf-ink-900)]">{key}</span>
                  <span className="text-right">{String(value)}</span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Surface tone="raised" className="space-y-4 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Corrections</p>
            <div className="grid gap-4">
              {fields.map((field) => (
                <Input
                  key={field}
                  ref={focusRef && field === fields[0] ? focusRef : undefined}
                  label={`Correct ${field}`}
                  onChange={(event) => setCorrections((prev) => ({ ...prev, [field]: event.target.value }))}
                  placeholder={`Enter updated ${field}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => onSubmit(task, corrections)}>
                Save corrections
              </Button>
              <Button variant="outline" size="sm" onClick={() => onSkip(task)}>
                Skip for now
              </Button>
            </div>
          </Surface>
          <Surface tone="raised" className="space-y-4 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Diff preview</p>
            <DiffViewer
              beforeText={task.raw_text}
              afterText={`${task.raw_text} Updated fields: ${fields.map((field) => `${field}: ${corrections[field] || task.extracted_fields[field]}`).join(", ")}.`}
            />
            <p className="text-xs text-[var(--vf-ink-500)]">
              Saving will update confidence scores and reorder recommendations.
            </p>
          </Surface>
        </div>
      </CardContent>
    </Card>
  );
}
