import type { Meta, StoryObj } from "@storybook/react";

import { Button, Toolbar } from "@violetfund/ui";

const meta: Meta<typeof Toolbar> = {
  title: "Layout/Toolbar",
  component: Toolbar
};

export default meta;

export const Default: StoryObj<typeof Toolbar> = {
  render: () => (
    <Toolbar
      title="Saved views"
      description="Jump into the queues you use most often."
      action={<Button size="sm">Create view</Button>}
    />
  )
};
