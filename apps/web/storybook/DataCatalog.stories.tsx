import type { Meta, StoryObj } from "@storybook/react";

import { fundingPrograms } from "@/storybook/data/fundingPrograms";
import { founderProfiles } from "@/storybook/data/founderProfiles";
import { evidenceSnippets } from "@/storybook/data/evidenceSnippets";
import {
  Badge,
  Button,
  ConfidenceMeter,
  DataTable,
  PageHeader,
  ProgressBar,
  SectionHeader,
  Surface
} from "@violetfund/ui";

const meta: Meta = {
  title: "Foundations/DataCatalog",
  component: Surface
};

export default meta;

export const Programs: StoryObj = {
  render: () => (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Catalog"
        title="Funding program catalog"
        description="Sample dataset used across the VioletFund UI previews."
        badges={["120 programs", "Global coverage", "Explainable"]}
        action={<Button size="sm">Export data</Button>}
      />
      <Surface tone="raised" className="p-6">
        <SectionHeader
          eyebrow="Programs"
          title="Funding programs"
          description="Evidence-backed opportunities enriched with tags and confidence scores."
        />
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "program", label: "Program" },
              { key: "type", label: "Type" },
              { key: "deadline", label: "Deadline" },
              { key: "confidence", label: "Confidence" }
            ]}
            rows={fundingPrograms.slice(0, 20).map((program) => ({
              id: program.id,
              program: (
                <div>
                  <p className="text-sm font-medium text-[var(--vf-ink-900)]">{program.title}</p>
                  <p className="text-xs text-[var(--vf-ink-500)]">{program.org}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {program.tags.map((tag) => (
                      <Badge key={tag} variant="default">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ),
              type: program.type,
              deadline: program.deadline,
              confidence: <ConfidenceMeter score={program.confidence} />
            }))}
            rowKey={(row) => row.id}
          />
        </div>
      </Surface>
      <Surface tone="raised" className="p-6">
        <SectionHeader
          eyebrow="Founders"
          title="Founder readiness signals"
          description="Signals used to personalize recommendations and explain match confidence."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {founderProfiles.slice(0, 8).map((founder) => (
            <Surface key={founder.id} tone="default" className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{founder.name}</p>
                  <p className="text-xs text-[var(--vf-ink-500)]">{founder.company}</p>
                </div>
                <Badge variant="info">{founder.stage}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--vf-ink-600)]">
                <Badge variant="default">{founder.region}</Badge>
                <Badge variant="default">{founder.focus}</Badge>
              </div>
              <ProgressBar value={founder.readinessScore} label="Readiness" />
            </Surface>
          ))}
        </div>
      </Surface>
      <Surface tone="raised" className="p-6">
        <SectionHeader
          eyebrow="Evidence"
          title="Evidence snippets"
          description="Structured evidence statements used for explainable matching."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {evidenceSnippets.slice(0, 12).map((snippet) => (
            <Surface key={snippet.id} tone="default" className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{snippet.label}</p>
                <Badge variant="default">{snippet.category}</Badge>
              </div>
              <p className="text-xs text-[var(--vf-ink-500)]">{snippet.summary}</p>
              <p className="text-sm text-[var(--vf-ink-700)]">“{snippet.highlight}”</p>
            </Surface>
          ))}
        </div>
      </Surface>
    </div>
  )
};
