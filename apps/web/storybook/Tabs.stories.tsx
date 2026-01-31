import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Tabs } from "@violetfund/ui";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs
};

export default meta;

export const Default: StoryObj<typeof Tabs> = {
  render: () => {
    const [value, setValue] = useState("overview");

    return (
      <div className="space-y-4">
        <Tabs
          value={value}
          onValueChange={setValue}
          tabs={[
            { label: "Overview", value: "overview" },
            { label: "Evidence", value: "evidence" },
            { label: "Activity", value: "activity" }
          ]}
        />
        <p className="text-sm text-[var(--vf-ink-600)]">Selected: {value}</p>
      </div>
    );
  }
};
