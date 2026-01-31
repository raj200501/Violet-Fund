import type { Meta, StoryObj } from "@storybook/react";

import { Button, Drawer, Input } from "@violetfund/ui";

const meta: Meta<typeof Drawer> = {
  title: "Primitives/Drawer",
  component: Drawer
};

export default meta;

export const Default: StoryObj<typeof Drawer> = {
  render: () => (
    <div className="h-[520px]">
      <Drawer
        title="Update opportunity"
        footer={
          <>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button size="sm">Save changes</Button>
          </>
        }
      >
        <Input label="Title" defaultValue="Aurora Women in Climate Grant" />
        <Input label="Deadline" defaultValue="Aug 28" />
        <Input label="Funding type" defaultValue="Grant" />
      </Drawer>
    </div>
  )
};
