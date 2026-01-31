from __future__ import annotations

from typing import Any
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.models import FounderProfile, LabelingTask, Opportunity
from app.models.schemas import (
    CopilotAnalyzeTextRequest,
    CopilotIngestResponse,
    CopilotIngestUrlRequest,
    CopilotPlan,
    CopilotPlanRequest,
    OpportunityInsights,
)
from app.services.auth import get_current_user_optional
from app.services.embedding import embed_text
from app.services.insights import (
    build_insights_from_opportunity,
    build_insights_from_text,
    build_plan,
    parse_deadline,
    split_sentences,
)
from app.services.scraping import fetch_url_text

router = APIRouter(prefix="/copilot", tags=["copilot"])


def derive_title(raw_text: str, fallback: str = "Untitled opportunity") -> str:
    sentences = split_sentences(raw_text)
    if sentences:
        return sentences[0][:120]
    return fallback


def derive_org(url: str | None, fallback: str = "Unknown organization") -> str:
    if not url:
        return fallback
    parsed = urlparse(url)
    org = parsed.netloc.replace("www.", "").strip()
    return org or fallback


def derive_eligibility_text(raw_text: str) -> str:
    sentences = split_sentences(raw_text)
    for sentence in sentences:
        if any(keyword in sentence.lower() for keyword in ["eligible", "eligibility", "applicants", "who can apply"]):
            return sentence
    return (sentences[0] if sentences else raw_text[:200]).strip()


def build_opportunity_payload(
    *,
    title: str,
    org: str,
    url: str,
    raw_text: str,
    description: str,
    insights: OpportunityInsights,
) -> dict[str, Any]:
    extracted = insights.extracted
    eligibility_text = derive_eligibility_text(raw_text)
    return {
        "title": title,
        "org": org,
        "url": url,
        "funding_type": extracted.funding_type or "Program",
        "amount_text": extracted.amount_text,
        "deadline": parse_deadline(extracted.deadline),
        "eligibility_text": eligibility_text,
        "regions": extracted.regions or [],
        "industries": extracted.industries or [],
        "stage_fit": extracted.stage_fit or [],
        "description": description or insights.summary,
        "raw_text": raw_text,
        "source_name": "user",
    }


def create_labeling_task(session: Session, opportunity: Opportunity, extracted: OpportunityInsights):
    needs_review = {
        "deadline": opportunity.deadline is None,
        "amount_text": not opportunity.amount_text,
        "industries": not opportunity.industries,
    }
    if any(needs_review.values()):
        task = LabelingTask(
            opportunity_id=opportunity.id,
            fields_needing_review=needs_review,
            extracted_fields={
                "deadline": extracted.extracted.deadline,
                "amount_text": extracted.extracted.amount_text,
                "industries": extracted.extracted.industries,
            },
        )
        session.add(task)
        session.commit()


@router.post("/analyze-text", response_model=OpportunityInsights)
def analyze_text(payload: CopilotAnalyzeTextRequest):
    if not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="Raw text is required.")
    return build_insights_from_text(
        raw_text=payload.raw_text,
        title=payload.title,
        url=payload.url,
    )


@router.post("/ingest-url", response_model=CopilotIngestResponse)
def ingest_url(
    payload: CopilotIngestUrlRequest,
    session: Session = Depends(get_session),
):
    try:
        fetched = fetch_url_text(payload.url)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    insights = build_insights_from_text(
        raw_text=fetched["raw_text"],
        title=fetched["title"],
        url=payload.url,
    )
    payload_data = build_opportunity_payload(
        title=fetched["title"],
        org=fetched["org"],
        url=payload.url,
        raw_text=fetched["raw_text"],
        description=fetched["description"],
        insights=insights,
    )

    opportunity = Opportunity(
        **payload_data,
        embedding=embed_text(" ".join([payload_data["title"], payload_data["description"], payload_data["eligibility_text"]])),
    )
    session.add(opportunity)
    session.commit()
    session.refresh(opportunity)

    create_labeling_task(session, opportunity, insights)

    return {"opportunity": opportunity, "insights": insights}


@router.post("/ingest-text", response_model=CopilotIngestResponse)
def ingest_text(
    payload: CopilotAnalyzeTextRequest,
    session: Session = Depends(get_session),
):
    if not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="Raw text is required.")

    raw_text = payload.raw_text.strip()
    title = payload.title or derive_title(raw_text)
    url = payload.url or "offline://copilot"
    org = payload.org or derive_org(payload.url, fallback="User provided")

    insights = build_insights_from_text(
        raw_text=raw_text,
        title=title,
        url=url,
    )
    payload_data = build_opportunity_payload(
        title=title,
        org=org,
        url=url,
        raw_text=raw_text,
        description="",
        insights=insights,
    )

    opportunity = Opportunity(
        **payload_data,
        embedding=embed_text(" ".join([payload_data["title"], payload_data["description"], payload_data["eligibility_text"]])),
    )
    session.add(opportunity)
    session.commit()
    session.refresh(opportunity)

    create_labeling_task(session, opportunity, insights)

    return {"opportunity": opportunity, "insights": insights}


@router.get("/opportunities/{opportunity_id}/insights", response_model=OpportunityInsights)
def opportunity_insights(
    opportunity_id: int,
    session: Session = Depends(get_session),
):
    opportunity = session.get(Opportunity, opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Not found")
    return build_insights_from_opportunity(opportunity)


@router.post("/opportunities/{opportunity_id}/plan", response_model=CopilotPlan)
def opportunity_plan(
    opportunity_id: int,
    payload: CopilotPlanRequest | None = None,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user_optional),
):
    opportunity = session.get(Opportunity, opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Not found")

    profile_context: dict[str, str | None] | None = None
    if current_user:
        profile = session.exec(select(FounderProfile).where(FounderProfile.user_id == current_user.id)).first()
        if profile:
            profile_context = {
                "industry": profile.industry,
                "stage": profile.stage,
                "location": profile.location,
                "revenue_range": profile.revenue_range,
                "keywords": profile.keywords,
                "woman_owned_certifications": profile.woman_owned_certifications,
                "free_text_goals": profile.free_text_goals,
            }

    if not profile_context and payload and payload.profile:
        profile_context = payload.profile.model_dump()

    return build_plan(opportunity, profile_context)
