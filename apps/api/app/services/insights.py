from __future__ import annotations

import re
from datetime import datetime
from typing import Iterable

from app.models.models import Opportunity
from app.models.schemas import (
    CopilotPlan,
    CopilotPlanDrafts,
    CopilotPlanPhase,
    CopilotPlanTask,
    EvidenceItem,
    ExtractedFields,
    OpportunityInsights,
    TrustCheck,
    TrustReport,
)

FUNDING_KEYWORDS = [
    ("non-dilutive", "Non-dilutive grant"),
    ("grant", "Grant"),
    ("accelerator", "Accelerator"),
    ("fellowship", "Fellowship"),
    ("prize", "Prize"),
    ("equity", "Equity funding"),
    ("loan", "Loan"),
]

REGION_KEYWORDS = {
    "north america": "North America",
    "united states": "United States",
    "u.s.": "United States",
    "usa": "United States",
    "canada": "Canada",
    "europe": "Europe",
    "uk": "United Kingdom",
    "united kingdom": "United Kingdom",
    "africa": "Africa",
    "asia": "Asia",
    "latin america": "Latin America",
    "global": "Global",
    "worldwide": "Global",
}

STAGE_KEYWORDS = {
    "pre-seed": "Pre-seed",
    "pre seed": "Pre-seed",
    "seed": "Seed",
    "series a": "Series A",
    "series b": "Series B",
    "growth": "Growth",
    "early-stage": "Early-stage",
    "early stage": "Early-stage",
}

INDUSTRY_KEYWORDS = {
    "climate": "Climate",
    "sustainability": "Climate",
    "fintech": "Fintech",
    "financial": "Fintech",
    "health": "Health",
    "healthcare": "Health",
    "education": "Education",
    "edtech": "Education",
    "agriculture": "Agriculture",
    "agtech": "Agriculture",
    "ai": "AI",
    "artificial intelligence": "AI",
    "biotech": "Biotech",
    "energy": "Energy",
    "mobility": "Mobility",
    "water": "Water",
    "community": "Community",
}

SUSPICIOUS_KEYWORDS = [
    "wire transfer",
    "upfront fee",
    "guaranteed",
    "act now",
    "limited time",
    "gift card",
    "bitcoin",
]


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def split_sentences(text: str) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", normalize_text(text))
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def extract_keywords(text: str, mapping: dict[str, str]) -> list[str]:
    hits: list[str] = []
    lowered = text.lower()
    for keyword, label in mapping.items():
        if keyword in lowered and label not in hits:
            hits.append(label)
    return hits


def extract_fields(raw_text: str, title: str | None = None, url: str | None = None) -> ExtractedFields:
    text = normalize_text(raw_text)
    lowered = text.lower()
    title_lowered = (title or "").lower()

    funding_type = None
    for keyword, label in FUNDING_KEYWORDS:
        if keyword in lowered or keyword in title_lowered:
            funding_type = label
            break

    amount_text = None
    amount_match = re.search(r"(\$|usd)\s?[\d,]+(?:\.\d+)?\s?(k|m|million|billion)?", text, re.I)
    if amount_match:
        amount_text = amount_match.group(0).strip()

    deadline = None
    if "rolling" in lowered:
        deadline = "Rolling"
    else:
        date_match = re.search(
            r"(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|"
            r"jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)"
            r"\s+\d{1,2}(?:,?\s+\d{4})?",
            text,
            re.I,
        )
        if date_match:
            deadline = date_match.group(0).strip()

    regions = extract_keywords(text, REGION_KEYWORDS)
    stage_fit = extract_keywords(text, STAGE_KEYWORDS)
    industries = extract_keywords(text, INDUSTRY_KEYWORDS)

    return ExtractedFields(
        funding_type=funding_type,
        amount_text=amount_text,
        deadline=deadline,
        regions=regions or None,
        stage_fit=stage_fit or None,
        industries=industries or None,
    )


def find_sentence(sentences: list[str], keywords: Iterable[str]) -> str:
    for sentence in sentences:
        for keyword in keywords:
            if not keyword:
                continue
            if re.search(rf"\b{re.escape(keyword)}\b", sentence, re.I):
                return sentence
    return ""


def build_evidence(
    raw_text: str,
    extracted: ExtractedFields,
    profile_query_text: str | None = None,
) -> list[EvidenceItem]:
    sentences = split_sentences(raw_text)
    evidence: list[EvidenceItem] = []

    def add_item(label: str, keywords: Iterable[str], fallback: str | None = None):
        snippet = find_sentence(sentences, keywords)
        matched = bool(snippet)
        if not snippet:
            snippet = fallback or (sentences[0] if sentences else normalize_text(raw_text)[:160])
        if not snippet:
            return
        confidence = 0.82 if matched else 0.6
        evidence.append(
            EvidenceItem(
                label=label,
                snippet=snippet,
                source="raw_text",
                confidence=confidence,
            )
        )

    if extracted.funding_type:
        add_item("Funding type", [extracted.funding_type, "grant", "accelerator", "prize"])
    if extracted.amount_text:
        add_item("Award amount", [extracted.amount_text, "$", "usd"])
    if extracted.deadline:
        add_item("Deadline", [extracted.deadline, "deadline", "apply"])
    if extracted.regions:
        add_item("Regions", extracted.regions)
    if extracted.stage_fit:
        add_item("Stage fit", extracted.stage_fit)
    if extracted.industries:
        add_item("Industries", extracted.industries)

    if profile_query_text:
        keywords = [part.strip() for part in re.split(r"[,\n]", profile_query_text) if part.strip()]
        snippet = find_sentence(sentences, keywords)
        if snippet:
            evidence.append(
                EvidenceItem(
                    label="Profile alignment",
                    snippet=snippet,
                    source="raw_text",
                    confidence=0.74,
                )
            )

    if not evidence:
        fallback = sentences[0] if sentences else normalize_text(raw_text)[:160]
        if fallback:
            evidence.append(
                EvidenceItem(
                    label="Program overview",
                    snippet=fallback,
                    source="raw_text",
                    confidence=0.55,
                )
            )

    return evidence


def compute_trust_report(url: str | None, raw_text: str) -> TrustReport:
    text = normalize_text(raw_text)
    lowered = text.lower()
    flags: list[str] = []
    checks: list[TrustCheck] = []
    score = 50

    def add_check(name: str, ok: bool, detail: str, delta: int):
        nonlocal score
        checks.append(TrustCheck(name=name, ok=ok, detail=detail))
        score += delta if ok else -abs(delta)

    https_ok = bool(url and url.startswith("https://"))
    add_check(
        "Secure source",
        https_ok,
        "HTTPS source detected." if https_ok else "Source is not HTTPS.",
        12,
    )
    if not https_ok:
        flags.append("Source is not HTTPS.")

    has_application = any(keyword in lowered for keyword in ["apply", "application", "deadline", "submission"])
    add_check(
        "Application language",
        has_application,
        "Application or deadline language is present." if has_application else "No application language found.",
        10,
    )
    if not has_application:
        flags.append("Application language not found.")

    has_contact = any(keyword in lowered for keyword in ["contact", "about", "eligibility", "criteria"])
    add_check(
        "Contact or criteria",
        has_contact,
        "Contact or criteria section detected." if has_contact else "No contact or criteria section detected.",
        8,
    )

    has_amount_or_date = bool(
        re.search(r"(\$|usd)\s?[\d,]+", text, re.I)
        or re.search(r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)", text, re.I)
    )
    add_check(
        "Funding specifics",
        has_amount_or_date,
        "Award amount or deadline detected." if has_amount_or_date else "No award amount or deadline detected.",
        10,
    )

    sufficient_length = len(text) > 400
    add_check(
        "Source detail",
        sufficient_length,
        "Source has sufficient detail." if sufficient_length else "Source text is brief.",
        6,
    )
    if not sufficient_length:
        flags.append("Source text is brief; verify details manually.")

    suspicious = [keyword for keyword in SUSPICIOUS_KEYWORDS if keyword in lowered]
    if suspicious:
        add_check(
            "Suspicious patterns",
            False,
            f"Suspicious language detected: {', '.join(suspicious[:2])}.",
            18,
        )
        flags.append("Suspicious language detected; verify legitimacy.")
    else:
        add_check("Suspicious patterns", True, "No suspicious language detected.", 6)

    score = max(0, min(100, score))

    return TrustReport(trust_score=score, flags=flags, checks=checks)


def summarize(raw_text: str, title: str | None = None) -> str:
    sentences = split_sentences(raw_text)
    if not sentences:
        return title or "No summary available."

    keywords = ["grant", "funding", "deadline", "apply", "eligible", "award", "accelerator", "program"]
    scored: list[tuple[int, int, str]] = []
    for index, sentence in enumerate(sentences):
        score = sum(1 for keyword in keywords if keyword in sentence.lower())
        if re.search(r"\d", sentence):
            score += 1
        scored.append((score, index, sentence))

    scored.sort(key=lambda item: (-item[0], item[1]))
    top_sentences = sorted(scored[:3], key=lambda item: item[1])
    summary = " ".join(sentence for _, _, sentence in top_sentences[:2])
    if not summary:
        summary = sentences[0]
    return summary.strip()


def build_suggested_tasks(extracted: ExtractedFields) -> list[str]:
    tasks: list[str] = []
    if not extracted.deadline or extracted.deadline.lower() == "rolling":
        tasks.append("Confirm the application deadline and set an internal target date.")
    if not extracted.amount_text:
        tasks.append("Verify the award amount or funding range.")
    if not extracted.industries:
        tasks.append("Tag the primary industry focus to improve matching.")
    if not extracted.stage_fit:
        tasks.append("Confirm stage eligibility (pre-seed, seed, Series A).")
    if not extracted.regions:
        tasks.append("Confirm eligible regions or geography requirements.")
    if not tasks:
        tasks.append("Draft the application narrative and compile required documents.")
    return tasks


def build_insights_from_text(
    raw_text: str,
    title: str | None = None,
    url: str | None = None,
    profile_query_text: str | None = None,
) -> OpportunityInsights:
    extracted = extract_fields(raw_text, title=title, url=url)
    summary = summarize(raw_text, title)
    evidence = build_evidence(raw_text, extracted, profile_query_text)
    trust = compute_trust_report(url, raw_text)
    suggested_tasks = build_suggested_tasks(extracted)
    return OpportunityInsights(
        summary=summary,
        extracted=extracted,
        evidence=evidence,
        trust=trust,
        suggested_tasks=suggested_tasks,
    )


def build_insights_from_opportunity(
    opportunity: Opportunity,
    profile_query_text: str | None = None,
) -> OpportunityInsights:
    extracted = extract_fields(opportunity.raw_text, opportunity.title, opportunity.url)
    if opportunity.funding_type:
        extracted.funding_type = opportunity.funding_type
    if opportunity.amount_text:
        extracted.amount_text = opportunity.amount_text
    if opportunity.deadline:
        extracted.deadline = opportunity.deadline.date().isoformat()
    if opportunity.regions:
        extracted.regions = opportunity.regions
    if opportunity.stage_fit:
        extracted.stage_fit = opportunity.stage_fit
    if opportunity.industries:
        extracted.industries = opportunity.industries

    summary_source = opportunity.raw_text or opportunity.description
    summary = summarize(summary_source, opportunity.title)
    evidence = build_evidence(opportunity.raw_text, extracted, profile_query_text)
    trust = compute_trust_report(opportunity.url, opportunity.raw_text)
    suggested_tasks = build_suggested_tasks(extracted)
    return OpportunityInsights(
        summary=summary,
        extracted=extracted,
        evidence=evidence,
        trust=trust,
        suggested_tasks=suggested_tasks,
    )


def build_plan(opportunity: Opportunity, profile: dict[str, str | None] | None = None) -> CopilotPlan:
    extracted = extract_fields(opportunity.raw_text, opportunity.title, opportunity.url)
    summary = summarize(opportunity.raw_text or opportunity.description, opportunity.title)

    profile = profile or {}
    profile_bits = []
    if profile.get("stage"):
        profile_bits.append(profile["stage"])
    if profile.get("industry"):
        profile_bits.append(profile["industry"])
    if profile.get("location"):
        profile_bits.append(f"based in {profile['location']}")
    profile_line = " ".join(profile_bits).strip()

    deadline_text = ""
    if opportunity.deadline:
        deadline_text = opportunity.deadline.strftime("%b %d, %Y")
    elif extracted.deadline:
        deadline_text = extracted.deadline

    phases = [
        CopilotPlanPhase(
            name="Eligibility & fit",
            tasks=[
                CopilotPlanTask(
                    title="Confirm eligibility checklist",
                    why="Validate stage, region, and industry fit before drafting.",
                    due_in_days=1,
                ),
                CopilotPlanTask(
                    title="Align narrative to program priorities",
                    why=f"Mirror {opportunity.org} criteria and impact language.",
                    due_in_days=2,
                ),
                CopilotPlanTask(
                    title="Set internal deadline",
                    why=f"Work backwards from {deadline_text or 'the submission window'}.",
                    due_in_days=3,
                ),
            ],
        ),
        CopilotPlanPhase(
            name="Application assets",
            tasks=[
                CopilotPlanTask(
                    title="Draft the core narrative",
                    why="Explain the problem, solution, and impact in 3 concise paragraphs.",
                    due_in_days=4,
                ),
                CopilotPlanTask(
                    title="Compile traction and impact metrics",
                    why="Highlight proof points like pilots, revenue, or outcomes.",
                    due_in_days=6,
                ),
                CopilotPlanTask(
                    title="Prepare budget and use-of-funds summary",
                    why="Show how the award will advance key milestones.",
                    due_in_days=7,
                ),
            ],
        ),
        CopilotPlanPhase(
            name="Submission & follow-up",
            tasks=[
                CopilotPlanTask(
                    title="Finalize and submit application",
                    why="Double-check required fields and attachments.",
                    due_in_days=10,
                ),
                CopilotPlanTask(
                    title="Schedule follow-up touchpoint",
                    why="Set reminders to confirm receipt or request feedback.",
                    due_in_days=14,
                ),
            ],
        ),
    ]

    intro_line = f"We are {profile_line}." if profile_line else "We are a mission-driven founding team."
    if extracted.industries:
        intro_line = f"{intro_line} Our focus is {', '.join(extracted.industries[:2])}."

    outreach_email = "\n\n".join(
        [
            f"Hi {opportunity.org} team,",
            f"I'm reaching out about the {opportunity.title}. {intro_line}",
            f"{summary} We are preparing materials and would appreciate any guidance on key evaluation criteria.",
            "Thank you for your time,",
            "— A VioletFund applicant",
        ]
    )

    bullets = [
        f"Opportunity fit: {opportunity.funding_type} with focus on {', '.join(extracted.industries or ['mission-driven impact'])}.",
        f"Target award: {extracted.amount_text or 'Amount to confirm'}, deadline {deadline_text or 'TBD'}.",
        summary,
    ]

    risks = []
    if not extracted.amount_text:
        risks.append("Award amount not listed; confirm funding range.")
    if not extracted.deadline or extracted.deadline.lower() == "rolling":
        risks.append("Deadline unclear; set an internal target date.")
    if not extracted.industries:
        risks.append("Industry tags missing; clarify focus for reviewers.")

    return CopilotPlan(
        phases=phases,
        drafts=CopilotPlanDrafts(
            outreach_email=outreach_email,
            application_bullets=bullets,
            risks=risks,
        ),
    )


def parse_deadline(value: str | None) -> datetime | None:
    if not value:
        return None
    if value.lower() == "rolling":
        return None
    cleaned = value.replace(",", "").strip()
    for fmt in ("%b %d %Y", "%B %d %Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(cleaned, fmt)
        except ValueError:
            continue
    return None
