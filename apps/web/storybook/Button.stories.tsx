import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@violetfund/ui";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: "Primary action"
  }
};

export const Variants: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
};

export const Sizes: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

export const Loading: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button isLoading>Loading</Button>
      <Button variant="outline" isLoading>
        Fetching
      </Button>
    </div>
  )
};
