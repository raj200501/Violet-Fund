import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "@violetfund/ui";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar
};

export default meta;

export const Sizes: StoryObj<typeof Avatar> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar name="Morgan Lee" size="xs" />
      <Avatar name="Morgan Lee" size="sm" status="online" />
      <Avatar name="Morgan Lee" size="md" status="away" />
      <Avatar name="Morgan Lee" size="lg" status="offline" />
      <Avatar name="Morgan Lee" size="xl" />
    </div>
  )
};
