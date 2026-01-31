import type { Meta, StoryObj } from "@storybook/react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@violetfund/ui";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card
};

export default meta;

export const Default: StoryObj<typeof Card> = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity summary</CardTitle>
        <CardDescription>Explainable match evidence preview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">Score 84%</Badge>
          <Badge variant="default">Grant</Badge>
          <Badge variant="default">Rolling</Badge>
        </div>
        <p className="text-sm text-[var(--vf-ink-600)]">
          “Priority for climate solutions with measurable outcomes and partnerships.”
        </p>
        <Button size="sm">View detail</Button>
      </CardContent>
    </Card>
  )
};
