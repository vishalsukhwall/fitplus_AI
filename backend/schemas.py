"""
Pydantic schemas for request validation and API responses.
Supports both camelCase and snake_case for seamless frontend consumption.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class MacrosSchema(BaseModel):
    calories: int = Field(..., description="Total energetic value in kcal")
    protein: float = Field(..., description="Protein in grams")
    carbs: float = Field(..., description="Carbohydrates in grams")
    fat: float = Field(..., description="Total dietary fats in grams")


class FoodItemSchema(BaseModel):
    name: str = Field(..., description="Recognized food item component")
    calories: int = Field(..., description="Component calories")
    portion: str = Field(..., description="Portion size (e.g., '150g', '1 cup')")


class ImageMetadataSchema(BaseModel):
    width: int = Field(..., description="Image width in pixels")
    height: int = Field(..., description="Image height in pixels")
    channels: int = Field(..., description="Number of color channels")
    sharpness_score: float = Field(..., description="Laplacian variance sharpness metric")


class FoodScanResponse(BaseModel):
    success: bool = Field(default=True, description="Indicates whether vision inference succeeded")
    name: str = Field(..., description="Recognized primary food dish name")
    food_name: str = Field(..., description="Alias for recognized food dish name")
    confidence: float = Field(..., description="Inference confidence score (0.0 to 1.0)")
    portion: str = Field(..., description="Standard estimated portion")
    category: str = Field(..., description="Nutritional category or diet classification")
    description: str = Field(..., description="Brief culinary summary of the dish")
    totalCalories: int = Field(..., description="Total calculated calories")
    total_calories: int = Field(..., description="Snake_case alias for total calories")
    macros: MacrosSchema = Field(..., description="Macronutrient breakdown")
    foodItems: List[FoodItemSchema] = Field(default_factory=list, description="Sub-item ingredients breakdown")
    food_items: List[FoodItemSchema] = Field(default_factory=list, description="Snake_case alias for sub-items")
    imageMetadata: Optional[ImageMetadataSchema] = Field(default=None, description="Extracted OpenCV image telemetry")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Service health status")
    version: str = Field(default="1.0.0", description="API version")
    service: str = Field(default="FitPulse Vision ML Engine", description="Microservice name")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
