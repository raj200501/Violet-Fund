import type { Meta, StoryObj } from "@storybook/react";

import { EmptyState } from "@violetfund/ui";

const meta: Meta<typeof EmptyState> = {
  title: "Layout/EmptyState",
  component: EmptyState
};

export default meta;

export const Default: StoryObj<typeof EmptyState> = {
  render: () => (
    <EmptyState
      title="No saved opportunities"
      description="Save a few opportunities to build your tracker."
      actionLabel="Browse recommendations"
    />
  )
};
