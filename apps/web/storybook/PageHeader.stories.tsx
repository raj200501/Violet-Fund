import type { Meta, StoryObj } from "@storybook/react";

import { Button, PageHeader } from "@violetfund/ui";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader
};

export default meta;

export const Default: StoryObj<typeof PageHeader> = {
  render: () => (
    <PageHeader
      eyebrow="Dashboard"
      title="Funding recommendations"
      description="Curated opportunities with explainable evidence and confidence scores."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Funding recommendations" }
      ]}
      badges={["Explainable", "Founder-first", "Auto refreshed"]}
      action={<Button size="sm">Update profile</Button>}
    />
  )
};
