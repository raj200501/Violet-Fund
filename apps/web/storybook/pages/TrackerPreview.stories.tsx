import type { Meta, StoryObj } from "@storybook/react";

import AppShell from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  ProgressBar,
  SegmentedControl,
  Surface
} from "@violetfund/ui";

const meta: Meta = {
  title: "Pages/Tracker",
  component: AppShell
};

export default meta;

const stages = [
  {
    title: "Saved",
    items: [
      { name: "Aurora Climate Grant", note: "Due Aug 28" },
      { name: "Northwind Growth Fund", note: "Due Sep 12" }
    ]
  },
  {
    title: "Planned",
    items: [
      { name: "Catalyst Accelerator", note: "Drafting narrative" },
      { name: "Meridian Prize", note: "Collecting letters" }
    ]
  },
  {
    title: "In progress",
    items: [{ name: "FemmeTech Partnerships", note: "Budget review" }]
  },
  {
    title: "Submitted",
    items: [{ name: "Bloom Equity Sprint", note: "Awaiting response" }]
  }
];

export const Kanban: StoryObj = {
  render: () => (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Tracker"
          title="Application tracker"
          description="Drag cards across stages or switch to analytics for pipeline health."
          badges={["Kanban", "Analytics", "Collaborative"]}
          action={<Button size="sm">Create application</Button>}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SegmentedControl
            value="kanban"
            onChange={() => undefined}
            options={[
              { label: "Kanban", value: "kanban" },
              { label: "Analytics", value: "analytics" }
            ]}
          />
          <div className="flex items-center gap-2 text-xs text-[var(--vf-ink-500)]">
            <span>Updated 1 hour ago</span>
            <Badge variant="info">Pipeline health</Badge>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {stages.map((stage) => (
            <Surface key={stage.title} tone="raised" className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{stage.title}</p>
                <Badge variant="info">{stage.items.length}</Badge>
              </div>
              <div className="space-y-3">
                {stage.items.map((item) => (
                  <div key={item.name} className="rounded-[var(--vf-radius-md)] border border-[var(--vf-border)] bg-[var(--vf-surface-100)] p-3">
                    <p className="text-sm font-medium text-[var(--vf-ink-900)]">{item.name}</p>
                    <p className="text-xs text-[var(--vf-ink-500)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </AppShell>
  )
};

export const Analytics: StoryObj = {
  render: () => (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Tracker"
          title="Pipeline analytics"
          description="Monitor stage distribution and upcoming deadlines."
          badges={["Analytics", "Pipeline health"]}
          action={<Button size="sm">Share report</Button>}
        />
        <Surface tone="raised" className="space-y-4 p-6">
          <Card className="border-[var(--vf-border-subtle)]">
            <CardHeader>
              <CardTitle>Stage distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.map((stage) => (
                <div key={stage.title} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--vf-ink-900)]">{stage.title}</span>
                    <span className="text-[var(--vf-ink-500)]">{stage.items.length} apps</span>
                  </div>
                  <ProgressBar value={stage.items.length * 18} />
                </div>
              ))}
            </CardContent>
          </Card>
        </Surface>
      </div>
    </AppShell>
  )
};
