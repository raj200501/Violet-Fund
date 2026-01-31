from sqlmodel import Session

from app.db.session import engine
from app.models.models import LabelingTask, Opportunity


def test_labeling_tasks_requires_auth(client):
    response = client.get("/labeling/tasks")
    assert response.status_code == 401


def test_labeling_tasks_include_opportunity_fields(client, auth_headers):
    with Session(engine) as session:
        opportunity = Opportunity(
            title="Test Grant",
            org="Test Org",
            url="https://example.com",
            funding_type="Grant",
            amount_text="$5,000",
            deadline=None,
            eligibility_text="Eligible founders",
            regions=["North America"],
            industries=["Climate"],
            stage_fit=["Seed"],
            description="Test description",
            raw_text="Raw text body",
            source_name="Test",
        )
        session.add(opportunity)
        session.commit()
        session.refresh(opportunity)

        task = LabelingTask(
            opportunity_id=opportunity.id,
            fields_needing_review={"stage": True},
            extracted_fields={"stage": "Seed"},
            status="Open",
        )
        session.add(task)
        session.commit()

    response = client.get("/labeling/tasks", headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    payload = data[0]
    assert payload["raw_text"] == "Raw text body"
    assert payload["title"] == "Test Grant"
    assert payload["org"] == "Test Org"
