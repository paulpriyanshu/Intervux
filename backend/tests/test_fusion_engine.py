import pytest
from app.services.fusion_engine import MultimodalFusionEngine

def test_body_language_scoring():
    engine = MultimodalFusionEngine()
    visual = {
        "eye_contact": 80.0,
        "posture_score": 90.0,
        "face_visibility": 95.0,
        "gesture_score": 85.0
    }
    score = engine.compute_body_language_score(visual)
    assert 80.0 <= score <= 90.0

def test_speech_scoring():
    engine = MultimodalFusionEngine()
    speech = {
        "speaking_speed": 145.0, # Ideal 130-165
        "filler_count": 1,
        "pause_duration": 1.5,
        "volume_score": 80.0
    }
    score = engine.compute_speech_score(speech)
    assert score >= 85.0

def test_fusion_signals_synthesis():
    engine = MultimodalFusionEngine()
    visual = {"eye_contact": 55.0, "head_orientation": "Looking slightly left", "posture_score": 75.0, "face_visibility": 90.0, "gesture_score": 70.0}
    speech = {"speaking_speed": 175.0, "filler_count": 6, "pause_duration": 1.2, "volume_score": 75.0}
    language = {
        "relevance": 85.0,
        "clarity": 78.0,
        "technical_depth": 88.0,
        "structure": 80.0,
        "grammar": 90.0,
        "overall_answer_score": 82.0
    }

    result = engine.fuse_signals(visual, speech, language, interview_type="technical")
    assert "overall_score" in result
    assert "communication_score" in result
    assert "body_language_score" in result
    assert "speech_score" in result
    assert "recommendation" in result
    assert result["recommendation"]["text"] is not None
    # Recommendation should highlight slowing down or eye contact
    rec_text = result["recommendation"]["text"]
    assert "slowing down" in rec_text.lower() or "eye contact" in rec_text.lower() or "filler" in rec_text.lower()

def test_live_coaching_tips():
    engine = MultimodalFusionEngine()
    tip = engine.generate_live_coaching_tip(
        visual={"eye_contact": 45.0, "head_orientation": "Looking down"},
        speech={"speaking_speed": 140.0, "filler_count": 0}
    )
    assert tip is not None
    assert "eye" in tip.lower() or "camera" in tip.lower()
