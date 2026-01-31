from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    email: str
    created_at: datetime


class FounderProfileCreate(BaseModel):
    industry: str
    stage: str
    location: str
    revenue_range: str
    keywords: str
    woman_owned_certifications: Optional[str] = None
    free_text_goals: str


class FounderProfileRead(FounderProfileCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime


class OpportunityRead(BaseModel):
    id: int
    title: str
    org: str
    url: str
    funding_type: str
    amount_text: Optional[str]
    deadline: Optional[datetime]
    eligibility_text: str
    regions: list[str]
    industries: list[str]
    stage_fit: list[str]
    description: str
    raw_text: str
    source_name: str


class OpportunityMatch(BaseModel):
    opportunity: OpportunityRead
    score: float
    distance: Optional[float] = None
    reasons: list[str]
    highlights: list[str]


class ApplicationCreate(BaseModel):
    opportunity_id: int
    status: str
    notes: str = ""
    tasks: dict[str, Any] = {}
    due_dates: dict[str, Any] = {}


class ApplicationRead(ApplicationCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime


class ApplicationReadWithOpportunity(ApplicationRead):
    opportunity: OpportunityRead


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    tasks: Optional[dict[str, Any]] = None
    due_dates: Optional[dict[str, Any]] = None


class LabelingTaskRead(BaseModel):
    id: int
    opportunity_id: int
    fields_needing_review: dict[str, Any]
    extracted_fields: dict[str, Any]
    user_corrections: dict[str, Any]
    status: str
    audit_trail: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class LabelingTaskReadWithOpportunity(LabelingTaskRead):
    raw_text: str
    title: str
    org: str


class LabelingTaskUpdate(BaseModel):
    user_corrections: dict[str, Any]
    status: str = "Reviewed"
