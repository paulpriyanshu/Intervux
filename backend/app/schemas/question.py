from pydantic import BaseModel, ConfigDict
from typing import Optional

class QuestionBase(BaseModel):
    question_text: str
    category: str
    difficulty: str
    order_number: int = 1

class QuestionCreate(QuestionBase):
    interview_id: Optional[int] = None

class QuestionOut(QuestionBase):
    id: int
    interview_id: int

    model_config = ConfigDict(from_attributes=True)
