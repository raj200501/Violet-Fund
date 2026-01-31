from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.models import FounderProfile
from app.models.schemas import FounderProfileCreate, FounderProfileRead
from app.services.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("", response_model=FounderProfileRead)
def create_profile(
    payload: FounderProfileCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    profile = session.exec(select(FounderProfile).where(FounderProfile.user_id == current_user.id)).first()
    if profile:
        for key, value in payload.model_dump().items():
            setattr(profile, key, value)
    else:
        profile = FounderProfile(user_id=current_user.id, **payload.model_dump())
        session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


@router.get("", response_model=FounderProfileRead | None)
def get_profile(
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return session.exec(select(FounderProfile).where(FounderProfile.user_id == current_user.id)).first()
