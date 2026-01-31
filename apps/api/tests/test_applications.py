from datetime import datetime

from sqlmodel import Session

from app.db.session import engine
from app.models.models import Opportunity
from app.services.embedding import embed_text


def test_patch_application_status_only(client, auth_headers):
    with Session(engine) as session:
        opportunity = Opportunity(
            title="Women in Tech Grant",
            org="Tech Equity Fund",
            url="https://example.com",
            funding_type="grant",
            amount_text="$30k",
            deadline=datetime.utcnow(),
            eligibility_text="Women-led startups.",
            regions=["Global"],
            industries=["Tech"],
            stage_fit=["Seed"],
            description="Support for women-led tech startups.",
            raw_text="Women-led tech startups are eligible.",
            source_name="test",
            embedding=embed_text("Women-led tech startups grant"),
        )
        session.add(opportunity)
        session.commit()
        session.refresh(opportunity)

    create_response = client.post(
        "/applications",
        json={"opportunity_id": opportunity.id, "status": "Saved", "notes": "Initial notes", "tasks": {}, "due_dates": {}},
        headers=auth_headers,
    )
    assert create_response.status_code == 200
    application = create_response.json()

    patch_response = client.patch(
        f"/applications/{application['id']}",
        json={"status": "Planned"},
        headers=auth_headers,
    )
    assert patch_response.status_code == 200
    updated = patch_response.json()
    assert updated["status"] == "Planned"
    assert updated["notes"] == "Initial notes"
