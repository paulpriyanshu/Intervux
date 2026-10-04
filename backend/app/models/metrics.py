from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class VisionMetrics(Base):
    __tablename__ = "vision_metrics"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id"), nullable=False, unique=True, index=True)
    eye_contact = Column(Float, nullable=False, default=0.0)      # % 0-100
    face_visibility = Column(Float, nullable=False, default=0.0)  # % 0-100
    head_orientation = Column(String(100), nullable=False, default="Mostly centered")
    posture_score = Column(Float, nullable=False, default=0.0)    # 0-100
    gesture_score = Column(Float, nullable=False, default=0.0)    # 0-100

    response = relationship("Response", back_populates="vision_metrics")


class AnswerEvaluation(Base):
    __tablename__ = "answer_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id"), nullable=False, unique=True, index=True)
    relevance = Column(Float, nullable=False, default=0.0)
    clarity = Column(Float, nullable=False, default=0.0)
    technical_depth = Column(Float, nullable=False, default=0.0)
    structure = Column(Float, nullable=False, default=0.0)
    grammar = Column(Float, nullable=False, default=0.0)
    confidence = Column(Float, nullable=False, default=0.0)
    overall_score = Column(Float, nullable=False, default=0.0)
    feedback = Column(Text, nullable=False, default="{}") # JSON encoded feedback details

    response = relationship("Response", back_populates="answer_evaluation")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False, index=True)
    category = Column(String(100), nullable=False) # visual, speech, answer, technical
    recommendation = Column(Text, nullable=False)
    priority = Column(String(50), nullable=False, default="medium") # high, medium, low

    interview = relationship("Interview", back_populates="recommendations")
