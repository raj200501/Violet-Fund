import type { Meta, StoryObj } from "@storybook/react";

import AppShell from "@/components/AppShell";
import { opportunityRows } from "@/storybook/data/opportunities";
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
  FilterBar,
  MetricCard,
  PageHeader,
  SegmentedControl,
  Surface
} from "@violetfund/ui";

const meta: Meta = {
  title: "Pages/Dashboard",
  component: AppShell
};

export default meta;

export const CardsView: StoryObj = {
  render: () => (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Dashboard"
          title="Funding recommendations"
          description="Curated opportunities with explainable evidence and confidence scores."
          badges={["Explainable", "Founder-first", "Auto refreshed"]}
          action={<Button size="sm">Update profile</Button>}
        />
        <Surface tone="raised" className="p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <MetricCard label="Live opportunities" value="32" delta="+8" helper="Curated daily." progress={72} tone="default" />
            <MetricCard label="Avg. confidence" value="84%" delta="+6%" helper="Profile-based scoring." progress={84} tone="positive" />
            <MetricCard label="Missing profile fields" value="3" delta="Focus" helper="Add traction metrics." progress={68} tone="warning" />
          </div>
        </Surface>
        <Surface tone="default" className="space-y-6 p-6">
          <FilterBar
            searchPlaceholder="Search by program, region, or stage"
            filters={[
              { label: "Seed", value: "seed" },
              { label: "Grant", value: "grant" },
              { label: "Accelerator", value: "accelerator" },
              { label: "Due soon", value: "deadline" }
            ]}
          />
          <div className="flex items-center justify-between">
            <SegmentedControl
              value="cards"
              onChange={() => undefined}
              options={[
                { label: "Card view", value: "cards" },
                { label: "Table view", value: "table" }
              ]}
            />
            <div className="flex items-center gap-2 text-xs text-[var(--vf-ink-500)]">
              <span>Updated 2 hours ago</span>
              <Badge variant="info">Evidence-first</Badge>
            </div>
          </div>
        </Surface>
        <div className="grid gap-6 lg:grid-cols-2">
          {opportunityRows.slice(0, 6).map((match) => (
            <Card key={match.id} className="border-[var(--vf-border-subtle)]">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle>{match.title}</CardTitle>
                    <CardDescription>{match.org}</CardDescription>
                  </div>
                  <Badge variant="info">Score {match.confidence}%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ConfidenceMeter score={match.confidence} label="Match confidence" />
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--vf-ink-600)]">
                  <Badge variant="default">{match.type}</Badge>
                  <Badge variant="default">{match.deadline}</Badge>
                  <Badge variant="default">{match.amount}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {match.tags.map((tag) => (
                    <Badge key={tag} variant="default">{tag}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm">Save</Button>
                  <Button variant="ghost" size="sm">View detail</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
};

export const TableView: StoryObj = {
  render: () => (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Dashboard"
          title="Funding recommendations"
          description="Table view with evidence chips and inline actions."
          badges={["Explainable", "Founder-first", "Auto refreshed"]}
          action={<Button size="sm">Update profile</Button>}
        />
        <Surface tone="default" className="space-y-6 p-6">
          <FilterBar
            searchPlaceholder="Search by program, region, or stage"
            filters={[
              { label: "Seed", value: "seed" },
              { label: "Grant", value: "grant" },
              { label: "Accelerator", value: "accelerator" },
              { label: "Due soon", value: "deadline" }
            ]}
          />
          <SegmentedControl
            value="table"
            onChange={() => undefined}
            options={[
              { label: "Card view", value: "cards" },
              { label: "Table view", value: "table" }
            ]}
          />
        </Surface>
        <Surface tone="default" className="p-6">
          <DataTable
            columns={[
              { key: "opportunity", label: "Opportunity" },
              { key: "type", label: "Type" },
              { key: "deadline", label: "Deadline" },
              { key: "confidence", label: "Confidence" }
            ]}
            rows={opportunityRows.map((row) => ({
              id: row.id,
              opportunity: (
                <div>
                  <p className="text-sm font-medium text-[var(--vf-ink-900)]">{row.title}</p>
                  <p className="text-xs text-[var(--vf-ink-500)]">{row.org}</p>
                </div>
              ),
              type: row.type,
              deadline: row.deadline,
              confidence: <ConfidenceMeter score={row.confidence} />
            }))}
            rowKey={(row) => row.id}
          />
        </Surface>
      </div>
    </AppShell>
  )
};
