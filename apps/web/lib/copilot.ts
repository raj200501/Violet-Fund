export interface EvidenceItem {
  label: string;
  snippet: string;
  source: string;
  confidence: number;
}

export interface TrustCheck {
  name: string;
  ok: boolean;
  detail: string;
}

export interface TrustReport {
  trust_score: number;
  flags: string[];
  checks: TrustCheck[];
}

export interface ExtractedFields {
  funding_type?: string | null;
  amount_text?: string | null;
  deadline?: string | null;
  regions?: string[] | null;
  stage_fit?: string[] | null;
  industries?: string[] | null;
}

export interface OpportunityInsights {
  summary: string;
  extracted: ExtractedFields;
  evidence: EvidenceItem[];
  trust: TrustReport;
  suggested_tasks: string[];
}

export interface CopilotPlanTask {
  title: string;
  why: string;
  due_in_days?: number | null;
}

export interface CopilotPlanPhase {
  name: string;
  tasks: CopilotPlanTask[];
}

export interface CopilotPlanDrafts {
  outreach_email: string;
  application_bullets: string[];
  risks: string[];
}

export interface CopilotPlan {
  phases: CopilotPlanPhase[];
  drafts: CopilotPlanDrafts;
}

export interface FlattenedTask {
  phase: string;
  title: string;
  why: string;
  due_in_days?: number | null;
}

export const demoInsights: OpportunityInsights = {
  summary:
    "Aurora Ventures is offering a non-dilutive grant for women-led climate founders focused on measurable outcomes. Applications are due Aug 28, and the program prioritizes teams with early traction.",
  extracted: {
    funding_type: "Non-dilutive grant",
    amount_text: "$75,000",
    deadline: "Aug 28, 2026",
    regions: ["North America", "Global pilots"],
    stage_fit: ["Seed", "Series A"],
    industries: ["Climate", "Sustainability"]
  },
  evidence: [
    {
      label: "Funding type",
      snippet: "Aurora Ventures provides catalytic grants for women-led climate founders.",
      source: "raw_text",
      confidence: 0.86
    },
    {
      label: "Deadline",
      snippet: "Applications must be submitted by Aug 28 to be considered for the cohort.",
      source: "raw_text",
      confidence: 0.78
    },
    {
      label: "Eligibility",
      snippet: "Applicants must be seed-stage and demonstrate measurable climate outcomes.",
      source: "raw_text",
      confidence: 0.72
    }
  ],
  trust: {
    trust_score: 86,
    flags: ["Source text is brief; verify details manually."],
    checks: [
      { name: "Secure source", ok: true, detail: "HTTPS source detected." },
      { name: "Application language", ok: true, detail: "Application or deadline language is present." },
      { name: "Contact or criteria", ok: true, detail: "Contact or criteria section detected." }
    ]
  },
  suggested_tasks: [
    "Confirm the application deadline and set an internal target date.",
    "Align narrative to climate impact criteria.",
    "Compile traction metrics and partnerships."
  ]
};

export const demoPlan: CopilotPlan = {
  phases: [
    {
      name: "Eligibility & fit",
      tasks: [
        { title: "Confirm eligibility checklist", why: "Verify stage, region, and impact fit.", due_in_days: 1 },
        { title: "Align narrative to climate criteria", why: "Match stated impact outcomes.", due_in_days: 2 }
      ]
    },
    {
      name: "Application assets",
      tasks: [
        { title: "Draft a one-page narrative", why: "Explain problem, solution, and outcomes.", due_in_days: 4 },
        { title: "Compile traction metrics", why: "Share pilots, customers, and outcomes.", due_in_days: 6 }
      ]
    },
    {
      name: "Submission & follow-up",
      tasks: [
        { title: "Finalize and submit", why: "Double-check required attachments.", due_in_days: 9 },
        { title: "Schedule follow-up", why: "Confirm receipt and next steps.", due_in_days: 12 }
      ]
    }
  ],
  drafts: {
    outreach_email:
      "Hi Aurora Ventures team,\n\nWe're preparing an application for the Aurora Women in Climate Grant and wanted to confirm any priority evaluation criteria. Our team is building measurable climate impact tools and would value any guidance on what reviewers care about most.\n\nThank you,\n— A VioletFund applicant",
    application_bullets: [
      "Women-led, seed-stage climate company with measurable outcomes.",
      "Seeking $75,000 to accelerate pilot deployments and impact tracking.",
      "Aligned with Aurora Ventures' criteria on sustainability and community benefit."
    ],
    risks: ["Award amount confirmation needed.", "Eligibility criteria should be verified."]
  }
};

export function flattenPlanTasks(plan: CopilotPlan): FlattenedTask[] {
  return plan.phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      phase: phase.name,
      title: task.title,
      why: task.why,
      due_in_days: task.due_in_days ?? undefined
    }))
  );
}

export function buildDueDates(tasks: FlattenedTask[]): Record<string, string> {
  const today = new Date();
  return tasks.reduce<Record<string, string>>((acc, task) => {
    if (task.due_in_days === undefined || task.due_in_days === null) {
      return acc;
    }
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + task.due_in_days);
    acc[task.title] = dueDate.toISOString();
    return acc;
  }, {});
}
