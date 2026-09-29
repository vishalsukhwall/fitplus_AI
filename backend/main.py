"""
FitPulse Elite — Full-Stack Python ML Backend
─────────────────────────────────────────────
High-performance asynchronous FastAPI microservice providing:
  - Computer vision food scanning via OpenCV & Color Space Analysis
  - Instant macronutrient & caloric vector calculation
  - Strict CORS middleware for frontend communication
  - Health checks & system telemetry
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from schemas import FoodScanResponse, HealthResponse
from ml_vision import classify_food_image

# ── Logging Configuration ────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("fitpulse-ml")

# ── Allowed Origins for CORS ────────────────────────────────_________________
DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

env_origins = os.getenv("ALLOWED_ORIGINS")
ALLOWED_ORIGINS: List[str] = (
    [origin.strip() for origin in env_origins.split(",") if origin.strip()]
    if env_origins
    else DEFAULT_ALLOWED_ORIGINS
)


# ── Application Lifespan ─────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing FitPulse Elite ML Vision Subsystem...")
    yield
    logger.info("Shutting down FitPulse Elite ML Vision Subsystem.")


# ── FastAPI Application Instance ─────────────────────────────────────────────
app = FastAPI(
    title="FitPulse Elite ML Vision API",
    description="Asynchronous Computer Vision & Nutritional AI Backend for FitPulse Elite SaaS.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Middleware Configuration ───────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        service="FitPulse Vision ML Engine",
    )


@app.post(
    "/api/v1/scan-food",
    response_model=FoodScanResponse,
    status_code=status.HTTP_200_OK,
    tags=["Computer Vision"],
    summary="Scan food image and return recognized meal with macros",
)
async def scan_food(file: UploadFile = File(..., description="Multipart food image file")):
    logger.info(f"Incoming food scan request: filename='{file.filename}', content_type='{file.content_type}'")

    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/octet-stream"]
    if file.content_type and file.content_type.lower() not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported media type '{file.content_type}'. Please upload a JPEG, PNG, or WebP image.",
        )

    try:
        image_bytes = await file.read()
        if not image_bytes or len(image_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty. Please provide a valid image.",
            )

        # Execute OpenCV ML feature extraction & taxonomy classification
        result = classify_food_image(image_bytes)
        logger.info(f"Classification successful: dish='{result.name}', confidence={result.confidence}, calories={result.totalCalories} kcal")
        return result

    except ValueError as val_err:
        logger.warning(f"Image decoding failure: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Unexpected inference failure: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Neural inference pipeline encountered an internal error. Please try again.",
        )
    finally:
        await file.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)