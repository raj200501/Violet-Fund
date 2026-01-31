import type { Meta, StoryObj } from "@storybook/react";

import { Button, SectionHeader } from "@violetfund/ui";

const meta: Meta<typeof SectionHeader> = {
  title: "Layout/SectionHeader",
  component: SectionHeader
};

export default meta;

export const Default: StoryObj<typeof SectionHeader> = {
  render: () => (
    <SectionHeader
      eyebrow="Insights"
      title="Funding readiness"
      description="Track which signals need attention to reach high-confidence recommendations."
      action={<Button size="sm">Review signals</Button>}
    />
  )
};
