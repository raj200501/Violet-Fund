import json
from datetime import datetime
from pathlib import Path

from sqlmodel import Session, select

from app.db.session import engine
from app.models.models import LabelingTask, Opportunity
from app.services.embedding import embed_text

DATA_PATH = Path("/data/opportunities_seed.json")


def normalize_deadline(value: str | None):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def ingest():
    if not DATA_PATH.exists():
        raise SystemExit(f"Seed dataset not found at {DATA_PATH}")
    items = json.loads(DATA_PATH.read_text())
    with Session(engine) as session:
        for item in items:
            existing = session.exec(select(Opportunity).where(Opportunity.title == item["title"])).first()
            payload = {
                **item,
                "deadline": normalize_deadline(item.get("deadline")),
                "embedding": embed_text(
                    " ".join([item["title"], item["description"], item["eligibility_text"]])
                ),
            }
            if existing:
                for key, value in payload.items():
                    setattr(existing, key, value)
                existing.updated_at = datetime.utcnow()
                opportunity = existing
            else:
                opportunity = Opportunity(**payload)
                session.add(opportunity)
            session.commit()
            session.refresh(opportunity)

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
                        "deadline": opportunity.deadline.isoformat() if opportunity.deadline else None,
                        "amount_text": opportunity.amount_text,
                        "industries": opportunity.industries,
                    },
                )
                session.add(task)
                session.commit()
    print(f"Ingested {len(items)} opportunities")


if __name__ == "__main__":
    ingest()
