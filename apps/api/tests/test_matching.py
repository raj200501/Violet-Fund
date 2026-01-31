from datetime import datetime

from sqlmodel import Session

from app.db.session import engine
from app.models.models import Opportunity
from app.services.embedding import embed_text


def test_recommended_matches(client, auth_headers):
    with Session(engine) as session:
        opportunity = Opportunity(
            title="Health Innovation Grant",
            org="Health Equity Fund",
            url="https://www.sba.gov/funding-programs/grants",
            funding_type="grant",
            amount_text="Up to $50k",
            deadline=datetime.utcnow(),
            eligibility_text="Women-led health startups in North America.",
            regions=["North America"],
            industries=["Health"],
            stage_fit=["Seed"],
            description="Support for health founders.",
            raw_text="Women-led health startups in North America.",
            source_name="test",
            embedding=embed_text("Health Innovation Grant women-led health startups"),
        )
        session.add(opportunity)
        session.commit()

    profile_payload = {
        "industry": "Health",
        "stage": "Seed",
        "location": "North America",
        "revenue_range": "$0-$100k",
        "keywords": "women,health",
        "free_text_goals": "Build a clinic platform",
    }
    res = client.post("/profile", json=profile_payload, headers=auth_headers)
    assert res.status_code == 200
    res = client.get("/opportunities/recommended", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert data[0]["opportunity"]["title"] == "Health Innovation Grant"
    assert 0 <= data[0]["score"] <= 1


def test_search_returns_similarity_scores(client):
    with Session(engine) as session:
        opportunity = Opportunity(
            title="Climate Resilience Prize",
            org="Green Future",
            url="https://example.com",
            funding_type="prize",
            amount_text="$25k",
            deadline=datetime.utcnow(),
            eligibility_text="Climate-focused startups.",
            regions=["Global"],
            industries=["Climate"],
            stage_fit=["Seed"],
            description="Support for climate resilience.",
            raw_text="Climate resilience programs for seed founders.",
            source_name="test",
            embedding=embed_text("Climate resilience seed founders"),
        )
        other_opportunity = Opportunity(
            title="Healthcare Accelerator",
            org="Health Labs",
            url="https://example.com",
            funding_type="accelerator",
            amount_text="$50k",
            deadline=datetime.utcnow(),
            eligibility_text="Healthcare startups.",
            regions=["Global"],
            industries=["Health"],
            stage_fit=["Seed"],
            description="Support for healthcare founders.",
            raw_text="Healthcare accelerator for founders.",
            source_name="test",
            embedding=embed_text("Healthcare accelerator founders"),
        )
        session.add(opportunity)
        session.add(other_opportunity)
        session.commit()

    res = client.get("/opportunities/search?q=climate")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert data[0]["opportunity"]["title"] == "Climate Resilience Prize"
    assert 0 <= data[0]["score"] <= 1
