import type { Meta, StoryObj } from "@storybook/react";

import { ProgressBar } from "@violetfund/ui";

const meta: Meta<typeof ProgressBar> = {
  title: "Primitives/ProgressBar",
  component: ProgressBar
};

export default meta;

export const Variants: StoryObj<typeof ProgressBar> = {
  render: () => (
    <div className="space-y-4">
      <ProgressBar value={72} label="Profile completion" tone="primary" />
      <ProgressBar value={48} label="Funding readiness" tone="warning" />
      <ProgressBar value={88} label="Evidence coverage" tone="success" />
      <ProgressBar value={32} label="Risk alerts" tone="danger" />
    </div>
  )
};
