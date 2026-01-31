import type { Meta, StoryObj } from "@storybook/react";

import { Button, Popover } from "@violetfund/ui";

const meta: Meta<typeof Popover> = {
  title: "Primitives/Popover",
  component: Popover
};

export default meta;

export const Default: StoryObj<typeof Popover> = {
  render: () => (
    <Popover trigger={<Button variant="outline">Open popover</Button>}>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Evidence filters</p>
        <p className="text-xs text-[var(--vf-ink-600)]">
          Choose which evidence types to display in recommendations.
        </p>
        <Button size="sm">Apply filters</Button>
      </div>
    </Popover>
  )
};
