# FitPulse Elite — Python ML Computer Vision Microservice

Asynchronous computer vision and macronutrient inference backend built with **FastAPI**, **OpenCV**, and **Pydantic**.

---

## ⚡ Quickstart

### 1. Virtual Environment Setup
```bash
# From the backend/ folder:
python -m venv venv

# Windows (Command Prompt / PowerShell):
.\venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

### 4. Run Automated Test Suite
```bash
pytest test_backend.py -v
```

---

## 📡 API Endpoints

### `GET /health`
Returns system status, service name, and timestamp.
```json
{
  "status": "ok",
  "version": "1.0.0",
  "service": "FitPulse Vision ML Engine",
  "timestamp": "2026-09-21T16:30:00.000000Z"
}
```

### `POST /api/v1/scan-food`
Accepts `multipart/form-data` with key `file` (JPEG, PNG, WebP).
Performs in-memory OpenCV feature extraction (HSV color distribution, texture entropy via Laplacian variance) and returns calculated nutritional metrics.

**Response (200 OK):**
```json
{
  "success": true,
  "name": "Grilled Chicken Salad",
  "food_name": "Grilled Chicken Salad",
  "confidence": 0.984,
  "portion": "320g bowl",
  "category": "High-Protein / Lean Fuel",
  "description": "Flame-grilled chicken breast over crisp romaine, English cucumber, cherry tomatoes, and cold-pressed extra virgin olive vinaigrette.",
  "totalCalories": 380,
  "total_calories": 380,
  "macros": {
    "calories": 380,
    "protein": 44.0,
    "carbs": 12.0,
    "fat": 14.0
  },
  "foodItems": [
    { "name": "Grilled Herb Chicken Breast", "calories": 275, "portion": "200g" },
    { "name": "Romaine, Cucumbers & Cherry Tomatoes", "calories": 45, "portion": "100g" },
    { "name": "Cold-Pressed Olive Vinaigrette", "calories": 60, "portion": "20g" }
  ],
  "imageMetadata": {
    "width": 1280,
    "height": 720,
    "channels": 3,
    "sharpness_score": 142.5
  },
  "timestamp": "2026-09-21T16:30:00.000000Z"
}
```
