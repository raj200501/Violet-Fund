import type { Meta, StoryObj } from "@storybook/react";

import { ConfidenceMeter } from "@violetfund/ui";

const meta: Meta<typeof ConfidenceMeter> = {
  title: "Composites/ConfidenceMeter",
  component: ConfidenceMeter
};

export default meta;

export const Variants: StoryObj<typeof ConfidenceMeter> = {
  render: () => (
    <div className="space-y-4">
      <ConfidenceMeter score={92} label="High confidence" />
      <ConfidenceMeter score={74} label="Medium confidence" />
      <ConfidenceMeter score={48} label="Needs improvement" />
    </div>
  )
};
