"""
backend/ml_vision.py: Food Recognition & Nutrition Engine
─────────────────────────────────────────────────────────
Pipeline
    1. OpenCV   : validate, decode, normalise (resize + re-encode) and quality-check the upload.
    2. Classify : Hugging Face Inference API (primary) -> optional local `transformers`
                  pipeline (fallback). Top-K predictions are parsed and sorted defensively.
    3. Nutrition: predicted label -> per-100 g macros (curated Food-101 table, then optional
                  USDA FoodData Central lookup for labels outside the table) -> scaled to portion.

Design principles
    * No fabricated results. Confidence is the model's real softmax score. If nothing is
      recognised, `FoodNotRecognizedError` is raised instead of returning a made-up dish.
    * Calories are derived from macros (Atwater 4/4/9) so the numbers shown in the UI are
      always internally consistent.
    * Blocking work (OpenCV, local model) runs in worker threads; the event loop stays free.

Environment variables
    HUGGINGFACE_API_TOKEN / HF_TOKEN   HF access token
    HF_MODEL_ID                        default "nateraw/food" (Food-101, 101 classes)
    HF_API_URL                         override the inference endpoint (defaults to HF router)
    HF_TIMEOUT_S, HF_MAX_RETRIES       network tuning (defaults 20 s, 3 attempts)
    ENABLE_LOCAL_MODEL                 "1" -> use local transformers model if the API fails
    USDA_API_KEY                       enables USDA FoodData Central lookups for unknown labels
    FOOD_MIN_CONFIDENCE                minimum top-1 score to accept a prediction (default 0.20)
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
import threading
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import cv2
import httpx
import numpy as np

from schemas import FoodItemSchema, FoodScanResponse, ImageMetadataSchema, MacrosSchema

logger = logging.getLogger("fitpulse-ml.vision")

# ─── Configuration ────────────────────────────────────────────────────────────

HF_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN") or os.getenv("HF_TOKEN") or ""
HF_MODEL_ID = os.getenv("HF_MODEL_ID", "nateraw/food")
HF_API_URL = os.getenv(
    "HF_API_URL", f"https://router.huggingface.co/hf-inference/models/{HF_MODEL_ID}"
)
HF_TIMEOUT_S = float(os.getenv("HF_TIMEOUT_S", "20"))
HF_MAX_RETRIES = max(1, int(os.getenv("HF_MAX_RETRIES", "3")))
ENABLE_LOCAL_MODEL = os.getenv("ENABLE_LOCAL_MODEL", "0").lower() in {"1", "true", "yes"}

USDA_API_KEY = os.getenv("USDA_API_KEY", "")
USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

MIN_CONFIDENCE = float(os.getenv("FOOD_MIN_CONFIDENCE", "0.20"))
TOP_K = 5                       # predictions kept from the model
CANDIDATES_TO_TRY = 3           # how many top predictions we try to map to nutrition data
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
MAX_PIXELS = 50_000_000
MIN_SIDE_PX = 64
MODEL_INPUT_MAX_SIDE = 512      # longest side sent to the model (speed + payload size)
DEFAULT_SERVING_G = 150.0       # used for USDA-sourced foods with no curated serving size
BLUR_WARN_THRESHOLD = 30.0      # Laplacian variance below this is likely out of focus


# ─── Exceptions (map these to HTTP codes in your router) ─────────────────────

class FoodNotRecognizedError(ValueError):
    """Image is valid but no food could be identified with sufficient confidence (-> 422)."""


class VisionServiceUnavailableError(RuntimeError):
    """No classifier backend could be reached (-> 503)."""


# ─── Nutrition knowledge base (per 100 g) ─────────────────────────────────────

@dataclass(frozen=True)
class NutritionProfile:
    """Macronutrients per 100 g of prepared food, plus a typical serving size."""

    name: str
    protein: float
    carbs: float
    fat: float
    serving_g: float
    category: str

    @property
    def kcal_per_100g(self) -> float:
        """Energy via Atwater factors (4 kcal/g protein & carbs, 9 kcal/g fat)."""
        return 4.0 * self.protein + 4.0 * self.carbs + 9.0 * self.fat

    def scaled(self, grams: float) -> Tuple[int, float, float, float]:
        """Return (kcal, protein_g, carbs_g, fat_g) for the given portion weight."""
        k = grams / 100.0
        return (
            int(round(self.kcal_per_100g * k)),
            round(self.protein * k, 1),
            round(self.carbs * k, 1),
            round(self.fat * k, 1),
        )


_CATEGORIES = {
    "dessert": "Dessert / Treat",
    "meat": "High-Protein / Meat",
    "seafood": "Seafood / Lean Protein",
    "salad": "Salad / Light",
    "soup": "Soup / Hydrating",
    "carb": "Carb-Forward / Energy",
    "breakfast": "Breakfast",
    "handheld": "Sandwich / Handheld",
    "snack": "Appetizer / Snack",
    "mixed": "Balanced Plate",
}

# label: (protein g, carbs g, fat g, typical serving g, category)  -- values per 100 g.
# Typical restaurant/home-prepared values derived from USDA-style reference data; they are
# estimates for a *typical* preparation, not lab measurements of the photographed plate.
_FOOD101_RAW: Dict[str, Tuple[float, float, float, float, str]] = {
    "apple_pie": (1.9, 34, 11, 125, "dessert"),
    "baby_back_ribs": (21, 4, 21, 220, "meat"),
    "baklava": (6, 45, 25, 60, "dessert"),
    "beef_carpaccio": (20, 1, 7, 100, "meat"),
    "beef_tartare": (19, 2, 13, 120, "meat"),
    "beet_salad": (2, 9, 4.5, 180, "salad"),
    "beignets": (6, 42, 16, 90, "dessert"),
    "bibimbap": (6, 19, 3.5, 400, "mixed"),
    "bread_pudding": (6, 30, 7, 150, "dessert"),
    "breakfast_burrito": (10, 22, 10, 200, "breakfast"),
    "bruschetta": (5, 25, 8, 100, "snack"),
    "caesar_salad": (5, 8, 11, 250, "salad"),
    "cannoli": (7, 35, 17, 80, "dessert"),
    "caprese_salad": (9, 3, 13, 150, "salad"),
    "carrot_cake": (4, 50, 20, 110, "dessert"),
    "ceviche": (15, 4, 1.5, 200, "seafood"),
    "cheese_plate": (22, 3, 31, 100, "snack"),
    "cheesecake": (5.5, 26, 23, 125, "dessert"),
    "chicken_curry": (12, 6, 8.5, 300, "mixed"),
    "chicken_quesadilla": (15, 24, 13, 200, "handheld"),
    "chicken_wings": (24, 3, 20, 150, "meat"),
    "chocolate_cake": (4.5, 53, 16, 100, "dessert"),
    "chocolate_mousse": (4, 24, 13, 120, "dessert"),
    "churros": (5, 46, 24, 80, "dessert"),
    "clam_chowder": (4.5, 9, 4, 250, "soup"),
    "club_sandwich": (14, 20, 11, 250, "handheld"),
    "crab_cakes": (14, 10, 11, 120, "seafood"),
    "creme_brulee": (4, 22, 18, 140, "dessert"),
    "croque_madame": (14, 18, 15, 220, "handheld"),
    "cup_cakes": (3.5, 55, 17, 80, "dessert"),
    "deviled_eggs": (10, 1.5, 16, 80, "snack"),
    "donuts": (5, 48, 23, 70, "dessert"),
    "dumplings": (8, 24, 6, 150, "mixed"),
    "edamame": (11, 10, 5, 100, "snack"),
    "eggs_benedict": (11, 13, 15, 220, "breakfast"),
    "escargots": (15, 3, 13, 100, "snack"),
    "falafel": (13, 32, 18, 100, "snack"),
    "filet_mignon": (27, 0, 14, 180, "meat"),
    "fish_and_chips": (11, 22, 12, 350, "mixed"),
    "foie_gras": (11, 5, 44, 60, "snack"),
    "french_fries": (3.4, 41, 15, 120, "snack"),
    "french_onion_soup": (4, 8, 4.5, 300, "soup"),
    "french_toast": (8, 26, 10, 130, "breakfast"),
    "fried_calamari": (13, 14, 12, 150, "seafood"),
    "fried_rice": (5, 24, 5, 250, "carb"),
    "frozen_yogurt": (3, 23, 3, 120, "dessert"),
    "garlic_bread": (8, 45, 15, 60, "snack"),
    "gnocchi": (4, 26, 3, 250, "carb"),
    "greek_salad": (3, 5, 8, 250, "salad"),
    "grilled_cheese_sandwich": (14, 29, 21, 130, "handheld"),
    "grilled_salmon": (22, 0, 13, 170, "seafood"),
    "guacamole": (2, 8.5, 13.5, 100, "snack"),
    "gyoza": (9, 23, 9, 120, "mixed"),
    "hamburger": (14, 26, 11, 200, "handheld"),
    "hot_and_sour_soup": (3.5, 5, 1.5, 300, "soup"),
    "hot_dog": (10, 22, 14, 120, "handheld"),
    "huevos_rancheros": (8, 12, 8, 280, "breakfast"),
    "hummus": (7.9, 14.3, 9.6, 100, "snack"),
    "ice_cream": (3.5, 24, 11, 100, "dessert"),
    "lasagna": (9, 13, 8, 300, "carb"),
    "lobster_bisque": (4, 7, 6.5, 250, "soup"),
    "lobster_roll_sandwich": (14, 20, 13, 200, "handheld"),
    "macaroni_and_cheese": (8, 20, 8, 250, "carb"),
    "macarons": (6, 60, 15, 50, "dessert"),
    "miso_soup": (2.7, 4.7, 1.3, 250, "soup"),
    "mussels": (24, 7.4, 4.5, 150, "seafood"),
    "nachos": (9, 27, 17, 200, "snack"),
    "omelette": (10.5, 1, 12, 130, "breakfast"),
    "onion_rings": (5, 40, 25, 100, "snack"),
    "oysters": (8, 4, 2.5, 100, "seafood"),
    "pad_thai": (7, 21, 5.5, 300, "carb"),
    "paella": (9, 19, 5, 300, "mixed"),
    "pancakes": (6.4, 28, 10, 150, "breakfast"),
    "panna_cotta": (3.5, 22, 15, 130, "dessert"),
    "peking_duck": (19, 6, 22, 150, "meat"),
    "pho": (4.5, 7, 1.5, 500, "soup"),
    "pizza": (11, 33, 10, 200, "handheld"),
    "pork_chop": (25, 0, 14, 170, "meat"),
    "poutine": (7, 22, 11, 350, "snack"),
    "prime_rib": (22, 0, 22, 200, "meat"),
    "pulled_pork_sandwich": (14, 23, 9, 220, "handheld"),
    "ramen": (5, 11, 2.5, 500, "soup"),
    "ravioli": (7, 24, 6, 250, "carb"),
    "red_velvet_cake": (4, 50, 16, 110, "dessert"),
    "risotto": (4, 22, 5, 250, "carb"),
    "samosa": (4, 25, 17, 100, "snack"),
    "sashimi": (22, 0, 5, 100, "seafood"),
    "scallops": (21, 4, 3.5, 120, "seafood"),
    "seaweed_salad": (2, 14, 5, 100, "salad"),
    "shrimp_and_grits": (9, 15, 6, 300, "mixed"),
    "spaghetti_bolognese": (7.5, 17, 5, 350, "carb"),
    "spaghetti_carbonara": (8, 20, 10, 300, "carb"),
    "spring_rolls": (6, 24, 9, 100, "snack"),
    "steak": (27, 0, 12, 220, "meat"),
    "strawberry_shortcake": (3, 36, 10, 150, "dessert"),
    "sushi": (6, 25, 2, 200, "seafood"),
    "tacos": (10, 19, 11, 150, "handheld"),
    "takoyaki": (7, 24, 7, 120, "snack"),
    "tiramisu": (5, 30, 16, 120, "dessert"),
    "tuna_tartare": (21, 3, 5, 100, "seafood"),
    "waffles": (8, 33, 14, 120, "breakfast"),
}


def _display_name(label: str) -> str:
    return label.replace("_", " ").title()


NUTRITION_DB: Dict[str, NutritionProfile] = {
    label: NutritionProfile(
        name=_display_name(label),
        protein=p,
        carbs=c,
        fat=f,
        serving_g=float(serving),
        category=_CATEGORIES[cat],
    )
    for label, (p, c, f, serving, cat) in _FOOD101_RAW.items()
}


# ─── Shared HTTP client ───────────────────────────────────────────────────────

_http_client: Optional[httpx.AsyncClient] = None


def _get_http_client() -> httpx.AsyncClient:
    """Lazily create one pooled client (connection reuse under load)."""
    global _http_client
    if _http_client is None or _http_client.is_closed:
        _http_client = httpx.AsyncClient(timeout=HF_TIMEOUT_S)
    return _http_client


async def close_http_client() -> None:
    """Call from FastAPI's shutdown/lifespan handler."""
    global _http_client
    if _http_client is not None and not _http_client.is_closed:
        await _http_client.aclose()
    _http_client = None


# ─── OpenCV: decode, validate, normalise ──────────────────────────────────────

def decode_image_bytes(image_bytes: bytes) -> np.ndarray:
    """Decode raw bytes to a BGR array. Raises ValueError for empty/oversized/corrupt input."""
    if not image_bytes:
        raise ValueError("Empty image byte buffer received.")
    if len(image_bytes) > MAX_UPLOAD_BYTES:
        raise ValueError(f"Image exceeds the {MAX_UPLOAD_BYTES // (1024 * 1024)} MB upload limit.")

    image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    if image is None or image.size == 0:
        raise ValueError("Failed to decode image. Unsupported or corrupted format.")

    h, w = image.shape[:2]
    if min(h, w) < MIN_SIDE_PX:
        raise ValueError(f"Image too small ({w}x{h}); minimum side is {MIN_SIDE_PX}px.")
    if h * w > MAX_PIXELS:
        raise ValueError("Image resolution is too large to process safely.")
    return image


def _resize_for_model(image: np.ndarray) -> np.ndarray:
    h, w = image.shape[:2]
    longest = max(h, w)
    if longest <= MODEL_INPUT_MAX_SIDE:
        return image
    scale = MODEL_INPUT_MAX_SIDE / longest
    return cv2.resize(image, (int(round(w * scale)), int(round(h * scale))), interpolation=cv2.INTER_AREA)


def extract_visual_features(image: np.ndarray, original_shape: Tuple[int, int, int]) -> ImageMetadataSchema:
    """
    Build image metadata and log quality warnings.

    Original dimensions are reported; sharpness (variance of the Laplacian) is measured on the
    normalised image so scores are comparable across upload resolutions.
    """
    height, width, channels = original_shape
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    brightness = float(gray.mean()) / 255.0

    if sharpness < BLUR_WARN_THRESHOLD:
        logger.info("Low sharpness (%.1f): photo may be blurry; accuracy can suffer.", sharpness)
    if brightness < 0.15 or brightness > 0.92:
        logger.info("Extreme brightness (%.2f): photo may be under/over-exposed.", brightness)

    return ImageMetadataSchema(
        width=int(width), height=int(height), channels=int(channels),
        sharpness_score=round(sharpness, 2),
    )


def preprocess_image(image_bytes: bytes) -> Tuple[np.ndarray, bytes, ImageMetadataSchema]:
    """Decode -> resize -> quality metadata -> JPEG bytes ready for the classifier (CPU-bound)."""
    original = decode_image_bytes(image_bytes)
    resized = _resize_for_model(original)
    metadata = extract_visual_features(resized, original.shape)
    ok, buf = cv2.imencode(".jpg", resized, [cv2.IMWRITE_JPEG_QUALITY, 90])
    if not ok:
        raise ValueError("Failed to re-encode image for inference.")
    return resized, buf.tobytes(), metadata


# ─── Classification backends ──────────────────────────────────────────────────

def normalize_label(raw: str) -> str:
    """'Apple Pie' / 'apple-pie' / 'hot dog, hotdog' -> 'apple_pie' / 'apple_pie' / 'hot_dog'."""
    first = raw.split(",")[0].strip().lower()
    return re.sub(r"[^a-z0-9]+", "_", first).strip("_")


def _parse_predictions(payload: Any) -> List[Tuple[str, float]]:
    """
    Parse HF image-classification output into [(label, score)] sorted best-first.

    Accepts `[{"label","score"}, ...]`, the batched `[[...]]` form, and ignores error dicts or
    malformed rows. Rows without a valid score are dropped (never defaulted to a fake value).
    """
    if isinstance(payload, list) and payload and isinstance(payload[0], list):
        payload = payload[0]
    if not isinstance(payload, list):
        return []

    parsed: List[Tuple[str, float]] = []
    for item in payload:
        if not isinstance(item, dict):
            continue
        label = normalize_label(str(item.get("label", "")))
        try:
            score = float(item["score"])
        except (KeyError, TypeError, ValueError):
            continue
        if label and 0.0 <= score <= 1.0:
            parsed.append((label, score))

    parsed.sort(key=lambda x: x[1], reverse=True)
    return parsed[:TOP_K]


def _retry_delay(response: Optional[httpx.Response], attempt: int) -> float:
    """Back-off; honours HF's `estimated_time` when a model is cold-starting (capped at 10 s)."""
    delay = 1.5 * attempt
    if response is not None and response.status_code == 503:
        try:
            delay = max(delay, float(response.json().get("estimated_time", 0)))
        except (ValueError, TypeError, AttributeError):
            pass
    return min(delay, 10.0)


async def _query_hf_api(jpeg_bytes: bytes) -> List[Tuple[str, float]]:
    """Call the HF Inference API with retries. Raises VisionServiceUnavailableError on failure."""
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "image/jpeg",
        "Accept": "application/json",
    }
    client = _get_http_client()
    last_error = "unknown error"

    for attempt in range(1, HF_MAX_RETRIES + 1):
        response: Optional[httpx.Response] = None
        try:
            response = await client.post(HF_API_URL, headers=headers, content=jpeg_bytes)
        except (httpx.TimeoutException, httpx.TransportError) as exc:
            last_error = f"network error: {exc!r}"
        else:
            status = response.status_code
            if status == 200:
                try:
                    predictions = _parse_predictions(response.json())
                except ValueError:
                    predictions = []
                if predictions:
                    logger.info("HF top-1: %s (%.3f)", *predictions[0])
                    return predictions
                raise VisionServiceUnavailableError("HF API returned an unparseable payload.")
            if status in (401, 403):
                raise VisionServiceUnavailableError(f"HF API rejected credentials (HTTP {status}).")
            if status == 404:
                raise VisionServiceUnavailableError(
                    f"Model '{HF_MODEL_ID}' not available at {HF_API_URL} (HTTP 404)."
                )
            if status in (408, 429, 500, 502, 503, 504):
                last_error = f"HTTP {status}: {response.text[:150]}"
            else:
                raise VisionServiceUnavailableError(f"HF API error HTTP {status}: {response.text[:150]}")

        if attempt < HF_MAX_RETRIES:
            delay = _retry_delay(response, attempt)
            logger.warning("HF attempt %d/%d failed (%s); retrying in %.1fs", attempt, HF_MAX_RETRIES, last_error, delay)
            await asyncio.sleep(delay)

    raise VisionServiceUnavailableError(f"HF API failed after {HF_MAX_RETRIES} attempts: {last_error}")


_local_pipeline: Any = None
_local_lock = threading.Lock()


def _run_local_model(image_bgr: np.ndarray) -> List[Tuple[str, float]]:
    """Optional offline classifier (requires `transformers`, `torch`, `Pillow`)."""
    global _local_pipeline
    from PIL import Image  # imported lazily: optional dependency
    from transformers import pipeline

    with _local_lock:
        if _local_pipeline is None:
            logger.info("Loading local model '%s' (first request only)...", HF_MODEL_ID)
            _local_pipeline = pipeline("image-classification", model=HF_MODEL_ID)
        classifier = _local_pipeline

    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    return _parse_predictions(classifier(Image.fromarray(rgb), top_k=TOP_K))


async def get_predictions(image_bgr: np.ndarray, jpeg_bytes: bytes) -> Tuple[List[Tuple[str, float]], str]:
    """Return (predictions, provider), trying the HF API first and the local model second."""
    failures: List[str] = []

    if HF_TOKEN:
        try:
            return await _query_hf_api(jpeg_bytes), "huggingface"
        except VisionServiceUnavailableError as exc:
            logger.warning("HF API unavailable: %s", exc)
            failures.append(str(exc))
    else:
        failures.append("HF token not configured")

    if ENABLE_LOCAL_MODEL:
        try:
            predictions = await asyncio.to_thread(_run_local_model, image_bgr)
            if predictions:
                return predictions, "local_transformers"
            failures.append("local model returned no predictions")
        except Exception as exc:  # ImportError, OOM, download failure, ...
            logger.exception("Local model failed")
            failures.append(f"local model error: {exc!r}")

    raise VisionServiceUnavailableError("No vision backend available. " + " | ".join(failures))


# ─── Nutrition lookup ─────────────────────────────────────────────────────────

_USDA_NUTRIENT_IDS = {"protein": 1003, "fat": 1004, "carbs": 1005}
_usda_cache: Dict[str, Optional[NutritionProfile]] = {}


async def lookup_usda(label: str) -> Optional[NutritionProfile]:
    """
    Per-100 g macros from USDA FoodData Central (Foundation / SR Legacy datasets) for labels
    that are not in the curated table. Returns None if disabled, unavailable, or no match.
    """
    if not USDA_API_KEY:
        return None
    if label in _usda_cache:
        return _usda_cache[label]

    query = label.replace("_", " ")
    try:
        response = await _get_http_client().get(
            USDA_SEARCH_URL,
            params={"api_key": USDA_API_KEY, "query": query, "dataType": "Foundation,SR Legacy", "pageSize": 3},
        )
        response.raise_for_status()
        foods = response.json().get("foods", [])
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("USDA lookup failed for '%s': %s", query, type(exc).__name__)
        return None  # transient failure: do not cache

    profile: Optional[NutritionProfile] = None
    for food in foods:
        values = {n.get("nutrientId"): n.get("value") for n in food.get("foodNutrients", [])}
        protein, fat = values.get(_USDA_NUTRIENT_IDS["protein"]), values.get(_USDA_NUTRIENT_IDS["fat"])
        if protein is None or fat is None:
            continue
        profile = NutritionProfile(
            name=_display_name(label),
            protein=float(protein),
            carbs=float(values.get(_USDA_NUTRIENT_IDS["carbs"]) or 0.0),  # absent for many meats/fish
            fat=float(fat),
            serving_g=DEFAULT_SERVING_G,
            category="Whole Food / General",
        )
        break

    _usda_cache[label] = profile
    return profile


async def resolve_nutrition(label: str) -> Tuple[Optional[NutritionProfile], str]:
    """Curated table first, USDA second. Returns (profile, source) with source in {'table','usda',''}."""
    profile = NUTRITION_DB.get(label)
    if profile:
        return profile, "table"
    profile = await lookup_usda(label)
    return (profile, "usda") if profile else (None, "")


# ─── Master classification function ───────────────────────────────────────────

async def classify_food_image(image_bytes: bytes, portion_grams: Optional[float] = None) -> FoodScanResponse:
    """
    Identify the food in an image and return calibrated macros.

    Args:
        image_bytes:   Raw upload (JPEG/PNG/WebP...).
        portion_grams: Optional user-confirmed portion weight. Portion size cannot be measured
                       reliably from a single photo, so when omitted a typical serving is used and
                       flagged with "~" in the response. Let users adjust it in the UI.

    Raises:
        ValueError                   Corrupt/oversized/too-small image, or invalid portion.
        FoodNotRecognizedError       (ValueError subclass) Nothing recognised with enough confidence.
        VisionServiceUnavailableError No classifier backend reachable.
    """
    if portion_grams is not None and not (10.0 <= portion_grams <= 3000.0):
        raise ValueError("portion_grams must be between 10 and 3000.")

    image, jpeg_bytes, metadata = await asyncio.to_thread(preprocess_image, image_bytes)
    predictions, provider = await get_predictions(image, jpeg_bytes)

    if predictions[0][1] < MIN_CONFIDENCE:
        raise FoodNotRecognizedError(
            f"Could not identify the food confidently (best guess '{predictions[0][0]}' at "
            f"{predictions[0][1]:.0%}). Try a clearer, closer, well-lit photo."
        )

    chosen: Optional[Tuple[str, float, NutritionProfile, str]] = None
    for label, score in predictions[:CANDIDATES_TO_TRY]:
        if score < MIN_CONFIDENCE:
            break
        profile, source = await resolve_nutrition(label)
        if profile:
            chosen = (label, score, profile, source)
            break
        logger.info("No nutrition data for predicted label '%s'; trying next candidate.", label)

    if chosen is None:
        raise FoodNotRecognizedError(
            f"Recognised '{predictions[0][0]}' but no nutrition data is available for it."
        )

    label, score, profile, source = chosen
    grams = portion_grams if portion_grams is not None else profile.serving_g
    kcal, protein, carbs, fat = profile.scaled(grams)
    portion_text = f"{grams:g}g" if portion_grams is not None else f"~{grams:g}g (typical serving)"

    alternatives = [f"{_display_name(l)} ({s:.0%})" for l, s in predictions if l != label and s >= 0.05][:2]
    description = (
        f"{profile.name}: about {round(profile.kcal_per_100g)} kcal per 100 g "
        f"(P {profile.protein:g} g / C {profile.carbs:g} g / F {profile.fat:g} g)."
    )
    if alternatives:
        description += " Other possibilities: " + ", ".join(alternatives) + "."

    macros = MacrosSchema(calories=kcal, protein=protein, carbs=carbs, fat=fat)
    food_items = [FoodItemSchema(name=profile.name, calories=kcal, portion=portion_text)]

    return FoodScanResponse(
        success=True,
        name=profile.name,
        food_name=profile.name,
        confidence=round(score, 3),
        portion=portion_text,
        category=profile.category,
        description=description,
        totalCalories=kcal,
        total_calories=kcal,
        macros=macros,
        foodItems=food_items,
        food_items=food_items,
        imageMetadata=metadata,
        model_provider=provider if source == "table" else f"{provider}+usda",
    )
