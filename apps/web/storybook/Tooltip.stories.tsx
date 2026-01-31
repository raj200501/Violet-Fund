import type { Meta, StoryObj } from "@storybook/react";

import { Button, Tooltip } from "@violetfund/ui";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip
};

export default meta;

export const Default: StoryObj<typeof Tooltip> = {
  render: () => (
    <Tooltip label="Explainable match confidence">
      <Button variant="outline" size="sm">
        Hover for tooltip
      </Button>
    </Tooltip>
  )
};
