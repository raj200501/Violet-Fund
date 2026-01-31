import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { SegmentedControl } from "@violetfund/ui";

const meta: Meta<typeof SegmentedControl> = {
  title: "Primitives/SegmentedControl",
  component: SegmentedControl
};

export default meta;

export const Default: StoryObj<typeof SegmentedControl> = {
  render: () => {
    const [value, setValue] = useState("cards");

    return (
      <div className="space-y-3">
        <SegmentedControl
          value={value}
          onChange={setValue}
          options={[
            { label: "Cards", value: "cards" },
            { label: "Table", value: "table" },
            { label: "Analytics", value: "analytics" }
          ]}
        />
        <p className="text-sm text-[var(--vf-ink-600)]">Selected: {value}</p>
      </div>
    );
  }
};
