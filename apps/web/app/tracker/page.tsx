"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  DataTable,
  Dialog,
  Input,
  MetricCard,
  PageHeader,
  ProgressBar,
  SegmentedControl,
  Select,
  StatCards,
  StatusBanner,
  Surface
} from "@violetfund/ui";

const STATUSES = ["Saved", "Planned", "In Progress", "Submitted", "Won", "Rejected"];

interface Application {
  id: number;
  opportunity_id: number;
  status: string;
  notes: string;
  opportunity?: {
    id: number;
    title: string;
    org: string;
    deadline: string | null;
  };
}

interface Match {
  opportunity: {
    id: number;
    title: string;
    org: string;
    deadline: string | null;
  };
}

const demoApplications: Application[] = [
  { id: 1, opportunity_id: 120, status: "Saved", notes: "Waiting for founder notes.", opportunity: { id: 120, title: "Aurora Women in Climate Grant", org: "Aurora Ventures", deadline: "Aug 28" } },
  { id: 2, opportunity_id: 88, status: "Planned", notes: "Drafting pitch deck.", opportunity: { id: 88, title: "Summit Growth Accelerator", org: "Summit Labs", deadline: "Rolling" } },
  { id: 3, opportunity_id: 77, status: "In Progress", notes: "Financials requested.", opportunity: { id: 77, title: "Catalyst Founders Accelerator", org: "Catalyst Impact", deadline: "Sep 10" } },
  { id: 4, opportunity_id: 64, status: "Submitted", notes: "Submitted Aug 12.", opportunity: { id: 64, title: "Meridian Social Impact Prize", org: "Meridian Foundation", deadline: "Oct 05" } },
  { id: 5, opportunity_id: 52, status: "Won", notes: "Accepted for cohort.", opportunity: { id: 52, title: "Northwind Growth Fund", org: "Northwind Partners", deadline: "Rolling" } },
  { id: 6, opportunity_id: 41, status: "Rejected", notes: "Try again next cycle.", opportunity: { id: 41, title: "FemmeTech Partnerships", org: "FemmeTech Collective", deadline: "Nov 12" } }
];

const viewOptions = [
  { label: "Kanban", value: "kanban" },
  { label: "Analytics", value: "analytics" }
];

export default function TrackerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ message: string; tone: "success" | "warning" } | null>(null);
  const [view, setView] = useState("kanban");
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: number; title: string; org: string; deadline: string | null }>>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState("Saved");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const initialView = searchParams.get("view");
    if (initialView && (initialView === "kanban" || initialView === "analytics")) {
      setView(initialView);
    }
  }, [searchParams]);

  const load = async () => {
    const response = await apiFetch<Application[]>(`/applications?include=opportunity`);
    if (response.ok && Array.isArray(response.data)) {
      setApplications(response.data.length ? response.data : demoApplications);
      setError(null);
      return;
    }
    setApplications(demoApplications);
    setError(safeErrorMessage(response, "Connect your account to sync live applications."));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!showDialog) return;
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      params.set("limit", "6");
      const response = await apiFetch<Match[]>(`/opportunities/search?${params.toString()}`);
      if (response.ok && Array.isArray(response.data)) {
        setSearchResults(
          response.data.map((match) => ({
            id: match.opportunity.id,
            title: match.opportunity.title,
            org: match.opportunity.org,
            deadline: match.opportunity.deadline ?? "Rolling"
          }))
        );
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, showDialog]);

  const onDrop = async (event: React.DragEvent<HTMLDivElement>, status: string) => {
    const appId = Number(event.dataTransfer.getData("text"));
    const app = applications.find((item) => item.id === appId);
    if (!app) return;
    const previousApplications = applications;
    setApplications((prev) => prev.map((item) => (item.id === appId ? { ...item, status } : item)));
    const response = await apiFetch(`/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      setStatus({ message: `Moved to ${status}.`, tone: "success" });
      load();
      return;
    }
    setApplications(previousApplications);
    setStatus({ message: safeErrorMessage(response, "Unable to update status."), tone: "warning" });
  };

  const stats = useMemo(
    () => [
      { label: "Active applications", value: "18", delta: "+4", description: "Across grants and accelerators." },
      { label: "Upcoming deadlines", value: "6", delta: "2 this week", description: "Prioritize high confidence entries." },
      { label: "Win rate", value: "24%", delta: "+3%", description: "Based on the last 2 quarters." }
    ],
    []
  );

  const analyticsRows = applications.map((app) => ({
    id: String(app.id),
    opportunity: app.opportunity ? `${app.opportunity.title} (${app.opportunity.org})` : `Opportunity #${app.opportunity_id}`,
    status: app.status,
    notes: app.notes,
    owner: "Primary founder",
    action: (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/opportunities/${app.opportunity_id}`)}>
        Open
      </Button>
    )
  }));

  const handleCreateApplication = async () => {
    if (!selectedOpportunity) {
      setStatus({ message: "Select an opportunity to continue.", tone: "warning" });
      return;
    }
    setIsCreating(true);
    const response = await apiFetch(`/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunity_id: selectedOpportunity,
        status: newStatus,
        notes: "",
        tasks: {},
        due_dates: {}
      })
    });
    setIsCreating(false);
    if (response.ok) {
      setStatus({ message: "Application created.", tone: "success" });
      setShowDialog(false);
      setSearchQuery("");
      setSelectedOpportunity(null);
      load();
      return;
    }
    setStatus({ message: safeErrorMessage(response, "Unable to create application."), tone: "warning" });
  };

  const handleShareStatus = async () => {
    const shareUrl = `${window.location.origin}/tracker?view=analytics`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus({ message: "Shareable link copied to clipboard.", tone: "success" });
    } catch (error) {
      setStatus({ message: "Unable to copy link. Try again.", tone: "warning" });
    }
  };

  return (
    <AppShell>
      <main className="space-y-10">
        <PageHeader
          eyebrow="Tracker"
          title="Application tracker"
          description="Drag cards across stages or switch to analytics for pipeline health."
          badges={["Kanban", "Analytics", "Collaborative"]}
          action={
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={() => setShowDialog(true)}>
                Create application
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareStatus}>
                Share status
              </Button>
            </div>
          }
        />

        {error ? <StatusBanner tone="warning" title="Demo data enabled" description={error} /> : null}
        {status ? <StatusBanner tone={status.tone} title={status.message} /> : null}
        {showDialog ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <Dialog
              title="Create application"
              description="Search for an opportunity and select a status."
              footer={
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowDialog(false);
                      setSearchQuery("");
                      setSearchResults([]);
                      setSelectedOpportunity(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" isLoading={isCreating} onClick={handleCreateApplication}>
                    Save application
                  </Button>
                </>
              }
            >
              <Input
                label="Search opportunities"
                placeholder="Search by program or org"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <div className="space-y-2">
                {searchResults.length === 0 ? (
                  <p className="text-xs text-[var(--vf-ink-500)]">Start typing to search opportunities.</p>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => setSelectedOpportunity(result.id)}
                      className={`w-full rounded-[var(--vf-radius-md)] border px-3 py-2 text-left text-sm ${
                        selectedOpportunity === result.id
                          ? "border-[var(--vf-violet-500)] bg-[var(--vf-violet-100)]"
                          : "border-[var(--vf-border)] bg-[var(--vf-surface-100)]"
                      }`}
                    >
                      <p className="font-medium text-[var(--vf-ink-900)]">{result.title}</p>
                      <p className="text-xs text-[var(--vf-ink-500)]">{result.org} · {result.deadline ?? "Rolling"}</p>
                    </button>
                  ))
                )}
              </div>
              <Select
                label="Status"
                value={newStatus}
                onChange={(event) => setNewStatus(event.target.value)}
                options={STATUSES.map((status) => ({ label: status, value: status }))}
              />
            </Dialog>
          </div>
        ) : null}

        <Surface tone="raised" className="p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {stats.map((stat) => (
              <MetricCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                delta={stat.delta}
                helper={stat.description}
                progress={stat.label === "Win rate" ? 24 : stat.label === "Upcoming deadlines" ? 66 : 48}
                tone={stat.label === "Upcoming deadlines" ? "warning" : "positive"}
              />
            ))}
          </div>
        </Surface>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <SegmentedControl options={viewOptions} value={view} onChange={setView} />
          <div className="flex items-center gap-2 text-xs text-[var(--vf-ink-500)]">
            <span>Updated 1 hour ago</span>
            <Badge variant="info">Pipeline health</Badge>
          </div>
        </div>

        {applications.length === 0 ? (
          <Surface tone="raised" className="p-6">
            <p className="text-sm text-[var(--vf-ink-600)]">No applications yet. Add opportunities to start tracking.</p>
          </Surface>
        ) : view === "analytics" ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Surface tone="raised" className="space-y-4 p-6">
              <Card className="border-[var(--vf-border-subtle)]">
                <CardHeader>
                  <CardTitle>Stage distribution</CardTitle>
                  <CardDescription>Track how opportunities move through your pipeline.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {STATUSES.map((status) => (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[var(--vf-ink-900)]">{status}</span>
                        <span className="text-[var(--vf-ink-500)]">
                          {applications.filter((app) => app.status === status).length} apps
                        </span>
                      </div>
                      <ProgressBar
                        value={applications.filter((app) => app.status === status).length * 12}
                        tone={status === "Won" ? "success" : status === "Rejected" ? "danger" : "primary"}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <StatCards stats={stats} />
            </Surface>
            <Surface tone="default" className="p-6">
              <DataTable
                columns={[
                  { key: "opportunity", label: "Opportunity" },
                  { key: "status", label: "Status" },
                  { key: "notes", label: "Notes" },
                  { key: "owner", label: "Owner" },
                  { key: "action", label: "" }
                ]}
                rows={analyticsRows}
                rowKey={(row) => row.id}
              />
            </Surface>
          </div>
        ) : (
          <section className="grid gap-4 lg:grid-cols-3">
            {STATUSES.map((status) => (
              <div
                key={status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => onDrop(event, status)}
                className="rounded-[var(--vf-radius-2xl)] border border-[var(--vf-border)] bg-[var(--vf-surface)] p-4 shadow-[var(--vf-shadow-soft)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[var(--vf-ink-800)]">{status}</h2>
                  <Badge variant="info">{applications.filter((app) => app.status === status).length}</Badge>
                </div>
                <div className="space-y-3">
                  {applications
                    .filter((app) => app.status === status)
                    .map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("text", String(app.id))}
                        className="rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface-100)] p-3 text-sm"
                      >
                        <p className="font-medium text-[var(--vf-ink-900)]">
                          {app.opportunity ? app.opportunity.title : `Opportunity #${app.opportunity_id}`}
                        </p>
                        <p className="text-xs text-[var(--vf-ink-500)]">
                          {app.opportunity ? app.opportunity.org : "Organization unavailable"}
                        </p>
                        <p className="text-xs text-[var(--vf-ink-500)]">{app.notes}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </AppShell>
  );
}
