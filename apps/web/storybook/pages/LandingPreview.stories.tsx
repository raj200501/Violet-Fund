import type { Meta, StoryObj } from "@storybook/react";

import Nav from "@/components/Nav";
import Landing from "@/components/marketing/Landing";

const meta: Meta<typeof Landing> = {
  title: "Pages/Landing",
  component: Landing
};

export default meta;

export const Default: StoryObj<typeof Landing> = {
  render: () => (
    <div className="space-y-10">
      <Nav />
      <Landing />
    </div>
  )
};
