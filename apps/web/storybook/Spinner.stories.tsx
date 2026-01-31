import type { Meta, StoryObj } from "@storybook/react";

import { Spinner } from "@violetfund/ui";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner
};

export default meta;

export const Default: StoryObj<typeof Spinner> = {
  render: () => (
    <div className="flex items-center gap-3">
      <Spinner />
      <span className="text-sm text-[var(--vf-ink-600)]">Loading recommendations...</span>
    </div>
  )
};
