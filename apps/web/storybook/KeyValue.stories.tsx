import type { Meta, StoryObj } from "@storybook/react";

import { KeyValue } from "@violetfund/ui";

const meta: Meta<typeof KeyValue> = {
  title: "Layout/KeyValue",
  component: KeyValue
};

export default meta;

export const Default: StoryObj<typeof KeyValue> = {
  render: () => (
    <KeyValue
      columns={3}
      items={[
        { label: "Funding type", value: "Grant", hint: "Non-dilutive" },
        { label: "Award amount", value: "$75,000", hint: "Typical range" },
        { label: "Deadline", value: "Aug 28", hint: "Apply early" },
        { label: "Region", value: "North America", hint: "Evidence confirmed" },
        { label: "Stage", value: "Seed", hint: "Eligibility" },
        { label: "Match confidence", value: "86%", hint: "Profile-based" }
      ]}
    />
  )
};
