import type { Meta, StoryObj } from "@storybook/react";

import { Toast } from "@violetfund/ui";

const meta: Meta<typeof Toast> = {
  title: "Primitives/Toast",
  component: Toast
};

export default meta;

export const Variants: StoryObj<typeof Toast> = {
  render: () => (
    <div className="space-y-3">
      <Toast title="Evidence updated" description="Confidence score increased by 6%." variant="success" />
      <Toast title="New deadline" description="Aurora grant closes in 14 days." variant="warning" />
      <Toast title="Sync failed" description="Reconnect your account to sync data." variant="danger" />
      <Toast title="Demo data enabled" description="Showing curated preview data." variant="info" />
    </div>
  )
};
