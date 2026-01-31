import type { Meta, StoryObj } from "@storybook/react";

import { ActivityFeed } from "@violetfund/ui";

const meta: Meta<typeof ActivityFeed> = {
  title: "Composites/ActivityFeed",
  component: ActivityFeed
};

export default meta;

export const Default: StoryObj<typeof ActivityFeed> = {
  render: () => (
    <ActivityFeed
      items={[
        { title: "New grant added", description: "Aurora Women in Climate Grant added to your list.", time: "2 hours ago" },
        { title: "Confidence updated", description: "Profile changes improved match score by 6%.", time: "Yesterday" },
        { title: "Deadline reminder", description: "Catalyst Accelerator closes in 10 days.", time: "Monday" }
      ]}
    />
  )
};
