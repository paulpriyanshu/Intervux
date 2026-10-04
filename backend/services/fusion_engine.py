# Re-exporting from app.services.fusion_engine for both path conventions
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.services.fusion_engine import MultimodalFusionEngine, fusion_engine

__all__ = ["MultimodalFusionEngine", "fusion_engine"]
