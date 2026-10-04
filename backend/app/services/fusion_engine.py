import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class MultimodalFusionEngine:
    """
    Multimodal AI Fusion Engine:
    Combines Visual, Speech, and Language signals to compute objective
    category scores and synthesize contextual, actionable recommendations.
    
    Deterministic scoring rules:
    - Body Language Score: eye contact (35%), posture (30%), face visibility (20%), gestures (15%)
    - Speech Score: speaking speed calibration (35%), filler words penalty (25%), pauses (20%), volume (20%)
    - Answer Quality Score: relevance (30%), clarity (25%), structure (20%), grammar (15%), confidence (10%)
    - Technical Score: technical depth (60%), relevance (40%)
    - Communication Score: clarity (25%), eye contact (25%), speaking speed (20%), filler penalty (15%), posture (15%)
    - Overall Score: weighted combination of answer quality, communication, body language, and speech
    """

    def compute_body_language_score(self, visual: Dict[str, Any]) -> float:
        eye_contact = visual.get("eye_contact", 75.0)
        posture = visual.get("posture_score", 80.0)
        face_visibility = visual.get("face_visibility", 90.0)
        gesture = visual.get("gesture_score", 75.0)

        score = (
            eye_contact * 0.35 +
            posture * 0.30 +
            face_visibility * 0.20 +
            gesture * 0.15
        )
        return round(min(100.0, max(0.0, score)), 1)

    def compute_speech_score(self, speech: Dict[str, Any]) -> float:
        wpm = speech.get("speaking_speed", 140.0)
        filler_count = speech.get("filler_count", 0)
        pause_duration = speech.get("pause_duration", 1.8)
        volume = speech.get("volume_score", 75.0)

        # 1. Speaking pace calibration (Ideal: 130 - 160 WPM)
        if 130 <= wpm <= 165:
            pace_score = 95.0
        elif 110 <= wpm < 130 or 165 < wpm <= 185:
            pace_score = 80.0
        elif 90 <= wpm < 110 or 185 < wpm <= 210:
            pace_score = 65.0
        else:
            pace_score = 50.0

        # 2. Filler word penalty
        # 0-2 fillers: minor/no penalty, 3-5: moderate, >5: noticeable
        if filler_count <= 1:
            filler_score = 95.0
        elif filler_count <= 3:
            filler_score = 85.0
        elif filler_count <= 6:
            filler_score = 70.0
        else:
            filler_score = max(40.0, 70.0 - (filler_count - 6) * 5.0)

        # 3. Pause duration (Ideal: 1.2 - 2.5s)
        if 1.0 <= pause_duration <= 2.5:
            pause_score = 90.0
        elif pause_duration < 1.0:
            pause_score = 75.0 # Rushed without breathing
        else:
            pause_score = max(45.0, 90.0 - (pause_duration - 2.5) * 15.0) # Hesitant / long silences

        # 4. Volume score (Ideal: 60 - 85)
        volume_score = min(95.0, max(50.0, volume))

        score = (
            pace_score * 0.35 +
            filler_score * 0.25 +
            pause_score * 0.20 +
            volume_score * 0.20
        )
        return round(min(100.0, max(0.0, score)), 1)

    def compute_communication_score(self, visual: Dict[str, Any], speech: Dict[str, Any], language: Dict[str, Any]) -> float:
        clarity = language.get("clarity", 75.0)
        eye_contact = visual.get("eye_contact", 75.0)
        posture = visual.get("posture_score", 80.0)
        
        # Filler penalty factor
        filler_count = speech.get("filler_count", 0)
        filler_factor = max(40.0, 95.0 - filler_count * 5.0)

        # Pace factor
        wpm = speech.get("speaking_speed", 140.0)
        pace_factor = 95.0 if 125 <= wpm <= 165 else 75.0

        score = (
            clarity * 0.30 +
            eye_contact * 0.25 +
            pace_factor * 0.20 +
            filler_factor * 0.15 +
            posture * 0.10
        )
        return round(min(100.0, max(0.0, score)), 1)

    def compute_technical_score(self, language: Dict[str, Any]) -> float:
        tech_depth = language.get("technical_depth", 75.0)
        relevance = language.get("relevance", 75.0)
        structure = language.get("structure", 75.0)

        score = tech_depth * 0.50 + relevance * 0.30 + structure * 0.20
        return round(min(100.0, max(0.0, score)), 1)

    def fuse_signals(
        self,
        visual: Dict[str, Any],
        speech: Dict[str, Any],
        language: Dict[str, Any],
        interview_type: str = "technical"
    ) -> Dict[str, Any]:
        """
        Combines visual, speech, and language signals into final balanced scores and recommendations.
        """
        body_language_score = self.compute_body_language_score(visual)
        speech_score = self.compute_speech_score(speech)
        communication_score = self.compute_communication_score(visual, speech, language)
        technical_score = self.compute_technical_score(language) if interview_type == "technical" else None

        answer_quality_score = float(language.get("overall_answer_score", 75.0))

        # Overall Multimodal Fusion calculation
        if interview_type == "technical":
            overall_score = (
                answer_quality_score * 0.40 +
                technical_score * 0.20 +
                communication_score * 0.20 +
                body_language_score * 0.10 +
                speech_score * 0.10
            )
        else:
            # HR / Behavioral interview
            overall_score = (
                answer_quality_score * 0.40 +
                communication_score * 0.30 +
                body_language_score * 0.15 +
                speech_score * 0.15
            )

        overall_score = round(min(100.0, max(0.0, overall_score)), 1)

        # Contextual recommendation synthesis
        recommendation = self.synthesize_recommendation(visual, speech, language, interview_type)

        return {
            "overall_score": overall_score,
            "communication_score": communication_score,
            "body_language_score": body_language_score,
            "speech_score": speech_score,
            "answer_quality_score": answer_quality_score,
            "technical_score": technical_score,
            "recommendation": recommendation,
        }

    def synthesize_recommendation(
        self,
        visual: Dict[str, Any],
        speech: Dict[str, Any],
        language: Dict[str, Any],
        interview_type: str
    ) -> Dict[str, Any]:
        """
        Synthesizes multimodal cross-signal contextual advice.
        Examples:
        - Strong technical content + fast pace + low eye contact
        - Good eye contact + high filler word count
        - Slow/hesitant speech + good structure
        """
        eye_contact = visual.get("eye_contact", 75.0)
        head_orientation = visual.get("head_orientation", "Mostly centered")
        posture = visual.get("posture_score", 80.0)

        wpm = speech.get("speaking_speed", 140.0)
        fillers = speech.get("filler_count", 0)
        pauses = speech.get("pause_duration", 1.8)

        tech_depth = language.get("technical_depth", 75.0)
        relevance = language.get("relevance", 75.0)
        clarity = language.get("clarity", 75.0)

        coaching_points = []
        priority = "medium"

        # Cross-signal synthesis rules
        if tech_depth >= 80 and wpm > 165 and eye_contact < 70:
            advice = "Your technical explanation is strong, but slowing down slightly and maintaining more consistent eye contact would make your delivery significantly more confident and engaging."
            priority = "high"
        elif eye_contact < 65 and head_orientation != "Mostly centered":
            advice = f"You are frequently {head_orientation.lower()}. Try keeping your camera at eye level and centering your gaze directly towards the lens when delivering key points."
            priority = "high"
        elif fillers >= 5:
            advice = f"You used {fillers} filler words during this answer. When gathering your thoughts, embrace brief silent pauses instead of verbal placeholders like 'um' or 'like'."
            priority = "high"
        elif wpm < 115 and pauses > 2.8:
            advice = "Your pacing felt slightly hesitant. Practice structuring your initial response with the STAR framework so you can transition between ideas with momentum."
            priority = "medium"
        elif posture < 70:
            advice = "Your posture is slightly slouched or off-center. Sitting upright with shoulders relaxed enhances both vocal projection and visual presence."
            priority = "medium"
        elif relevance >= 80 and clarity >= 80 and eye_contact >= 75:
            advice = "Outstanding synthesis! You demonstrated strong topical command, steady eye contact, and clean vocal delivery. Keep maintaining this level of executive presence."
            priority = "low"
        else:
            advice = "Solid foundation. To take this answer to the next level, crisply state your conclusion upfront and maintain steady pacing throughout the explanation."
            priority = "medium"

        return {
            "text": advice,
            "category": "multimodal_fusion",
            "priority": priority
        }

    def generate_live_coaching_tip(
        self,
        visual: Dict[str, Any],
        speech: Dict[str, Any]
    ) -> Optional[str]:
        """
        Generates immediate, short coaching tips for Practice Mode during active answering.
        """
        eye_contact = visual.get("eye_contact", 75.0)
        head_orient = visual.get("head_orientation", "Mostly centered")
        wpm = speech.get("speaking_speed", 140.0)
        fillers = speech.get("filler_count", 0)

        if eye_contact < 55:
            return "Tip: Re-center your gaze toward the camera lens."
        if wpm > 170:
            return "Tip: Try slowing your speaking pace slightly."
        if wpm < 100 and wpm > 10:
            return "Tip: Pick up momentum and keep your explanation moving forward."
        if fillers >= 4:
            return "Tip: Breathe and take a silent pause instead of using filler words."
        if head_orient == "Looking down":
            return "Tip: Lift your chin to maintain strong presence."
        return None

fusion_engine = MultimodalFusionEngine()
