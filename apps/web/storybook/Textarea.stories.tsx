import type { Meta, StoryObj } from "@storybook/react";

import { Textarea } from "@violetfund/ui";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea
};

export default meta;

export const Default: StoryObj<typeof Textarea> = {
  args: {
    label: "Impact narrative",
    placeholder: "Describe your mission and measurable outcomes",
    rows: 5
  }
};
