import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@violetfund/ui";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input
};

export default meta;

export const Default: StoryObj<typeof Input> = {
  args: {
    label: "Company name",
    placeholder: "VioletFund"
  }
};

export const WithHint: StoryObj<typeof Input> = {
  render: () => (
    <div className="space-y-4">
      <Input label="Founder email" placeholder="name@company.com" hint="We never share this." />
      <Input label="Website" placeholder="https://" hint="Used for sourcing evidence." />
    </div>
  )
};

export const WithError: StoryObj<typeof Input> = {
  args: {
    label: "Team size",
    placeholder: "0",
    error: "Team size is required."
  }
};
