from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any

class VisionMetricsData(BaseModel):
    eye_contact: float = 0.0
    face_visibility: float = 0.0
    head_orientation: str = "Mostly centered"
    posture_score: float = 0.0
    gesture_score: float = 0.0

class VisionMetricsOut(VisionMetricsData):
    id: int
    response_id: int

    model_config = ConfigDict(from_attributes=True)

class AnswerEvaluationData(BaseModel):
    relevance: float = 0.0
    clarity: float = 0.0
    technical_depth: float = 0.0
    structure: float = 0.0
    grammar: float = 0.0
    confidence: float = 0.0
    overall_answer_score: float = 0.0
    strengths: List[str] = []
    weaknesses: List[str] = []
    suggestions: List[str] = []

class AnswerEvaluationOut(BaseModel):
    id: int
    response_id: int
    relevance: float
    clarity: float
    technical_depth: float
    structure: float
    grammar: float
    confidence: float
    overall_score: float
    feedback: str

    model_config = ConfigDict(from_attributes=True)

class ResponseCreate(BaseModel):
    question_id: int
    transcript: str
    duration: float = 0.0
    speaking_speed: float = 0.0
    pause_duration: float = 0.0
    filler_count: int = 0
    volume_score: float = 0.0
    vision: Optional[VisionMetricsData] = None

class ResponseOut(BaseModel):
    id: int
    question_id: int
    transcript: str
    duration: float
    speaking_speed: float
    pause_duration: float
    filler_count: int
    volume_score: float
    vision_metrics: Optional[VisionMetricsOut] = None
    answer_evaluation: Optional[AnswerEvaluationOut] = None

    model_config = ConfigDict(from_attributes=True)
