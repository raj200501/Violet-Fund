import type { Meta, StoryObj } from "@storybook/react";

import { StatCards } from "@violetfund/ui";

const meta: Meta<typeof StatCards> = {
  title: "Composites/StatCards",
  component: StatCards
};

export default meta;

export const Default: StoryObj<typeof StatCards> = {
  render: () => (
    <StatCards
      stats={[
        { label: "Opportunities monitored", value: "1,280", delta: "+18%", description: "Curated daily." },
        { label: "Avg. confidence", value: "84%", delta: "+6%", description: "Based on profile signals." },
        { label: "Active applications", value: "18", delta: "+4", description: "Across grants and accelerators." }
      ]}
    />
  )
};
