from datetime import datetime

from sqlmodel import Session

from app.db.session import engine
from app.models.models import Opportunity
from app.services import scraping


def test_copilot_analyze_text_returns_insights(client):
    payload = {
        "raw_text": "The Climate Catalyst Grant offers $10,000 for women-led startups. Applications due Jan 20, 2026.",
        "title": "Climate Catalyst Grant",
    }
    response = client.post("/copilot/analyze-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]
    assert data["extracted"]
    assert isinstance(data["evidence"], list)
    assert data["trust"]["trust_score"] >= 0


def test_copilot_ingest_url_creates_opportunity(client, monkeypatch):
    class FakeResponse:
        status_code = 200
        headers = {"Content-Type": "text/html"}
        text = (
            "<html><head><title>Test Grant</title>"
            "<meta name='description' content='Support for founders.' /></head>"
            "<body>Grant of $5,000. Apply by Jan 20, 2026. Eligible founders in North America.</body></html>"
        )

        def raise_for_status(self):
            return None

    monkeypatch.setattr(scraping.requests, "get", lambda *args, **kwargs: FakeResponse())

    response = client.post("/copilot/ingest-url", json={"url": "https://example.com/grant"})
    assert response.status_code == 200
    data = response.json()
    assert data["opportunity"]["title"] == "Test Grant"
    assert "insights" in data

    with Session(engine) as session:
        opportunity = session.get(Opportunity, data["opportunity"]["id"])
        assert opportunity is not None


def test_copilot_ingest_text_creates_opportunity(client):
    payload = {
        "raw_text": "Seed-stage grant for climate founders in North America. Deadline Feb 12, 2026.",
        "title": "Offline Grant",
        "org": "Offline Org",
    }
    response = client.post("/copilot/ingest-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["opportunity"]["title"] == "Offline Grant"
    assert "insights" in data


def test_copilot_plan_endpoint_returns_phases(client):
    with Session(engine) as session:
        opportunity = Opportunity(
            title="Plan Grant",
            org="Plan Org",
            url="https://example.com",
            funding_type="Grant",
            amount_text="$10k",
            deadline=datetime.utcnow(),
            eligibility_text="Eligible founders",
            regions=["North America"],
            industries=["Climate"],
            stage_fit=["Seed"],
            description="Support for climate founders.",
            raw_text="Support for climate founders with deadlines.",
            source_name="test",
        )
        session.add(opportunity)
        session.commit()
        session.refresh(opportunity)

    response = client.post(
        f"/copilot/opportunities/{opportunity.id}/plan",
        json={"profile": {"industry": "Climate", "stage": "Seed", "location": "North America"}},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["phases"]
    assert data["drafts"]["outreach_email"]
