import re
from datetime import datetime
from typing import Iterable

from sqlmodel import Session, select

from app.models.models import FounderProfile, Opportunity
from app.services.embedding import embed_text


def build_profile_query(profile: FounderProfile) -> str:
    return " ".join(
        [
            profile.industry,
            profile.stage,
            profile.location,
            profile.revenue_range,
            profile.keywords,
            profile.free_text_goals,
        ]
    )


def extract_highlights(text: str, keywords: Iterable[str]) -> list[str]:
    highlights = []
    cleaned_keywords = [keyword.strip() for keyword in keywords if keyword and keyword.strip()]
    sentences = re.split(r"(?<=[.!?])\s+", text)
    for sentence in sentences:
        if len(highlights) >= 3:
            break
        for keyword in cleaned_keywords:
            if re.search(rf"\b{re.escape(keyword)}\b", sentence, re.I):
                highlights.append(sentence.strip())
                break
    if highlights:
        return highlights[:3]
    for keyword in cleaned_keywords:
        pattern = re.compile(rf"(.{{0,60}}\b{re.escape(keyword)}\b.{{0,60}})", re.I)
        match = pattern.search(text)
        if match:
            highlights.append(match.group(1).strip())
    return highlights[:3]


def reason_list(profile: FounderProfile, opportunity: Opportunity) -> list[str]:
    reasons = []
    if profile.industry in opportunity.industries:
        reasons.append(f"Industry match: {profile.industry}")
    if profile.stage in opportunity.stage_fit:
        reasons.append(f"Stage fit: {profile.stage}")
    if profile.location in opportunity.regions:
        reasons.append(f"Region fit: {profile.location}")
    keywords = [word.strip() for word in profile.keywords.split(",")]
    hits = [word for word in keywords if word and word.lower() in opportunity.raw_text.lower()]
    if hits:
        reasons.append(f"Keyword hits: {', '.join(hits[:3])}")
    return reasons


def distance_to_similarity(distance: float | None) -> float:
    if distance is None:
        return 0.0
    return 1 / (1 + float(distance))


def build_matches(session: Session, profile: FounderProfile, limit: int = 20):
    query_text = build_profile_query(profile)
    query_embedding = embed_text(query_text)
    now = datetime.utcnow()
    stmt = (
        select(Opportunity, Opportunity.embedding.l2_distance(query_embedding).label("distance"))
        .where(Opportunity.embedding.is_not(None))
        .where((Opportunity.deadline.is_(None)) | (Opportunity.deadline >= now))
        .order_by(Opportunity.embedding.l2_distance(query_embedding))
        .limit(limit)
    )
    rows = session.exec(stmt).all()
    matches = []
    keywords = [profile.industry, profile.stage] + [k.strip() for k in profile.keywords.split(",")]
    for opportunity, distance in rows:
        highlights = extract_highlights(
            " ".join([opportunity.eligibility_text, opportunity.description, opportunity.raw_text]),
            keywords,
        )
        similarity = distance_to_similarity(distance)
        matches.append(
            {
                "opportunity": opportunity,
                "score": similarity,
                "distance": float(distance) if distance is not None else None,
                "reasons": reason_list(profile, opportunity),
                "highlights": highlights,
            }
        )
    return matches
