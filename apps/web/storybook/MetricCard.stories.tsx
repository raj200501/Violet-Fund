import type { Meta, StoryObj } from "@storybook/react";

import { MetricCard } from "@violetfund/ui";

const meta: Meta<typeof MetricCard> = {
  title: "Layout/MetricCard",
  component: MetricCard
};

export default meta;

export const Variants: StoryObj<typeof MetricCard> = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard label="Match confidence" value="84%" delta="+6%" helper="Based on profile signals." progress={84} tone="positive" />
      <MetricCard label="Upcoming deadlines" value="6" delta="2 this week" helper="Keep high-fit entries moving." progress={66} tone="warning" />
      <MetricCard label="Saved views" value="5" helper="Custom filters and queues." progress={45} tone="default" />
    </div>
  )
};
