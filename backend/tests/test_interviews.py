import pytest

def test_full_interview_lifecycle(client):
    # Register & get auth token
    reg_res = client.post("/api/auth/register", json={
        "name": "Alex Tech",
        "email": "alex@intervux.ai",
        "password": "Password123"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create technical practice interview
    create_res = client.post("/api/interviews", json={
        "type": "technical",
        "mode": "practice",
        "difficulty": "medium",
        "question_count": 2
    }, headers=headers)
    assert create_res.status_code == 201
    interview = create_res.json()
    assert interview["type"] == "technical"
    assert len(interview["questions"]) == 2
    question_1 = interview["questions"][0]

    # 2. Submit candidate answer response
    ans_res = client.post("/api/responses", json={
        "question_id": question_1["id"],
        "transcript": "In operating systems, a process is an executing program instance with its own virtual address space, while a thread is a lightweight execution unit inside a process sharing the same address space and heap.",
        "duration": 32.5,
        "speaking_speed": 142.0,
        "pause_duration": 1.6,
        "filler_count": 1,
        "volume_score": 78.0,
        "vision": {
            "eye_contact": 82.0,
            "face_visibility": 94.0,
            "head_orientation": "Mostly centered",
            "posture_score": 88.0,
            "gesture_score": 75.0
        }
    }, headers=headers)
    assert ans_res.status_code == 201
    resp_data = ans_res.json()
    assert resp_data["question_id"] == question_1["id"]
    assert resp_data["vision_metrics"]["eye_contact"] == 82.0
    assert resp_data["answer_evaluation"] is not None

    # 3. Complete interview
    comp_res = client.post(f"/api/interviews/{interview['id']}/complete", headers=headers)
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["status"] == "completed"
    assert comp_data["overall_score"] is not None
    assert comp_data["overall_score"] > 50

    # 4. Generate analytics report
    report_res = client.get(f"/api/reports/{interview['id']}", headers=headers)
    assert report_res.status_code == 200
    report_data = report_res.json()
    assert len(report_data["score_cards"]) >= 5
    assert len(report_data["timeline"]) >= 1
    assert len(report_data["recommendations"]) >= 1
