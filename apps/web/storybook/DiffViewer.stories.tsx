import type { Meta, StoryObj } from "@storybook/react";

import { DiffViewer } from "@violetfund/ui";

const meta: Meta<typeof DiffViewer> = {
  title: "Composites/DiffViewer",
  component: DiffViewer
};

export default meta;

export const Default: StoryObj<typeof DiffViewer> = {
  render: () => (
    <DiffViewer
      beforeText="Applicants must be women-led, seed-stage, and operate within North America."
      afterText="Applicants must be women-led, seed-stage, and operate within North America or select global regions."
    />
  )
};
