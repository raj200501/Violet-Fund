import AppShell from "@/components/AppShell";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfidenceMeter,
  DataTable,
  DiffViewer,
  EmptyState,
  FilterBar,
  KeyValue,
  MetricCard,
  PageHeader,
  ProgressBar,
  SectionHeader,
  SegmentedControl,
  StatCards,
  StatusBanner,
  Surface,
  Timeline,
  Toolbar
} from "@violetfund/ui";

const colorTokens = [
  { label: "Violet 25", value: "var(--vf-violet-25)" },
  { label: "Violet 100", value: "var(--vf-violet-100)" },
  { label: "Violet 400", value: "var(--vf-violet-400)" },
  { label: "Violet 600", value: "var(--vf-violet-600)" },
  { label: "Ink 900", value: "var(--vf-ink-900)" },
  { label: "Ink 600", value: "var(--vf-ink-600)" },
  { label: "Surface 100", value: "var(--vf-surface-100)" },
  { label: "Surface 300", value: "var(--vf-surface-300)" },
  { label: "Emerald 500", value: "var(--vf-emerald-500)" },
  { label: "Amber 500", value: "var(--vf-amber-500)" },
  { label: "Rose 600", value: "var(--vf-rose-600)" }
];

const spacingScale = [
  { label: "4px", className: "h-1 w-1" },
  { label: "8px", className: "h-2 w-2" },
  { label: "12px", className: "h-3 w-3" },
  { label: "16px", className: "h-4 w-4" },
  { label: "24px", className: "h-6 w-6" },
  { label: "32px", className: "h-8 w-8" },
  { label: "40px", className: "h-10 w-10" }
];

const typographySamples = [
  { label: "Display", className: "text-4xl font-semibold" },
  { label: "Headline", className: "text-2xl font-semibold" },
  { label: "Title", className: "text-xl font-semibold" },
  { label: "Body", className: "text-base" },
  { label: "Caption", className: "text-sm text-[var(--vf-ink-600)]" }
];

const navigationItems = [
  { label: "Dashboard", badge: "12" },
  { label: "Opportunities", badge: "28" },
  { label: "Tracker", badge: "6" },
  { label: "Verify & Improve", badge: "3" },
  { label: "Profile", badge: "" }
];

const scoreCards = [
  { label: "Confidence", value: "84%", delta: "+6%", helper: "Explainable score" },
  { label: "Deadline risk", value: "7 days", delta: "Due soon", helper: "Accelerator window" },
  { label: "Eligibility gaps", value: "2", delta: "Review", helper: "Missing metrics" }
];

const detailRows = [
  { id: "1", opportunity: "Aurora Climate Grant", stage: "Seed", status: "Saved", score: "86%" },
  { id: "2", opportunity: "Catalyst Accelerator", stage: "Pre-seed", status: "Planned", score: "82%" },
  { id: "3", opportunity: "Meridian Impact Prize", stage: "Seed", status: "In review", score: "76%" }
];

export default function DesignSystemPage() {
  return (
    <AppShell>
      <main className="space-y-12">
        <PageHeader
          eyebrow="Design system"
          title="VioletFund UI kit"
          description="An opinionated design system inspired by premium fintech interfaces."
          badges={["Violet accent", "Layered surfaces", "AA contrast"]}
          action={<Button size="sm">Download assets</Button>}
        />

        <SectionHeader
          eyebrow="Tokens"
          title="Color palette"
          description="Violet is reserved for accent elements, with graphite-driven neutrals."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <Surface key={token.label} tone="raised" className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-[var(--vf-ink-900)]">{token.label}</p>
                <p className="text-xs text-[var(--vf-ink-500)]">{token.value}</p>
              </div>
              <span className="h-10 w-10 rounded-full border border-[var(--vf-border)]" style={{ background: token.value }} />
            </Surface>
          ))}
        </div>

        <SectionHeader
          eyebrow="Spacing"
          title="Spacing scale"
          description="Consistent spacing tokens keep layouts calm and balanced."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spacingScale.map((spacing) => (
            <Surface key={spacing.label} tone="raised" className="flex items-center justify-between p-4">
              <span className={`rounded bg-[var(--vf-violet-500)] ${spacing.className}`} />
              <span className="text-xs text-[var(--vf-ink-600)]">{spacing.label}</span>
            </Surface>
          ))}
        </div>

        <SectionHeader
          eyebrow="Typography"
          title="Type scale"
          description="Crisp typography tuned for calm density and readability."
        />
        <div className="grid gap-4">
          {typographySamples.map((sample) => (
            <Surface key={sample.label} tone="raised" className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--vf-ink-500)]">{sample.label}</p>
              <p className={`${sample.className} text-[var(--vf-ink-900)]`}>Funding intelligence for women founders</p>
            </Surface>
          ))}
        </div>

        <SectionHeader
          eyebrow="Navigation"
          title="Navigation pattern"
          description="Balanced surface layering with quick access to the core workflow."
        />
        <Surface tone="hero" className="p-6">
          <div className="flex flex-wrap gap-3">
            {navigationItems.map((item) => (
              <Button key={item.label} variant="ghost" size="sm">
                {item.label}
                {item.badge ? <Badge variant="info" className="ml-2">{item.badge}</Badge> : null}
              </Button>
            ))}
          </div>
        </Surface>

        <SectionHeader
          eyebrow="Composition"
          title="Premium dashboard modules"
          description="Stat cards, filters, and tables deliver Stripe-inspired hierarchy."
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Surface tone="raised" className="space-y-6 p-6">
            <Toolbar
              title="Saved views"
              description="Quickly jump to your most-used filters."
              action={<Button size="sm">New view</Button>}
            />
            <FilterBar
              searchPlaceholder="Search opportunities"
              filters={[
                { label: "Seed", value: "seed" },
                { label: "Grant", value: "grant" },
                { label: "Due soon", value: "deadline" }
              ]}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {scoreCards.map((card) => (
                <MetricCard key={card.label} label={card.label} value={card.value} delta={card.delta} helper={card.helper} progress={68} />
              ))}
            </div>
          </Surface>
          <Surface tone="raised" className="space-y-6 p-6">
            <SectionHeader
              eyebrow="Status"
              title="Pipeline health"
              description="A compact set of indicators to keep the team aligned."
            />
            <StatCards
              stats={[
                { label: "Active opportunities", value: "32", delta: "+8", description: "Tracked this month." },
                { label: "Confidence avg.", value: "82%", delta: "+5%", description: "Profile-based scoring." },
                { label: "Deadline risk", value: "4", delta: "7 days", description: "High priority items." }
              ]}
            />
          </Surface>
        </div>

        <SectionHeader
          eyebrow="Tables"
          title="Evidence-first data tables"
          description="Structured tables with inline evidence chips and actions."
        />
        <Surface tone="default" className="p-6">
          <DataTable
            columns={[
              { key: "opportunity", label: "Opportunity" },
              { key: "stage", label: "Stage" },
              { key: "status", label: "Status" },
              { key: "score", label: "Score" }
            ]}
            rows={detailRows}
            rowKey={(row) => row.id}
          />
        </Surface>

        <SectionHeader
          eyebrow="Surfaces"
          title="Layered surfaces"
          description="Subtle borders, soft shadows, and noise textures for depth."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Surface tone="default" className="p-6">Default surface with standard elevation.</Surface>
          <Surface tone="raised" className="p-6">Raised surface for cards and panels.</Surface>
          <Surface tone="sunken" className="p-6">Sunken surface for background sections.</Surface>
          <Surface tone="hero" className="p-6">Hero surface for key CTAs.</Surface>
        </div>

        <SectionHeader
          eyebrow="Feedback"
          title="Status, empty, and feedback"
          description="Provide accessible feedback across states and modes."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Surface tone="raised" className="space-y-4 p-6">
            <StatusBanner title="Demo data enabled" description="Connect your profile for personalized recommendations." />
            <StatusBanner tone="success" title="Profile saved" description="Recommendations will refresh shortly." />
            <StatusBanner tone="warning" title="Deadline approaching" description="Aurora grant closes in 7 days." />
            <StatusBanner tone="danger" title="Sync failed" description="Reconnect to continue updates." />
          </Surface>
          <EmptyState
            title="No saved opportunities"
            description="Save opportunities to build your tracker pipeline."
            actionLabel="Browse recommendations"
          />
        </div>

        <SectionHeader
          eyebrow="Evidence"
          title="Diff preview and confidence"
          description="Surface raw vs. updated evidence with a side-by-side diff."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Surface tone="raised" className="space-y-4 p-6">
            <DiffViewer
              beforeText="Applicants must be women-led, seed-stage, and operate within North America."
              afterText="Applicants must be women-led, seed-stage, and operate within North America or select global regions."
            />
            <ConfidenceMeter score={86} label="Confidence score" />
          </Surface>
          <Surface tone="raised" className="space-y-4 p-6">
            <KeyValue
              columns={2}
              items={[
                { label: "Funding type", value: "Grant" },
                { label: "Deadline", value: "Aug 28" },
                { label: "Eligibility", value: "Women-led, climate" },
                { label: "Stage", value: "Seed" }
              ]}
            />
            <ProgressBar value={78} label="Evidence coverage" />
          </Surface>
        </div>

        <SectionHeader
          eyebrow="User"
          title="Identity + actions"
          description="Combine avatars, badges, and CTAs for action-ready panels."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-[var(--vf-border-subtle)]">
            <CardHeader>
              <CardTitle>Founder workspace</CardTitle>
              <CardDescription>Overview of primary founder responsibilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name="Morgan Lee" size="md" status="online" />
                <div>
                  <p className="text-sm font-semibold text-[var(--vf-ink-900)]">Morgan Lee</p>
                  <p className="text-xs text-[var(--vf-ink-500)]">CEO · Founder</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Owner</Badge>
                <Badge variant="default">3 tasks due</Badge>
                <Badge variant="success">High confidence</Badge>
              </div>
              <Button size="sm">Send update</Button>
            </CardContent>
          </Card>
          <Surface tone="raised" className="space-y-4 p-6">
            <SectionHeader
              eyebrow="Flow"
              title="Segmented controls"
              description="Toggle between dense modes without losing context."
            />
            <SegmentedControl
              value="cards"
              onChange={() => undefined}
              options={[
                { label: "Cards", value: "cards" },
                { label: "Table", value: "table" },
                { label: "Analytics", value: "analytics" }
              ]}
            />
          </Surface>
        </div>

        <SectionHeader
          eyebrow="Timeline"
          title="Application plan"
          description="Action-ready tasks aligned to your funding timeline."
        />
        <Surface tone="raised" className="p-6">
          <Timeline
            items={[
              { title: "Eligibility review", time: "Today", description: "Confirm requirements and gather evidence." },
              { title: "Narrative prep", time: "Next 3 days", description: "Draft mission and impact summary." },
              { title: "Submission", time: "Next 2 weeks", description: "Finalize budget and submit application." }
            ]}
          />
        </Surface>
      </main>
    </AppShell>
  );
}
