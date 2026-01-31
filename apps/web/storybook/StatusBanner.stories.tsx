import type { Meta, StoryObj } from "@storybook/react";

import { Button, StatusBanner } from "@violetfund/ui";

const meta: Meta<typeof StatusBanner> = {
  title: "Layout/StatusBanner",
  component: StatusBanner
};

export default meta;

export const Variants: StoryObj<typeof StatusBanner> = {
  render: () => (
    <div className="space-y-3">
      <StatusBanner title="Demo data enabled" description="Connect your account to sync live recommendations." />
      <StatusBanner
        tone="success"
        title="Profile saved"
        description="Your recommendations will refresh shortly."
        action={<Button size="sm">View dashboard</Button>}
      />
      <StatusBanner tone="warning" title="Deadline approaching" description="Aurora grant closes in 7 days." />
      <StatusBanner tone="danger" title="Sync failed" description="Reconnect to sync opportunities." />
    </div>
  )
};
