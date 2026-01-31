def test_signup_login_me(client):
    res = client.post("/auth/signup", json={"email": "hello@example.com", "password": "pass123"})
    assert res.status_code == 200
    res = client.post("/auth/login", json={"email": "hello@example.com", "password": "pass123"})
    assert res.status_code == 200
    token = res.json()["access_token"]
    res = client.get("/auth/me", headers={"Cookie": f"access_token={token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "hello@example.com"
