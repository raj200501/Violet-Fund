from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class FounderProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    industry: str
    stage: str
    location: str
    revenue_range: str
    keywords: str
    woman_owned_certifications: Optional[str] = None
    free_text_goals: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Opportunity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    org: str
    url: str
    funding_type: str
    amount_text: Optional[str] = None
    deadline: Optional[datetime] = None
    eligibility_text: str
    regions: list[str] = Field(sa_column=Column(JSON))
    industries: list[str] = Field(sa_column=Column(JSON))
    stage_fit: list[str] = Field(sa_column=Column(JSON))
    description: str
    raw_text: str
    source_name: str
    embedding: Optional[list[float]] = Field(sa_column=Column(Vector(384)))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    opportunity_id: int = Field(foreign_key="opportunity.id")
    status: str
    notes: str = ""
    tasks: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    due_dates: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class LabelingTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    opportunity_id: int = Field(foreign_key="opportunity.id")
    fields_needing_review: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    extracted_fields: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    user_corrections: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    status: str = "Open"
    audit_trail: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
