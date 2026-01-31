import type { Meta, StoryObj } from "@storybook/react";

import { Card, CardContent, CardHeader, Skeleton } from "@violetfund/ui";

const meta: Meta<typeof Skeleton> = {
  title: "Primitives/Skeleton",
  component: Skeleton
};

export default meta;

export const LoadingCard: StoryObj<typeof Skeleton> = {
  render: () => (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  )
};
