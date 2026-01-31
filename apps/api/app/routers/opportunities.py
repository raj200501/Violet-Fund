from datetime import datetime, timedelta
import re

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.models import FounderProfile, Opportunity
from app.models.schemas import OpportunityMatch, OpportunityRead
from app.services.auth import get_current_user
from app.services.embedding import embed_text
from app.services.matching import build_matches, build_profile_query, distance_to_similarity, extract_highlights, reason_list

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


def normalize_filters(filters: list[str] | None) -> list[str]:
    if not filters:
        return []
    if len(filters) == 1 and "," in filters[0]:
        return [item.strip() for item in filters[0].split(",") if item.strip()]
    return [item.strip() for item in filters if item and item.strip()]


def apply_filters(stmt, filters: list[str]):
    if not filters:
        return stmt
    now = datetime.utcnow()
    for raw_filter in filters:
        value = raw_filter.lower()
        if value in {"due soon", "due_soon", "deadline"}:
            stmt = stmt.where(
                Opportunity.deadline.is_not(None),
                Opportunity.deadline <= now + timedelta(days=30),
                Opportunity.deadline >= now,
            )
            continue
        if value in {"seed", "pre-seed", "preseed", "series a", "series b"}:
            stage_value = value.replace("-", " ").title()
            stmt = stmt.where(
                or_(
                    Opportunity.stage_fit.contains([stage_value]),
                    Opportunity.stage_fit.contains([stage_value.replace(" ", "-")]),
                    Opportunity.raw_text.ilike(f"%{stage_value}%"),
                    Opportunity.description.ilike(f"%{stage_value}%"),
                )
            )
            continue
        if value in {"grant", "non-dilutive", "non dilutive"}:
            stmt = stmt.where(Opportunity.funding_type.ilike("%grant%") | Opportunity.funding_type.ilike("%non%"))
            continue
        if value in {"accelerator", "equity", "prize", "partnership"}:
            stmt = stmt.where(Opportunity.funding_type.ilike(f"%{value}%"))
            continue
        if value in {"women-led", "women"}:
            stmt = stmt.where(
                or_(
                    Opportunity.eligibility_text.ilike("%women%"),
                    Opportunity.description.ilike("%women%"),
                    Opportunity.raw_text.ilike("%women%"),
                )
            )
            continue
        if value in {"climate", "sustainability"}:
            stmt = stmt.where(
                or_(
                    Opportunity.eligibility_text.ilike("%climate%"),
                    Opportunity.description.ilike("%climate%"),
                    Opportunity.raw_text.ilike("%climate%"),
                )
            )
            continue
        like = f"%{raw_filter}%"
        stmt = stmt.where(
            or_(
                Opportunity.title.ilike(like),
                Opportunity.org.ilike(like),
                Opportunity.description.ilike(like),
                Opportunity.eligibility_text.ilike(like),
                Opportunity.raw_text.ilike(like),
            )
        )
    return stmt


def build_search_reasons(query_terms: list[str], filters: list[str]) -> list[str]:
    reasons = []
    if query_terms:
        reasons.append(f"Matches query: {', '.join(query_terms[:3])}")
    if filters:
        reasons.append(f"Filters applied: {', '.join(filters[:3])}")
    return reasons


@router.get("/recommended", response_model=list[OpportunityMatch])
def recommended(
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
    limit: int = Query(default=20, ge=1, le=50),
    q: str | None = None,
    filters: list[str] | None = Query(default=None),
):
    profile = session.exec(select(FounderProfile).where(FounderProfile.user_id == current_user.id)).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Profile required")
    normalized_filters = normalize_filters(filters)
    if not q and not normalized_filters:
        return build_matches(session, profile, limit=limit)
    query_text = " ".join([build_profile_query(profile), q or ""]).strip()
    query_terms = [term for term in re.split(r"\s+", q or "") if term]
    try:
        query_embedding = embed_text(query_text)
        stmt = (
            select(Opportunity, Opportunity.embedding.l2_distance(query_embedding).label("distance"))
            .where(Opportunity.embedding.is_not(None))
            .order_by(Opportunity.embedding.l2_distance(query_embedding))
            .limit(limit)
        )
        stmt = apply_filters(stmt, normalized_filters)
        rows = session.exec(stmt).all()
        matches = []
        keywords = [profile.industry, profile.stage] + query_terms + [k.strip() for k in profile.keywords.split(",")]
        for opportunity, distance in rows:
            highlights = extract_highlights(
                " ".join([opportunity.eligibility_text, opportunity.description, opportunity.raw_text]),
                keywords,
            )
            matches.append(
                {
                    "opportunity": opportunity,
                    "score": distance_to_similarity(distance),
                    "distance": float(distance) if distance is not None else None,
                    "reasons": reason_list(profile, opportunity) + build_search_reasons(query_terms, normalized_filters),
                    "highlights": highlights,
                }
            )
        return matches
    except Exception:
        stmt = select(Opportunity).limit(limit)
        stmt = apply_filters(stmt, normalized_filters)
        stmt = stmt.where(
            or_(
                Opportunity.title.ilike(f"%{q}%"),
                Opportunity.org.ilike(f"%{q}%"),
                Opportunity.description.ilike(f"%{q}%"),
                Opportunity.eligibility_text.ilike(f"%{q}%"),
                Opportunity.raw_text.ilike(f"%{q}%"),
            )
        )
        rows = session.exec(stmt).all()
        matches = []
        for opportunity in rows:
            highlights = extract_highlights(
                " ".join([opportunity.eligibility_text, opportunity.description, opportunity.raw_text]),
                query_terms,
            )
            matches.append(
                {
                    "opportunity": opportunity,
                    "score": 0.35,
                    "distance": None,
                    "reasons": reason_list(profile, opportunity) + build_search_reasons(query_terms, normalized_filters),
                    "highlights": highlights,
                }
            )
        return matches


@router.get("", response_model=list[OpportunityRead])
def list_opportunities(
    session: Session = Depends(get_session),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Opportunity).offset(offset).limit(limit)
    return session.exec(stmt).all()


@router.get("/search", response_model=list[OpportunityMatch])
def search_opportunities(
    session: Session = Depends(get_session),
    q: str | None = None,
    filters: list[str] | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    normalized_filters = normalize_filters(filters)
    query_terms = [term for term in re.split(r"\s+", q or "") if term]
    if q:
        try:
            query_embedding = embed_text(q)
            stmt = (
                select(Opportunity, Opportunity.embedding.l2_distance(query_embedding).label("distance"))
                .where(Opportunity.embedding.is_not(None))
                .order_by(Opportunity.embedding.l2_distance(query_embedding))
                .offset(offset)
                .limit(limit)
            )
            stmt = apply_filters(stmt, normalized_filters)
            rows = session.exec(stmt).all()
            return [
                {
                    "opportunity": opportunity,
                    "score": distance_to_similarity(distance),
                    "distance": float(distance) if distance is not None else None,
                    "reasons": build_search_reasons(query_terms, normalized_filters),
                    "highlights": extract_highlights(
                        " ".join([opportunity.eligibility_text, opportunity.description, opportunity.raw_text]),
                        query_terms + normalized_filters,
                    ),
                }
                for opportunity, distance in rows
            ]
        except Exception:
            stmt = select(Opportunity).offset(offset).limit(limit)
            stmt = apply_filters(stmt, normalized_filters)
            stmt = stmt.where(
                or_(
                    Opportunity.title.ilike(f"%{q}%"),
                    Opportunity.org.ilike(f"%{q}%"),
                    Opportunity.description.ilike(f"%{q}%"),
                    Opportunity.eligibility_text.ilike(f"%{q}%"),
                    Opportunity.raw_text.ilike(f"%{q}%"),
                )
            )
            rows = session.exec(stmt).all()
            return [
                {
                    "opportunity": opportunity,
                    "score": 0.35,
                    "distance": None,
                    "reasons": build_search_reasons(query_terms, normalized_filters),
                    "highlights": extract_highlights(
                        " ".join([opportunity.eligibility_text, opportunity.description, opportunity.raw_text]),
                        query_terms + normalized_filters,
                    ),
                }
                for opportunity in rows
            ]
    stmt = select(Opportunity).offset(offset).limit(limit)
    stmt = apply_filters(stmt, normalized_filters)
    rows = session.exec(stmt).all()
    return [
        {
            "opportunity": opportunity,
            "score": 0.0,
            "distance": None,
            "reasons": build_search_reasons(query_terms, normalized_filters),
            "highlights": extract_highlights(
                " ".join([opportunity.eligibility_text, opportunity.description, opportunity.raw_text]),
                normalized_filters,
            ),
        }
        for opportunity in rows
    ]


@router.get("/{opportunity_id}", response_model=OpportunityRead)
def get_opportunity(opportunity_id: int, session: Session = Depends(get_session)):
    opportunity = session.get(Opportunity, opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Not found")
    return opportunity
