from sqlalchemy import Column, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False, unique=True, index=True)
    transcript = Column(Text, nullable=False, default="")
    duration = Column(Float, nullable=False, default=0.0)
    speaking_speed = Column(Float, nullable=False, default=0.0) # WPM
    pause_duration = Column(Float, nullable=False, default=0.0) # seconds
    filler_count = Column(Integer, nullable=False, default=0)
    volume_score = Column(Float, nullable=False, default=0.0)

    question = relationship("Question", back_populates="response")
    vision_metrics = relationship("VisionMetrics", back_populates="response", uselist=False, cascade="all, delete-orphan")
    answer_evaluation = relationship("AnswerEvaluation", back_populates="response", uselist=False, cascade="all, delete-orphan")
