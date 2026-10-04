import pytest
from app.models.user import User

def test_register_and_login(client):
    # 1. Register new candidate
    reg_payload = {
        "name": "Sarah Connor",
        "email": "sarah@intervux.ai",
        "password": "SecurePassword123!"
    }
    response = client.post("/api/auth/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "sarah@intervux.ai"

    # 2. Duplicate registration rejected
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # 3. Login with correct credentials
    login_payload = {
        "email": "sarah@intervux.ai",
        "password": "SecurePassword123!"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # 4. Access protected /me route
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Sarah Connor"

def test_invalid_login(client):
    bad_login = {
        "email": "nonexistent@intervux.ai",
        "password": "WrongPassword"
    }
    res = client.post("/api/auth/login", json=bad_login)
    assert res.status_code == 401
