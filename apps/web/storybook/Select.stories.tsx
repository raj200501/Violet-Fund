import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "@violetfund/ui";

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select
};

export default meta;

const options = [
  { label: "Select stage", value: "" },
  { label: "Pre-seed", value: "pre-seed" },
  { label: "Seed", value: "seed" },
  { label: "Series A", value: "series-a" }
];

export const Default: StoryObj<typeof Select> = {
  args: {
    label: "Stage",
    options
  }
};

export const WithHint: StoryObj<typeof Select> = {
  args: {
    label: "Funding type",
    hint: "Used to filter grants and accelerators",
    options: [
      { label: "Select type", value: "" },
      { label: "Grant", value: "grant" },
      { label: "Accelerator", value: "accelerator" },
      { label: "Equity", value: "equity" }
    ]
  }
};

export const WithError: StoryObj<typeof Select> = {
  args: {
    label: "Region",
    error: "Select a region to continue",
    options: [
      { label: "Select region", value: "" },
      { label: "North America", value: "na" },
      { label: "Europe", value: "eu" },
      { label: "LatAm", value: "latam" }
    ]
  }
};
