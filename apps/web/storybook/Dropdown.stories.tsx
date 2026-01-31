import type { Meta, StoryObj } from "@storybook/react";

import { Dropdown } from "@violetfund/ui";

const meta: Meta<typeof Dropdown> = {
  title: "Primitives/Dropdown",
  component: Dropdown
};

export default meta;

export const Default: StoryObj<typeof Dropdown> = {
  render: () => (
    <Dropdown
      label="Quick actions"
      items={[
        { label: "Save to tracker", value: "save", description: "Add to your pipeline" },
        { label: "Request intro", value: "intro", description: "Share with advisor" },
        { label: "Archive", value: "archive", description: "Hide from recommendations" }
      ]}
    />
  )
};
