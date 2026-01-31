import type { Meta, StoryObj } from "@storybook/react";

import { Timeline } from "@violetfund/ui";

const meta: Meta<typeof Timeline> = {
  title: "Composites/Timeline",
  component: Timeline
};

export default meta;

export const Default: StoryObj<typeof Timeline> = {
  render: () => (
    <Timeline
      items={[
        {
          title: "Profile calibration",
          time: "Today",
          description: "Capture traction, impact, and leadership signals."
        },
        {
          title: "Review evidence",
          time: "This week",
          description: "Confirm eligibility and add missing documentation."
        },
        {
          title: "Submit application",
          time: "Next 14 days",
          description: "Finalize pitch, budget, and submit before deadline."
        }
      ]}
    />
  )
};
