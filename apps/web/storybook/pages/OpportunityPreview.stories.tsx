import type { Meta, StoryObj } from "@storybook/react";

import AppShell from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfidenceMeter,
  DiffViewer,
  KeyValue,
  PageHeader,
  ProgressBar,
  Surface,
  Timeline
} from "@violetfund/ui";

const meta: Meta = {
  title: "Pages/OpportunityDetail",
  component: AppShell
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Opportunity"
          title="Aurora Women in Climate Grant"
          description="Aurora Ventures"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Opportunities", href: "/dashboard" },
            { label: "Aurora Women in Climate Grant" }
          ]}
          badges={["Grant", "Aug 28", "Explainable"]}
          action={<Button size="sm">Save opportunity</Button>}
        />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Surface tone="raised" className="space-y-6 p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--vf-ink-900)]">Opportunity overview</h2>
              <p className="text-sm text-[var(--vf-ink-600)]">
                Aurora Ventures supports climate founders with catalytic grants. Priority is given to women-led teams with measurable
                impact and community partnerships.
              </p>
            </div>
            <KeyValue
              columns={2}
              items={[
                { label: "Funding type", value: "Grant" },
                { label: "Award amount", value: "$75,000" },
                { label: "Deadline", value: "Aug 28" },
                { label: "Region", value: "North America" },
                { label: "Stage", value: "Seed" },
                { label: "Match confidence", value: "86%" }
              ]}
            />
            <Card className="border-[var(--vf-border-subtle)]">
              <CardHeader>
                <CardTitle>Eligibility evidence</CardTitle>
                <CardDescription>Highlights extracted from the source application guide.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[var(--vf-ink-600)]">
                  <li>• Women-led team with a measurable climate outcome.</li>
                  <li>• Seed-stage companies with community partnerships.</li>
                  <li>• Evidence of pilot traction in target markets.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-[var(--vf-border-subtle)]">
              <CardHeader>
                <CardTitle>Funding confidence</CardTitle>
                <CardDescription>How aligned your profile is with the program criteria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ConfidenceMeter score={86} label="Match confidence" />
                <ProgressBar value={74} tone="warning" label="Evidence completeness" />
                <ProgressBar value={90} tone="success" label="Mission alignment" />
              </CardContent>
            </Card>
          </Surface>
          <div className="space-y-6">
            <Surface tone="hero" className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-[var(--vf-ink-900)]">Recommended next actions</h2>
              <Timeline
                items={[
                  { title: "Eligibility checklist", time: "Today", description: "Confirm women-led status and climate metrics." },
                  { title: "Narrative refinement", time: "Next 2 days", description: "Draft an impact narrative for reviewers." },
                  { title: "Financial validation", time: "Next week", description: "Prepare traction and budget evidence." }
                ]}
              />
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Add to tracker</Button>
                <Button variant="outline" size="sm">Assign owner</Button>
              </div>
            </Surface>
            <Surface tone="raised" className="space-y-4 p-6">
              <h3 className="text-sm font-semibold text-[var(--vf-ink-900)]">Evidence diff preview</h3>
              <DiffViewer
                beforeText="Applicants must be women-led, seed-stage, and operate within North America."
                afterText="Applicants must be women-led, seed-stage, and operate within North America or select global regions."
              />
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Impact</Badge>
                <Badge variant="default">Seed stage</Badge>
                <Badge variant="default">Women-led</Badge>
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </AppShell>
  )
};
