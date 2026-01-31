import type { Meta, StoryObj } from "@storybook/react";

import { Command } from "@violetfund/ui";

const meta: Meta<typeof Command> = {
  title: "Primitives/Command",
  component: Command
};

export default meta;

export const Default: StoryObj<typeof Command> = {
  render: () => (
    <Command
      placeholder="Jump to..."
      items={[
        { label: "Open dashboard", shortcut: "D" },
        { label: "Create opportunity", shortcut: "O" },
        { label: "Update profile", shortcut: "P" },
        { label: "View tracker", shortcut: "T" }
      ]}
    />
  )
};
