import pytest

def test_root_and_health_endpoints(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

def test_question_bank_retrieval(client):
    res = client.get("/api/questions/bank")
    assert res.status_code == 200
    questions = res.json()
    assert len(questions) > 5

    # Filter by category
    dsa_res = client.get("/api/questions/bank?category=DSA")
    assert dsa_res.status_code == 200
    assert all("dsa" in q["category"].lower() for q in dsa_res.json())

def test_unauthorized_access_protection(client):
    # Attempting to fetch interviews without token
    res = client.get("/api/interviews")
    assert res.status_code == 401
