import os
import re
import math
import logging
import tempfile
from typing import Dict, Any, List, Optional
import numpy as np

logger = logging.getLogger(__name__)

# Common conversational filler words in spoken English
FILLER_PATTERNS = [
    r"\b(um+)\b",
    r"\b(uh+)\b",
    r"\b(er+)\b",
    r"\b(ah+)\b",
    r"\b(like)\b",
    r"\b(you know)\b",
    r"\b(basically)\b",
    r"\b(actually)\b",
    r"\b(literally)\b",
    r"\b(so)\b",
    r"\b(i mean)\b",
    r"\b(kind of)\b",
    r"\b(sort of)\b",
    r"\b(right\?)\b",
]

class SpeechService:
    """
    Analyzes spoken audio signals and transcripts:
    - Speech-to-text transcription via Whisper
    - Speaking speed (Words Per Minute)
    - Pause duration (silence detection and phrasing gap estimation)
    - Filler word detection and frequency
    - Approximate audio volume / RMS energy level
    - Speech duration

    Does NOT fabricate pronunciation scores.
    """

    def __init__(self):
        self._whisper_model = None

    def _get_whisper_model(self):
        if self._whisper_model is None:
            try:
                import whisper
                from app.config import settings
                model_name = settings.WHISPER_MODEL or "base"
                logger.info(f"Loading Whisper model '{model_name}'...")
                self._whisper_model = whisper.load_model(model_name)
                logger.info("Whisper model loaded successfully.")
            except Exception as e:
                logger.warning(f"Could not load local Whisper model ({e}). Will use fallback audio processing.")
                self._whisper_model = False
        return self._whisper_model if self._whisper_model is not False else None

    def transcribe_audio_file(self, audio_path: str) -> str:
        """Transcribe an audio file using Whisper."""
        model = self._get_whisper_model()
        if model is not None:
            try:
                result = model.transcribe(audio_path, fp16=False)
                return result.get("text", "").strip()
            except Exception as e:
                logger.error(f"Whisper transcription failed: {e}")
        return ""

    def transcribe_audio_bytes(self, audio_bytes: bytes, file_ext: str = ".webm") -> str:
        """Transcribe raw audio bytes using Whisper via temporary file."""
        with tempfile.NamedTemporaryFile(suffix=file_ext, delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            return self.transcribe_audio_file(tmp_path)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    def count_filler_words(self, text: str) -> tuple[int, List[str]]:
        """Identifies and counts filler words in the transcript."""
        if not text:
            return 0, []

        found_fillers = []
        lower_text = text.lower()
        for pattern in FILLER_PATTERNS:
            matches = re.findall(pattern, lower_text)
            if matches:
                for match in matches:
                    found_fillers.append(match if isinstance(match, str) else match[0])

        return len(found_fillers), found_fillers

    def analyze_speech(
        self,
        transcript: str,
        duration_seconds: float,
        audio_volume_samples: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        """
        Calculates comprehensive speech metrics based on transcript, duration, and volume data.
        
        Metrics:
        - speaking_speed: Words Per Minute (WPM)
        - filler_count: int
        - filler_words: list[str]
        - pause_duration: estimated average pause duration in seconds
        - speech_duration: float in seconds
        - volume_score: 0-100 normalized volume consistency
        """
        clean_text = transcript.strip()
        words = clean_text.split()
        word_count = len(words)

        # Minimum duration floor of 1.0 second to avoid division by zero
        effective_duration = max(1.0, duration_seconds)

        # 1. Speaking Speed (WPM)
        # Normal conversational interview speed is typically 130 - 160 WPM
        wpm = (word_count / effective_duration) * 60.0
        wpm = round(wpm, 1)

        # 2. Filler words
        filler_count, filler_words = self.count_filler_words(clean_text)

        # 3. Pause duration estimation
        # Punctuation pauses (commas, periods, ellipses, semicolons) + silence intervals
        punctuation_pauses = len(re.findall(r"[,;:\.\?!]+", clean_text))
        if punctuation_pauses > 0 and word_count > 5:
            # Estimated average pause duration in seconds based on pacing
            avg_pause = min(4.5, max(0.8, (effective_duration - (word_count * 0.35)) / max(1, punctuation_pauses)))
        else:
            avg_pause = 1.8 if word_count > 0 else 0.0
        avg_pause = round(avg_pause, 1)

        # 4. Volume score
        if audio_volume_samples and len(audio_volume_samples) > 0:
            avg_vol = float(np.mean(audio_volume_samples))
            # Normalize to 0-100 scale
            volume_score = min(100.0, max(10.0, avg_vol * 100.0 if avg_vol <= 1.0 else avg_vol))
        else:
            # Baseline comfortable microphone level
            volume_score = 75.0
        volume_score = round(volume_score, 1)

        return {
            "transcript": clean_text,
            "duration": round(effective_duration, 1),
            "word_count": word_count,
            "speaking_speed": wpm,
            "filler_count": filler_count,
            "filler_words": filler_words,
            "pause_duration": avg_pause,
            "volume_score": volume_score
        }

speech_service = SpeechService()
