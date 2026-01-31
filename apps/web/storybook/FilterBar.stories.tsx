import type { Meta, StoryObj } from "@storybook/react";

import { FilterBar } from "@violetfund/ui";

const meta: Meta<typeof FilterBar> = {
  title: "Composites/FilterBar",
  component: FilterBar
};

export default meta;

export const Default: StoryObj<typeof FilterBar> = {
  render: () => (
    <FilterBar
      searchPlaceholder="Search by program, region, or stage"
      filters={[
        { label: "Seed", value: "seed" },
        { label: "Pre-seed", value: "pre-seed" },
        { label: "Grant", value: "grant" },
        { label: "Accelerator", value: "accelerator" },
        { label: "Due soon", value: "deadline" }
      ]}
    />
  )
};
