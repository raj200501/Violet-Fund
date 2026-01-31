import type { Meta, StoryObj } from "@storybook/react";

import { KanbanBoard } from "@violetfund/ui";

const meta: Meta<typeof KanbanBoard> = {
  title: "Composites/KanbanBoard",
  component: KanbanBoard
};

export default meta;

export const Default: StoryObj<typeof KanbanBoard> = {
  render: () => (
    <KanbanBoard
      columns={[
        {
          id: "saved",
          title: "Saved",
          items: [
            { id: "1", title: "Aurora Climate Grant", subtitle: "Due Aug 28", tag: "High fit" },
            { id: "2", title: "Northwind Growth Fund", subtitle: "Due Sep 12", tag: "Equity" }
          ]
        },
        {
          id: "planned",
          title: "Planned",
          items: [
            { id: "3", title: "Catalyst Accelerator", subtitle: "Rolling", tag: "Cohort" },
            { id: "4", title: "Meridian Prize", subtitle: "Due Oct 05", tag: "Impact" }
          ]
        },
        {
          id: "in-progress",
          title: "In progress",
          items: [
            { id: "5", title: "FemmeTech Partnerships", subtitle: "Rolling", tag: "Partnership" }
          ]
        },
        {
          id: "submitted",
          title: "Submitted",
          items: [{ id: "6", title: "Bloom Innovators", subtitle: "Submitted Aug 02", tag: "Awaiting" }]
        }
      ]}
    />
  )
};
