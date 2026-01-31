import type { Meta, StoryObj } from "@storybook/react";

import { Badge, Button, ConfidenceMeter, DataTable } from "@violetfund/ui";

const meta: Meta<typeof DataTable> = {
  title: "Composites/DataTable",
  component: DataTable
};

export default meta;

const rows = [
  {
    id: "1",
    opportunity: "Aurora Women in Climate Grant",
    confidence: <ConfidenceMeter score={86} />,
    type: "Grant",
    deadline: "Aug 28",
    evidence: (
      <div className="flex flex-wrap gap-1">
        <Badge variant="info">Women-led</Badge>
        <Badge variant="default">Climate</Badge>
      </div>
    ),
    action: <Button size="sm" variant="ghost">View</Button>
  },
  {
    id: "2",
    opportunity: "Catalyst Founders Accelerator",
    confidence: <ConfidenceMeter score={82} />,
    type: "Accelerator",
    deadline: "Rolling",
    evidence: (
      <div className="flex flex-wrap gap-1">
        <Badge variant="info">B2B SaaS</Badge>
        <Badge variant="default">Seed</Badge>
      </div>
    ),
    action: <Button size="sm" variant="ghost">View</Button>
  },
  {
    id: "3",
    opportunity: "Meridian Social Impact Prize",
    confidence: <ConfidenceMeter score={76} />,
    type: "Prize",
    deadline: "Oct 05",
    evidence: (
      <div className="flex flex-wrap gap-1">
        <Badge variant="info">Impact</Badge>
        <Badge variant="default">Education</Badge>
      </div>
    ),
    action: <Button size="sm" variant="ghost">View</Button>
  }
];

export const Default: StoryObj<typeof DataTable> = {
  render: () => (
    <DataTable
      columns={[
        { key: "opportunity", label: "Opportunity" },
        { key: "confidence", label: "Confidence" },
        { key: "type", label: "Type" },
        { key: "deadline", label: "Deadline" },
        { key: "evidence", label: "Evidence" },
        { key: "action", label: "" }
      ]}
      rows={rows}
      rowKey={(row) => row.id}
    />
  )
};
