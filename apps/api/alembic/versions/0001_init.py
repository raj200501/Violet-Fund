"""initial tables

Revision ID: 0001
Revises: 
Create Date: 2025-01-01
"""

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "user",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String, nullable=False, unique=True),
        sa.Column("hashed_password", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )
    op.create_table(
        "founderprofile",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("user.id"), nullable=False),
        sa.Column("industry", sa.String, nullable=False),
        sa.Column("stage", sa.String, nullable=False),
        sa.Column("location", sa.String, nullable=False),
        sa.Column("revenue_range", sa.String, nullable=False),
        sa.Column("keywords", sa.String, nullable=False),
        sa.Column("woman_owned_certifications", sa.String, nullable=True),
        sa.Column("free_text_goals", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )
    op.create_table(
        "opportunity",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("org", sa.String, nullable=False),
        sa.Column("url", sa.String, nullable=False),
        sa.Column("funding_type", sa.String, nullable=False),
        sa.Column("amount_text", sa.String, nullable=True),
        sa.Column("deadline", sa.DateTime, nullable=True),
        sa.Column("eligibility_text", sa.String, nullable=False),
        sa.Column("regions", sa.JSON, nullable=False),
        sa.Column("industries", sa.JSON, nullable=False),
        sa.Column("stage_fit", sa.JSON, nullable=False),
        sa.Column("description", sa.String, nullable=False),
        sa.Column("raw_text", sa.String, nullable=False),
        sa.Column("source_name", sa.String, nullable=False),
        sa.Column("embedding", Vector(384)),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )
    op.create_table(
        "application",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("user.id"), nullable=False),
        sa.Column("opportunity_id", sa.Integer, sa.ForeignKey("opportunity.id"), nullable=False),
        sa.Column("status", sa.String, nullable=False),
        sa.Column("notes", sa.String, nullable=False),
        sa.Column("tasks", sa.JSON, nullable=False),
        sa.Column("due_dates", sa.JSON, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )
    op.create_table(
        "labelingtask",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("opportunity_id", sa.Integer, sa.ForeignKey("opportunity.id"), nullable=False),
        sa.Column("fields_needing_review", sa.JSON, nullable=False),
        sa.Column("extracted_fields", sa.JSON, nullable=False),
        sa.Column("user_corrections", sa.JSON, nullable=False),
        sa.Column("status", sa.String, nullable=False),
        sa.Column("audit_trail", sa.JSON, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )


def downgrade():
    op.drop_table("labelingtask")
    op.drop_table("application")
    op.drop_table("opportunity")
    op.drop_table("founderprofile")
    op.drop_table("user")
