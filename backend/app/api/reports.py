import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database.connection import get_db
from app.models.user import User
from app.models.interview import Interview
from app.schemas.report import InterviewReport, ScoreCard, TimelinePoint
from app.api.auth import get_current_user
from app.services.llm_service import llm_service

router = APIRouter(prefix="/api/reports", tags=["Reports & Analytics"])

@router.get("/{interview_id}", response_model=InterviewReport)
def get_interview_report(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate comprehensive multimodal analytics report for an interview."""
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id, Interview.user_id == current_user.id)
        .first()
    )
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found."
        )

    # Calculate status helper
    def get_status(score: float) -> str:
        if score >= 85:
            return "Excellent"
        elif score >= 70:
            return "Good"
        elif score >= 55:
            return "Fair"
        return "Needs Work"

    comm_score = interview.communication_score or 75.0
    body_score = interview.body_language_score or 78.0
    speech_score = interview.speech_score or 76.0
    ans_score = interview.answer_quality_score or 74.0
    tech_score = interview.technical_score if interview.technical_score is not None else 80.0
    overall = interview.overall_score or 76.0

    score_cards = [
        ScoreCard(
            title="Overall Mastery",
            score=overall,
            status=get_status(overall),
            description="Holistic performance across delivery, knowledge, and presentation."
        ),
        ScoreCard(
            title="Communication",
            score=comm_score,
            status=get_status(comm_score),
            description="Clarity of ideas, pacing coherence, and verbal conciseness."
        ),
        ScoreCard(
            title="Body Language",
            score=body_score,
            status=get_status(body_score),
            description="Eye contact consistency, head centering, and stable posture."
        ),
        ScoreCard(
            title="Speech & Vocalics",
            score=speech_score,
            status=get_status(speech_score),
            description="Pacing cadence, pause control, and low filler word frequency."
        ),
        ScoreCard(
            title="Answer Quality",
            score=ans_score,
            status=get_status(ans_score),
            description="Structural flow, question relevance, and logical depth."
        ),
        ScoreCard(
            title="Technical Acumen" if interview.type == "technical" else "Behavioral Fit",
            score=tech_score,
            status=get_status(tech_score),
            description="Subject matter mastery, concrete rationale, and domain precision."
        ),
    ]

    # Timeline data per question
    timeline = []
    for q in interview.questions:
        if q.response:
            resp = q.response
            vm = resp.vision_metrics
            eval_score = resp.answer_evaluation.overall_score if resp.answer_evaluation else 70.0
            eye_val = vm.eye_contact if vm else 75.0
            timeline.append(TimelinePoint(
                question_number=q.order_number,
                question_category=q.category,
                overall_score=round(eval_score, 1),
                eye_contact=round(eye_val, 1),
                speaking_speed=round(resp.speaking_speed, 1),
                filler_count=resp.filler_count
            ))

    # Radar chart scores
    radar_scores = [
        {"subject": "Clarity", "A": comm_score, "fullMark": 100},
        {"subject": "Eye Contact", "A": body_score, "fullMark": 100},
        {"subject": "Pacing", "A": speech_score, "fullMark": 100},
        {"subject": "Depth", "A": tech_score, "fullMark": 100},
        {"subject": "Structure", "A": ans_score, "fullMark": 100},
        {"subject": "Confidence", "A": min(100.0, (comm_score + body_score) / 2), "fullMark": 100},
    ]

    # Check AI Mode indicator
    if getattr(llm_service.provider, "is_mock", False) or "Mock" in llm_service.provider.__class__.__name__:
        ai_mode_badge = "Development Mode (Mock / Heuristic AI)"
    else:
        ai_mode_badge = f"Live AI Mode ({llm_service.provider.provider_name})"


    return InterviewReport(
        interview=interview,
        score_cards=score_cards,
        timeline=timeline,
        radar_scores=radar_scores,
        recommendations=interview.recommendations,
        questions=interview.questions,
        ai_mode_badge=ai_mode_badge
    )
