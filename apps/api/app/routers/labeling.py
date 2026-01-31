from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.models import FounderProfile, LabelingTask, Opportunity
from app.models.schemas import LabelingTaskReadWithOpportunity, LabelingTaskUpdate
from app.services.auth import get_current_user
from app.services.embedding import embed_text
from app.services.matching import build_profile_query

router = APIRouter(prefix="/labeling", tags=["labeling"])


@router.get("/tasks", response_model=list[LabelingTaskReadWithOpportunity])
def list_tasks(
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    stmt = (
        select(LabelingTask, Opportunity)
        .join(Opportunity, Opportunity.id == LabelingTask.opportunity_id)
        .where(LabelingTask.status == "Open")
    )
    rows = session.exec(stmt).all()
    return [
        LabelingTaskReadWithOpportunity(
            **task.dict(),
            raw_text=opportunity.raw_text,
            title=opportunity.title,
            org=opportunity.org,
        )
        for task, opportunity in rows
    ]


def rank_position(session: Session, profile: FounderProfile, opportunity_id: int) -> int | None:
    query_text = build_profile_query(profile)
    query_embedding = embed_text(query_text)
    stmt = select(Opportunity.id).order_by(Opportunity.embedding.l2_distance(query_embedding)).limit(100)
    ids = [row[0] for row in session.exec(stmt).all()]
    if opportunity_id in ids:
        return ids.index(opportunity_id) + 1
    return None


@router.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    payload: LabelingTaskUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    task = session.get(LabelingTask, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    opportunity = session.get(Opportunity, task.opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    profile = session.exec(select(FounderProfile).where(FounderProfile.user_id == current_user.id)).first()
    before_rank = rank_position(session, profile, opportunity.id) if profile else None

    task.user_corrections = payload.user_corrections
    task.status = payload.status
    task.audit_trail = {"reviewed_by": current_user.email, "reviewed_at": datetime.utcnow().isoformat()}
    task.updated_at = datetime.utcnow()

    for field, value in payload.user_corrections.items():
        if hasattr(opportunity, field):
            setattr(opportunity, field, value)

    if any(key in payload.user_corrections for key in ["raw_text", "description", "eligibility_text"]):
        opportunity.embedding = embed_text(
            " ".join([opportunity.title, opportunity.description, opportunity.eligibility_text])
        )

    session.add(task)
    session.add(opportunity)
    session.commit()

    after_rank = rank_position(session, profile, opportunity.id) if profile else None

    return {
        "task_id": task.id,
        "status": task.status,
        "before_rank": before_rank,
        "after_rank": after_rank,
    }
