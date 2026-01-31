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
  EmptyState,
  FilterBar,
  PageHeader,
  StatusBanner,
  Surface
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
}

const filters = [
  { label: "Seed", value: "seed" },
  { label: "Pre-seed", value: "pre-seed" },
  { label: "Non-dilutive", value: "grant" },
  { label: "Due soon", value: "deadline" },
  { label: "Women-led", value: "women-led" },
  { label: "Climate", value: "climate" }
];

export default function OpportunitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [savedViews, setSavedViews] = useState<Array<{ name: string; query: string; filters: string[] }>>([]);
  const [headerStatus, setHeaderStatus] = useState("Search, filter, and open opportunities.");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    const initialFilters = searchParams.get("filters");
    if (initialQuery) {
      setQuery(initialQuery);
      setDebouncedQuery(initialQuery);
    }
    if (initialFilters) {
      setActiveFilters(initialFilters.split(",").filter(Boolean));
    }
  }, [searchParams]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const storedViews = window.localStorage.getItem("vf:opportunityViews");
    if (storedViews) {
      try {
        const parsed = JSON.parse(storedViews);
        if (Array.isArray(parsed)) {
          setSavedViews(parsed);
        }
      } catch (error) {
        // ignore storage parse errors
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("vf:opportunityViews", JSON.stringify(savedViews));
  }, [savedViews]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    }
    if (activeFilters.length) {
      params.set("filters", activeFilters.join(","));
    }
    const queryString = params.toString();
    router.replace(queryString ? `/opportunities?${queryString}` : "/opportunities");
  }, [activeFilters, debouncedQuery, router]);

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams();
      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      }
      if (activeFilters.length) {
        params.set("filters", activeFilters.join(","));
      }
      params.set("limit", "12");
      params.set("offset", String(page * 12));
      const response = await apiFetch<Match[]>(`/opportunities/search?${params.toString()}`);
      if (response.ok && Array.isArray(response.data)) {
        setMatches(response.data);
        setError(null);
        setHeaderStatus(debouncedQuery ? "Semantic search results" : "Latest opportunities");
        return;
      }
      setMatches([]);
      setError(safeErrorMessage(response, "Unable to load opportunities right now."));
    };
    load();
  }, [activeFilters, debouncedQuery, page]);

  const handleToggleFilter = (value: string) => {
    setActiveFilters((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    setPage(0);
  };

  const handleSaveView = () => {
    const name = window.prompt("Save this view as");
    if (!name) return;
    const view = { name, query, filters: activeFilters };
    setSavedViews((prev) => [...prev, view]);
    setStatusMessage(`Saved view "${name}".`);
  };

  const handleOpenView = (view: { name: string; query: string; filters: string[] }) => {
    setQuery(view.query);
    setActiveFilters(view.filters);
    setPage(0);
    setStatusMessage(`Opened view "${view.name}".`);
  };

  const cardRows = useMemo(
    () =>
      matches.map((match) => (
        <Card key={match.opportunity.id} className="border-[var(--vf-border-subtle)]">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>{match.opportunity.title}</CardTitle>
                <CardDescription>{match.opportunity.org}</CardDescription>
              </div>
              {debouncedQuery ? <Badge variant="info">Semantic match</Badge> : null}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-xs text-[var(--vf-ink-600)]">
              <Badge variant="default">{match.opportunity.funding_type}</Badge>
              <Badge variant="default">{match.opportunity.deadline ?? "Rolling"}</Badge>
              {match.opportunity.amount_text ? <Badge variant="default">{match.opportunity.amount_text}</Badge> : null}
            </div>
            {match.highlights.length ? (
              <div className="mt-4 space-y-1 text-xs text-[var(--vf-ink-600)]">
                {match.highlights.slice(0, 2).map((highlight) => (
                  <p key={highlight}>“{highlight}”</p>
                ))}
              </div>
            ) : null}
            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" onClick={() => router.push(`/opportunities/${match.opportunity.id}`)}>
                View detail
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/opportunities/${match.opportunity.id}`)}>
                Open
              </Button>
            </div>
          </CardContent>
        </Card>
      )),
    [debouncedQuery, matches, router]
  );

  return (
    <AppShell>
      <main className="space-y-8">
        <PageHeader
          eyebrow="Opportunities"
          title="Explore funding programs"
          description={headerStatus}
          action={
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={handleSaveView}>
                Save view
              </Button>
              <Button size="sm" onClick={() => router.push("/dashboard")}>
                Back to dashboard
              </Button>
            </div>
          }
        />

        {error ? <StatusBanner tone="warning" title="Unable to load" description={error} /> : null}
        {statusMessage ? <StatusBanner tone="success" title={statusMessage} /> : null}

        {savedViews.length ? (
          <Surface tone="raised" className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Saved views</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {savedViews.map((view) => (
                <Button key={view.name} variant="ghost" size="sm" onClick={() => handleOpenView(view)}>
                  {view.name}
                </Button>
              ))}
            </div>
          </Surface>
        ) : null}

        <Surface tone="default" className="space-y-6 p-6">
          <FilterBar
            searchPlaceholder="Search by program, region, or stage"
            searchValue={query}
            onSearchChange={setQuery}
            onSearchSubmit={setDebouncedQuery}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            onSaveView={handleSaveView}
            filters={filters}
          />
          <div className="flex items-center justify-between text-xs text-[var(--vf-ink-500)]">
            <span>Showing {matches.length} results</span>
            {debouncedQuery ? <Badge variant="default">Semantic match</Badge> : null}
          </div>
        </Surface>

        {matches.length === 0 ? (
          <EmptyState
            title="No opportunities found"
            description="Try a different search term or clear filters."
            actionLabel="Clear filters"
            onAction={() => {
              setQuery("");
              setActiveFilters([]);
              setPage(0);
            }}
          />
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">{cardRows}</section>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((prev) => Math.max(0, prev - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={matches.length < 12} onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
