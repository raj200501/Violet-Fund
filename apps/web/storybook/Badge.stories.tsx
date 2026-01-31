import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@violetfund/ui";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge
};

export default meta;

export const Variants: StoryObj<typeof Badge> = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  )
};
