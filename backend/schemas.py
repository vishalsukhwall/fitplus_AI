"""
backend/schemas.py — Pydantic Schemas for Request & Response Data Contracts
──────────────────────────────────────────────────────────────────────────
Defines type-safe data structures for nutrition macros, sub-item breakdowns,
image metadata telemetry from OpenCV, and API response payloads.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class MacrosSchema(BaseModel):
    calories: int = Field(..., description="Total energy in kcal")
    protein: float = Field(..., description="Protein content in grams")
    carbs: float = Field(..., description="Carbohydrates in grams")
    fat: float = Field(..., description="Total dietary fats in grams")


class FoodItemSchema(BaseModel):
    name: str = Field(..., description="Component or ingredient name")
    calories: int = Field(..., description="Component calories in kcal")
    portion: str = Field(..., description="Portion size estimate (e.g., '180g', '1 cup')")


class ImageMetadataSchema(BaseModel):
    width: int = Field(..., description="Image width in pixels")
    height: int = Field(..., description="Image height in pixels")
    channels: int = Field(..., description="Color channels count (e.g. 3 for RGB/BGR)")
    sharpness_score: float = Field(..., description="Laplacian variance sharpness metric")


class FoodScanResponse(BaseModel):
    success: bool = Field(default=True, description="Indicates whether vision inference succeeded")
    name: str = Field(..., description="Recognized primary dish name")
    food_name: str = Field(..., description="Alias for recognized dish name")
    confidence: float = Field(..., description="Inference confidence score (0.0 to 1.0)")
    portion: str = Field(..., description="Estimated serving portion")
    category: str = Field(..., description="Nutritional category or diet classification")
    description: str = Field(..., description="Culinary summary of the meal")
    totalCalories: int = Field(..., description="Total calculated calories")
    total_calories: int = Field(..., description="Snake_case alias for total calories")
    macros: MacrosSchema = Field(..., description="Macronutrient breakdown")
    foodItems: List[FoodItemSchema] = Field(default_factory=list, description="Sub-item ingredients breakdown")
    food_items: List[FoodItemSchema] = Field(default_factory=list, description="Snake_case alias for sub-items")
    imageMetadata: Optional[ImageMetadataSchema] = Field(default=None, description="Extracted OpenCV image telemetry")
    model_provider: str = Field(default="hybrid_vision", description="Inference engine: huggingface or opencv_hybrid")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Service health status")
    version: str = Field(default="1.0.0", description="API version")
    service: str = Field(default="FitPulse Vision ML Engine", description="Microservice name")
    huggingface_configured: bool = Field(default=False, description="Whether Hugging Face Inference token is set")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
