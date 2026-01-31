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
  Input,
  PageHeader,
  ProgressBar,
  Surface,
  Textarea
} from "@violetfund/ui";

const meta: Meta = {
  title: "Pages/ProfileWizard",
  component: AppShell
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <AppShell>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Profile wizard"
          title="Founder profile & recommendation quality"
          description="Multi-step profile builder with autosave and measurable impact on recommendations."
          badges={["Autosave", "Guided steps", "Quality meter"]}
          action={<Button size="sm">Invite collaborator</Button>}
        />
        <Surface tone="raised" className="p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
            <Surface tone="default" className="space-y-4 p-4">
              <ConfidenceMeter score={82} label="Profile quality" />
              <ProgressBar value={82} label="Completion" />
              <div className="grid gap-3 text-sm text-[var(--vf-ink-600)]">
                <p>Top signals to unlock higher confidence:</p>
                <ul className="space-y-1">
                  <li>• Share traction milestones and ARR.</li>
                  <li>• Add verified women-owned certifications.</li>
                  <li>• Provide impact metrics and outcome evidence.</li>
                </ul>
              </div>
            </Surface>
            <Surface tone="default" className="space-y-4 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">Current step</p>
              <div className="space-y-3">
                {[
                  { label: "Company", active: true },
                  { label: "Traction", active: false },
                  { label: "Impact", active: false },
                  { label: "Funding", active: false }
                ].map((step) => (
                  <div
                    key={step.label}
                    className={`flex items-center justify-between rounded-[var(--vf-radius-lg)] border px-4 py-3 text-sm ${
                      step.active
                        ? "border-[var(--vf-violet-300)] bg-[var(--vf-violet-50)] text-[var(--vf-ink-900)]"
                        : "border-[var(--vf-border)] bg-[var(--vf-surface)] text-[var(--vf-ink-600)]"
                    }`}
                  >
                    <span>{step.label}</span>
                    <Badge variant={step.active ? "info" : "default"}>Step</Badge>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </Surface>
        <Card className="border-[var(--vf-border-subtle)]">
          <CardHeader>
            <CardTitle>Company details</CardTitle>
            <CardDescription>Anchor your industry, location, and stage for accurate matching.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Input label="Industry" placeholder="Climate, fintech, health" />
            <Input label="Stage" placeholder="Pre-seed, seed, Series A" />
            <Input label="Location" placeholder="City, region" />
            <Input label="Team size" placeholder="4 full-time" />
          </CardContent>
        </Card>
        <Card className="border-[var(--vf-border-subtle)]">
          <CardHeader>
            <CardTitle>Traction & momentum</CardTitle>
            <CardDescription>Share revenue, users, and traction so we can surface higher quality matches.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Input label="Revenue range" placeholder="$10k-$50k MRR" />
            <Input label="Runway months" placeholder="12 months" />
            <Textarea label="Traction milestones" rows={4} placeholder="Pilot partners, growth milestones" />
            <Textarea label="Funding history" rows={4} placeholder="Grants received, equity rounds" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
};
