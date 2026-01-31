import type { Meta, StoryObj } from "@storybook/react";

import AppShell from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DiffViewer,
  Input,
  PageHeader,
  ProgressBar,
  Surface,
  Textarea
} from "@violetfund/ui";

const meta: Meta = {
  title: "Pages/Labeling",
  component: AppShell
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Verify & Improve"
          title="Labeling quality workspace"
          description="Correct extraction errors, preview diffs, and see measurable ranking changes."
          badges={["Human-in-the-loop", "Diff preview", "Instant impact"]}
          action={<Button size="sm">Start review</Button>}
        />
        <Surface tone="raised" className="p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Surface tone="default" className="space-y-3 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Open tasks</p>
              <p className="text-2xl font-semibold text-[var(--vf-ink-900)]">2</p>
              <ProgressBar value={64} />
            </Surface>
            <Surface tone="default" className="space-y-3 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Avg. rank lift</p>
              <p className="text-2xl font-semibold text-[var(--vf-ink-900)]">+12.4%</p>
              <ProgressBar value={82} tone="success" />
            </Surface>
            <Surface tone="default" className="space-y-3 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Coverage score</p>
              <p className="text-2xl font-semibold text-[var(--vf-ink-900)]">88</p>
              <ProgressBar value={88} />
            </Surface>
          </div>
        </Surface>
        <Card className="border-[var(--vf-border-subtle)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Opportunity #120</CardTitle>
              <Badge variant="info">3 fields</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Surface tone="default" className="space-y-3 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Raw source</p>
                <Textarea
                  rows={6}
                  value="Applicants must be women-led, seed-stage, and operate within North America. Funding supports climate impact solutions."
                />
              </Surface>
              <Surface tone="default" className="space-y-3 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Extracted fields</p>
                <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                  <li>Stage: Seed</li>
                  <li>Region: North America</li>
                  <li>Eligibility: Women-led climate startups</li>
                </ul>
              </Surface>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Surface tone="raised" className="space-y-4 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Corrections</p>
                <Input label="Correct stage" placeholder="Seed" />
                <Input label="Correct region" placeholder="North America" />
                <Input label="Correct eligibility" placeholder="Women-led climate startups" />
                <Button size="sm">Save corrections</Button>
              </Surface>
              <Surface tone="raised" className="space-y-4 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Diff preview</p>
                <DiffViewer
                  beforeText="Applicants must be women-led, seed-stage, and operate within North America."
                  afterText="Applicants must be women-led, seed-stage, and operate within North America with measurable impact outcomes."
                />
              </Surface>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
};
