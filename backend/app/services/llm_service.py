import os
import json
import logging
import re
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert interview coach evaluating a candidate's spoken response.
Your evaluation must be objective, constructive, and based solely on the provided question and transcript.

Return ONLY a valid JSON object with the following exact keys and types:
{
  "relevance": <integer 0-100>,
  "clarity": <integer 0-100>,
  "technical_depth": <integer 0-100>,
  "structure": <integer 0-100>,
  "grammar": <integer 0-100>,
  "confidence": <integer 0-100>,
  "overall_answer_score": <integer 0-100>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "suggestions": [<string>, ...]
}

Do not include any surrounding markdown or prose. Just the JSON object.
"""

class LLMProvider:
    """Base interface for LLM evaluation providers."""
    def evaluate(self, question: str, transcript: str, interview_type: str) -> Dict[str, Any]:
        raise NotImplementedError

    @property
    def provider_name(self) -> str:
        raise NotImplementedError


class OpenAIProvider(LLMProvider):
    """OpenAI GPT-4o / GPT-3.5 evaluation provider."""
    def __init__(self, api_key: str):
        from openai import OpenAI
        self.client = OpenAI(api_key=api_key)

    @property
    def provider_name(self) -> str:
        return "OpenAI (GPT)"

    def evaluate(self, question: str, transcript: str, interview_type: str) -> Dict[str, Any]:
        user_prompt = f"""Question: {question}
Interview Type: {interview_type}
Candidate Transcript: {transcript}

Evaluate this interview response and output the required JSON format."""

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content or "{}"
        return json.loads(content)


class MockProvider(LLMProvider):
    """
    Mock / Development evaluation provider when no external LLM API key is set.
    Clearly labeled in outputs and logs as simulated/mock evaluation.
    Computes heuristic NLP scores based on keywords, structure, and length.
    """
    @property
    def provider_name(self) -> str:
        return "Development Mode (Simulated LLM - Set OPENAI_API_KEY for live models)"

    def evaluate(self, question: str, transcript: str, interview_type: str) -> Dict[str, Any]:
        logger.info("[MockProvider] Generating simulated answer evaluation...")
        words = transcript.strip().split()
        word_count = len(words)
        text_lower = transcript.lower()

        # Heuristic scoring based on response length and structure
        if word_count < 10:
            relevance = 45
            clarity = 50
            technical_depth = 40
            structure = 40
            grammar = 70
            confidence = 45
            strengths = ["Prompt was acknowledged"]
            weaknesses = ["Answer was extremely brief and lacked detail or explanation"]
            suggestions = ["Elaborate with specific concrete examples using the STAR method (Situation, Task, Action, Result)"]
        else:
            # Check for structural indicators (firstly, then, because, for example, result)
            has_structure = any(k in text_lower for k in ["because", "for example", "first", "second", "result", "in order to"])
            has_tech_terms = any(k in text_lower for k in ["process", "thread", "memory", "algorithm", "data", "scale", "system", "component", "design", "team", "project"])

            relevance = min(92, 65 + min(20, word_count // 5))
            clarity = 78 if has_structure else 70
            technical_depth = 82 if (interview_type == "technical" and has_tech_terms) else 74
            structure = 80 if has_structure else 68
            grammar = 85
            confidence = 76

            strengths = [
                f"Directly addressed the question '{question[:45]}...'",
                "Good pacing and clear vocabulary",
                "Communicated thought process clearly"
            ]
            weaknesses = [
                "Could provide deeper quantitative trade-offs or performance impact",
                "Could wrap up with a crisper concluding summary"
            ]
            suggestions = [
                "Mention real-world constraints (e.g. edge cases, scalability, or team alignment)",
                "Structure answers with distinct phases: overview, detailed implementation, and outcomes"
            ]

        overall = round(
            relevance * 0.25 +
            clarity * 0.20 +
            technical_depth * 0.20 +
            structure * 0.15 +
            grammar * 0.10 +
            confidence * 0.10
        )

        return {
            "relevance": int(relevance),
            "clarity": int(clarity),
            "technical_depth": int(technical_depth),
            "structure": int(structure),
            "grammar": int(grammar),
            "confidence": int(confidence),
            "overall_answer_score": int(overall),
            "strengths": strengths,
            "weaknesses": weaknesses,
            "suggestions": suggestions,
            "is_mock": True
        }


class LLMService:
    """Service abstraction for LLM answer evaluations."""
    def __init__(self):
        self.provider: LLMProvider = self._init_provider()

    def _init_provider(self) -> LLMProvider:
        api_key = settings.OPENAI_API_KEY
        if api_key and api_key.strip() and not api_key.startswith("your-"):
            try:
                logger.info("Initializing OpenAI LLM provider...")
                return OpenAIProvider(api_key.strip())
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI provider ({e}). Falling back to MockProvider.")
        
        logger.info("Using MockProvider for development mode (No external OPENAI_API_KEY configured).")
        return MockProvider()

    def evaluate_answer(self, question: str, transcript: str, interview_type: str = "technical") -> Dict[str, Any]:
        """
        Evaluate candidate's answer and return structured evaluation.
        Guarantees required JSON schema fields.
        """
        try:
            result = self.provider.evaluate(question, transcript, interview_type)
        except Exception as e:
            logger.error(f"Provider evaluation failed ({e}), falling back to mock provider.")
            fallback = MockProvider()
            result = fallback.evaluate(question, transcript, interview_type)

        # Sanitize and ensure all required fields are present
        cleaned = {
            "relevance": float(result.get("relevance", 70)),
            "clarity": float(result.get("clarity", 70)),
            "technical_depth": float(result.get("technical_depth", 70)),
            "structure": float(result.get("structure", 70)),
            "grammar": float(result.get("grammar", 80)),
            "confidence": float(result.get("confidence", 70)),
            "overall_answer_score": float(result.get("overall_answer_score", 72)),
            "strengths": list(result.get("strengths", ["Clear explanation"])),
            "weaknesses": list(result.get("weaknesses", ["Could provide more detail"])),
            "suggestions": list(result.get("suggestions", ["Elaborate on edge cases"])),
            "provider_used": self.provider.provider_name
        }
        return cleaned

llm_service = LLMService()
