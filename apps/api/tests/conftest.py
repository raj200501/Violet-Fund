import os
from pathlib import Path
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from app.db.session import engine
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    yield


@pytest.fixture(autouse=True)
def clean_db():
    with engine.begin() as conn:
        conn.execute(text("TRUNCATE TABLE labelingtask, application, opportunity, founderprofile, \"user\" RESTART IDENTITY CASCADE"))
    yield


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def auth_headers(client):
    client.post("/auth/signup", json={"email": "test@example.com", "password": "pass123"})
    response = client.post("/auth/login", json={"email": "test@example.com", "password": "pass123"})
    token = response.json()["access_token"]
    return {"Cookie": f"access_token={token}"}
