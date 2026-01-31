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
  ConfidenceMeter,
  DataTable,
  EmptyState,
  FilterBar,
  MetricCard,
  PageHeader,
  SegmentedControl,
  StatusBanner,
  Surface,
  Toolbar
} from "@violetfund/ui";

interface Opportunity {
  id: number;
  title: string;
  org: string;
  funding_type: string;
  amount_text: string | null;
  deadline: string | null;
}

interface Match {
  opportunity: Opportunity;
  score: number;
  reasons: string[];
  highlights: string[];
  distance?: number | null;
  status?: "new" | "saved" | "due-soon";
}

const demoMatches: Match[] = [
  {
    opportunity: {
      id: 1,
      title: "Aurora Women in Climate Grant",
      org: "Aurora Ventures",
      funding_type: "Non-dilutive grant",
      amount_text: "$75,000",
      deadline: "Aug 28"
    },
    score: 0.86,
    status: "due-soon",
    reasons: ["Seed-stage", "Climate impact", "Women-led team", "North America eligible"],
    highlights: [
      "Priority for founders with measurable carbon reduction outcomes.",
      "Applicants must show community partnerships in year one."
    ]
  },
  {
    opportunity: {
      id: 2,
      title: "Catalyst Founders Accelerator",
      org: "Catalyst Impact",
      funding_type: "Accelerator",
      amount_text: "$120,000",
      deadline: "Rolling"
    },
    score: 0.82,
    status: "new",
    reasons: ["Revenue-ready", "Healthcare focus", "Remote cohort accepted"],
    highlights: [
      "Applicants with pilots in two regions receive priority review.",
      "Looking for founders with a dedicated impact measurement plan."
    ]
  },
  {
    opportunity: {
      id: 3,
      title: "Northwind Growth Fund",
      org: "Northwind Partners",
      funding_type: "Equity",
      amount_text: "$250,000",
      deadline: "Sep 12"
    },
    score: 0.79,
    status: "saved",
    reasons: ["B2B SaaS", "ARR traction", "Diversity commitment"],
    highlights: [
      "Supports companies with $250k-$1M ARR and clear enterprise pipeline.",
      "Seeks founders with board-ready reporting cadence."
    ]
  },
  {
    opportunity: {
      id: 4,
      title: "Meridian Social Impact Prize",
      org: "Meridian Foundation",
      funding_type: "Prize",
      amount_text: "$50,000",
      deadline: "Oct 05"
    },
    score: 0.76,
    status: "new",
    reasons: ["Community impact", "Education access", "Female-led leadership"],
    highlights: [
      "Applicants must demonstrate measurable outcomes for underrepresented communities.",
      "Preference for teams piloting in at least two states."
    ]
  },
  {
    opportunity: {
      id: 5,
      title: "FemmeTech Strategic Partnerships",
      org: "FemmeTech Collective",
      funding_type: "Partnership",
      amount_text: "$40,000",
      deadline: "Rolling"
    },
    score: 0.73,
    status: "saved",
    reasons: ["Digital health", "Clinical pilot", "Mentor network"],
    highlights: [
      "Looking for founders with a clinical validation roadmap.",
      "Applicants should outline patient engagement strategy."
    ]
  }
];

const defaultSavedViews = [
  { name: "Due in 30 days", count: 7, status: "due-soon", query: "", filters: ["deadline"] },
  { name: "High confidence", count: 12, status: "new", query: "", filters: [] },
  { name: "Saved for later", count: 5, status: "saved", query: "", filters: [] }
];

const viewOptions = [
  { label: "Card view", value: "cards" },
  { label: "Table view", value: "table" }
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState("Loading recommendations...");
  const [view, setView] = useState("cards");
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [savedViews, setSavedViews] = useState(defaultSavedViews);
  const [actionStatus, setActionStatus] = useState<{ message: string; tone: "success" | "warning" } | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const initialView = searchParams.get("view");
    if (initialView && (initialView === "cards" || initialView === "table")) {
      setView(initialView);
    }
  }, [searchParams]);

  useEffect(() => {
    const storedViews = window.localStorage.getItem("vf:dashboardViews");
    if (storedViews) {
      try {
        const parsed = JSON.parse(storedViews);
        if (Array.isArray(parsed)) {
          setSavedViews(parsed);
        }
      } catch (error) {
        // ignore invalid storage
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("vf:dashboardViews", JSON.stringify(savedViews));
  }, [savedViews]);

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams();
      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      }
      if (activeFilters.length) {
        params.set("filters", activeFilters.join(","));
      }
      const response = await apiFetch<Match[]>(`/opportunities/recommended?${params.toString()}`);
      if (response.ok && Array.isArray(response.data)) {
        setMatches(response.data.length ? response.data : demoMatches);
        setStatus(debouncedQuery ? "Semantic recommendations" : "Recommended opportunities");
        setError(null);
        setErrorStatus(null);
        return;
      }
      setMatches(demoMatches);
      setStatus("Showing curated demo matches.");
      setErrorStatus(response.status);
      setError(safeErrorMessage(response, "Connect your profile to unlock personalized recommendations."));
    };
    load();
  }, [activeFilters, debouncedQuery]);

  const handleSaveView = () => {
    const name = window.prompt("Name this view");
    if (!name) return;
    setSavedViews((prev) => [
      ...prev,
      {
        name,
        count: matches.length,
        status: "new",
        query,
        filters: activeFilters
      }
    ]);
    setActionStatus({ message: `Saved view "${name}".`, tone: "success" });
  };

  const handleOpenView = (viewItem: { name: string; query: string; filters: string[] }) => {
    setQuery(viewItem.query);
    setActiveFilters(viewItem.filters);
    setActionStatus({ message: `Opened view "${viewItem.name}".`, tone: "success" });
  };

  const handleToggleFilter = (value: string) => {
    setActiveFilters((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const exportCsv = () => {
    const header = ["Title", "Organization", "Funding Type", "Deadline", "Score"];
    const csvRows = matches.map((match) => [
      match.opportunity.title,
      match.opportunity.org,
      match.opportunity.funding_type,
      match.opportunity.deadline ?? "Rolling",
      `${Math.round(match.score * 100)}%`
    ]);
    const csv = [header.join(","), ...csvRows.map((row) => row.map((cell) => `"${String(cell)}"`).join(","))];
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dashboard-opportunities.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = async (match: Match) => {
    const response = await apiFetch(`/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunity_id: match.opportunity.id,
        status: "Saved",
        notes: "",
        tasks: {},
        due_dates: {}
      })
    });
    if (response.ok) {
      setActionStatus({ message: "Saved to tracker.", tone: "success" });
    } else {
      setActionStatus({ message: safeErrorMessage(response, "Unable to save right now."), tone: "warning" });
    }
  };

  const handleReconnect = () => {
    if (errorStatus === 401 || errorStatus === 403) {
      router.push("/auth/login");
    } else {
      router.push("/profile");
    }
  };

  const stats = useMemo(
    () => [
      { label: "Live opportunities", value: matches.length ? String(matches.length) : "0", delta: "+18%", description: "Curated matches refreshed daily." },
      { label: "Avg. confidence", value: matches.length ? `${Math.round((matches.reduce((acc, match) => acc + match.score, 0) / matches.length) * 100)}%` : "0%", delta: "+6%", description: "Based on stage, region, and keyword fit." },
      { label: "Missing profile fields", value: "3", delta: "Focus", description: "Add traction, impact, and team size." }
    ],
    [matches]
  );

  const tableRows = matches.map((match) => ({
    id: String(match.opportunity.id),
    opportunity: (
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--vf-ink-900)]">{match.opportunity.title}</p>
        <p className="text-xs text-[var(--vf-ink-500)]">{match.opportunity.org}</p>
      </div>
    ),
    fit: <ConfidenceMeter score={Math.round(match.score * 100)} />,
    type: match.opportunity.funding_type,
    deadline: match.opportunity.deadline ?? "Rolling",
    evidence: (
      <div className="flex flex-wrap gap-1">
        {match.reasons.slice(0, 2).map((reason) => (
          <Badge key={reason} variant="default">
            {reason}
          </Badge>
        ))}
      </div>
    ),
    actions: (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/opportunities/${match.opportunity.id}`)}>
        View
      </Button>
    )
  }));

  return (
    <AppShell>
      <main className="space-y-10">
        <PageHeader
          eyebrow="Dashboard"
          title="Funding recommendations"
          description={status}
          badges={["Explainable", "Founder-first", "Auto refreshed"]}
          action={
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={exportCsv}>
                Export list
              </Button>
              <a href="/profile">
                <Button size="sm">Update profile</Button>
              </a>
            </div>
          }
        />

        {error ? (
          <StatusBanner
            tone="warning"
            title="Demo data enabled"
            description={error}
            action={
              <Button variant="ghost" size="sm" onClick={handleReconnect}>
                Reconnect
              </Button>
            }
          />
        ) : null}
        {actionStatus ? <StatusBanner tone={actionStatus.tone} title={actionStatus.message} /> : null}

        <Surface tone="raised" className="p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {stats.map((stat) => (
              <MetricCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                delta={stat.delta}
                helper={stat.description}
                progress={stat.label === "Missing profile fields" ? 72 : stat.label === "Avg. confidence" ? 84 : 68}
                tone={stat.label === "Missing profile fields" ? "warning" : stat.label === "Avg. confidence" ? "positive" : "default"}
              />
            ))}
          </div>
        </Surface>

        <Toolbar
          title="Saved views"
          description="Jump into the queues you use most often."
          action={
            <Button variant="outline" size="sm" onClick={handleSaveView}>
              Create view
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          {savedViews.map((viewItem) => (
            <Surface key={viewItem.name} tone="raised" className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{viewItem.name}</p>
                <Badge variant="info">{viewItem.count ?? 0}</Badge>
              </div>
              <p className="text-xs text-[var(--vf-ink-500)]">Last refreshed 3 hours ago</p>
              <Button variant="ghost" size="sm" onClick={() => handleOpenView(viewItem)}>
                Open view
              </Button>
            </Surface>
          ))}
        </div>

        <Surface tone="default" className="space-y-6 p-6">
          <FilterBar
            searchPlaceholder="Search by program, region, or stage"
            searchValue={query}
            onSearchChange={setQuery}
            onSearchSubmit={setDebouncedQuery}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            onSaveView={handleSaveView}
            filters={[
              { label: "Seed", value: "seed" },
              { label: "Pre-seed", value: "pre-seed" },
              { label: "Non-dilutive", value: "grant" },
              { label: "Due soon", value: "deadline" },
              { label: "Women-led", value: "women-led" },
              { label: "Climate", value: "climate" }
            ]}
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SegmentedControl options={viewOptions} value={view} onChange={setView} />
            <div className="flex items-center gap-2 text-xs text-[var(--vf-ink-500)]">
              <span>Updated 2 hours ago</span>
              <Badge variant="info">Evidence-first</Badge>
              {debouncedQuery ? <Badge variant="default">Semantic match</Badge> : null}
            </div>
          </div>
        </Surface>

        {!matches.length ? (
          <EmptyState
            title="No recommendations yet"
            description="Complete your founder profile to unlock curated recommendations and confidence scoring."
            actionLabel="Complete profile"
          />
        ) : view === "table" ? (
          <DataTable
            columns={[
              { key: "opportunity", label: "Opportunity" },
              { key: "fit", label: "Confidence" },
              { key: "type", label: "Funding type" },
              { key: "deadline", label: "Deadline" },
              { key: "evidence", label: "Evidence" },
              { key: "actions", label: "" }
            ]}
            rows={tableRows}
            rowKey={(row) => row.id}
          />
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {matches.map((match) => (
              <Card key={match.opportunity.id} className="border-[var(--vf-border-subtle)]">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <CardTitle>{match.opportunity.title}</CardTitle>
                      <CardDescription>{match.opportunity.org}</CardDescription>
                    </div>
                    <Badge variant={match.status === "due-soon" ? "warning" : match.status === "saved" ? "default" : "info"}>
                      Score {Math.round(match.score * 100)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ConfidenceMeter score={Math.round(match.score * 100)} label="Match confidence" />
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--vf-ink-600)]">
                    <Badge variant="default">{match.opportunity.funding_type}</Badge>
                    <Badge variant="default">{match.opportunity.deadline ?? "Rolling deadline"}</Badge>
                    <Badge variant="default">Women-led</Badge>
                    {debouncedQuery ? <Badge variant="info">Semantic match</Badge> : null}
                    {match.opportunity.amount_text ? <Badge variant="default">{match.opportunity.amount_text}</Badge> : null}
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-[var(--vf-ink-600)]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--vf-ink-500)]">Why matched</p>
                    <ul className="space-y-1">
                      {match.reasons.map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface-200)] p-3 text-xs text-[var(--vf-ink-700)]">
                    {match.highlights.map((snippet) => (
                      <p key={snippet}>“{snippet}”</p>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" onClick={() => handleSave(match)}>
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/opportunities/${match.opportunity.id}`)}>
                      View detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>
    </AppShell>
  );
}
