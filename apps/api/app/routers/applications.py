from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.models import Application, Opportunity
from app.models.schemas import (
    ApplicationCreate,
    ApplicationRead,
    ApplicationReadWithOpportunity,
    ApplicationUpdate,
)
from app.services.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("", response_model=ApplicationRead)
def create_application(
    payload: ApplicationCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    application = Application(user_id=current_user.id, **payload.model_dump())
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


@router.get("", response_model=list[ApplicationRead] | list[ApplicationReadWithOpportunity])
def list_applications(
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
    include: str | None = Query(default=None),
):
    if include == "opportunity":
        stmt = (
            select(Application, Opportunity)
            .join(Opportunity, Opportunity.id == Application.opportunity_id)
            .where(Application.user_id == current_user.id)
        )
        rows = session.exec(stmt).all()
        return [
            ApplicationReadWithOpportunity(
                **application.dict(),
                opportunity=opportunity,
            )
            for application, opportunity in rows
        ]
    return session.exec(select(Application).where(Application.user_id == current_user.id)).all()


@router.put("/{application_id}", response_model=ApplicationRead)
def update_application(
    application_id: int,
    payload: ApplicationCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    application = session.get(Application, application_id)
    if not application or application.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not found")
    for key, value in payload.model_dump().items():
        setattr(application, key, value)
    application.updated_at = datetime.utcnow()
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


@router.patch("/{application_id}", response_model=ApplicationRead)
def patch_application(
    application_id: int,
    payload: ApplicationUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    application = session.get(Application, application_id)
    if not application or application.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not found")
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(application, key, value)
    application.updated_at = datetime.utcnow()
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    application = session.get(Application, application_id)
    if not application or application.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not found")
    session.delete(application)
    session.commit()
    return {"status": "deleted"}
