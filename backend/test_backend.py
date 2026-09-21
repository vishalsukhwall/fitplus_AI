"""
test_backend.py — Pytest Suite for FastAPI ML Backend
─────────────────────────────────────────────────────
Verifies:
  - System health check endpoint
  - Image multipart upload & OpenCV inference pipeline
  - Error handling for invalid/empty media formats
"""

import io
import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def create_synthetic_image(color=(34, 139, 34), width=300, height=300) -> bytes:
    """Helper to generate an in-memory encoded JPEG with given BGR color."""
    img = np.zeros((height, width, 3), dtype=np.uint8)
    img[:] = color
    # Add some texture / gradient
    cv2.circle(img, (width // 2, height // 2), 50, (0, 200, 200), -1)
    success, buffer = cv2.imencode(".jpg", img)
    assert success, "Failed to encode synthetic test image"
    return buffer.tobytes()


def test_health_endpoint():
    """Verify /health responds with HTTP 200 and valid JSON."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "FitPulse Vision" in data["service"]


def test_scan_food_with_valid_image():
    """Verify /api/v1/scan-food processes synthetic image and returns macros."""
    # Green-dominant synthetic dish image
    img_bytes = create_synthetic_image(color=(40, 180, 50))
    files = {"file": ("test_salad.jpg", io.BytesIO(img_bytes), "image/jpeg")}

    response = client.post("/api/v1/scan-food", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert "name" in data and len(data["name"]) > 0
    assert data["confidence"] >= 0.90
    assert data["totalCalories"] > 0
    assert "macros" in data
    assert data["macros"]["protein"] > 0
    assert data["macros"]["carbs"] >= 0
    assert data["macros"]["fat"] >= 0
    assert len(data["foodItems"]) > 0
    assert "imageMetadata" in data
    assert data["imageMetadata"]["width"] == 300
    assert data["imageMetadata"]["height"] == 300


def test_scan_food_with_empty_file():
    """Verify /api/v1/scan-food rejects empty file with HTTP 400."""
    files = {"file": ("empty.jpg", io.BytesIO(b""), "image/jpeg")}
    response = client.post("/api/v1/scan-food", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_scan_food_with_invalid_corrupt_data():
    """Verify /api/v1/scan-food handles corrupt image data gracefully."""
    files = {"file": ("corrupted.jpg", io.BytesIO(b"not-a-real-image-payload"), "image/jpeg")}
    response = client.post("/api/v1/scan-food", files=files)
    assert response.status_code == 400
    assert "failed to decode image" in response.json()["detail"].lower()
