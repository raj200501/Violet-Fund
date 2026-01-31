import type { Meta, StoryObj } from "@storybook/react";

import { Button, Dialog, Input } from "@violetfund/ui";

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog
};

export default meta;

export const Default: StoryObj<typeof Dialog> = {
  render: () => (
    <Dialog
      title="Invite collaborator"
      description="Share access to your funding workspace."
      footer={
        <>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Send invite</Button>
        </>
      }
    >
      <Input label="Email" placeholder="name@company.com" />
      <Input label="Role" placeholder="Advisor" />
    </Dialog>
  )
};
