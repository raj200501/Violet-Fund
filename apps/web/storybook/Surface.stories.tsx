import type { Meta, StoryObj } from "@storybook/react";

import { Surface } from "@violetfund/ui";

const meta: Meta<typeof Surface> = {
  title: "Layout/Surface",
  component: Surface
};

export default meta;

export const Tones: StoryObj<typeof Surface> = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Surface tone="default" className="p-6">Default surface</Surface>
      <Surface tone="raised" className="p-6">Raised surface</Surface>
      <Surface tone="sunken" className="p-6">Sunken surface</Surface>
      <Surface tone="hero" className="p-6">Hero surface</Surface>
    </div>
  )
};
