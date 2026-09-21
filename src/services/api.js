/**
 * api.js — FitPulse Elite Microservice API Client
 * ───────────────────────────────────────────────
 * Production API layer interfacing the React frontend with the
 * FastAPI Computer Vision & Nutritional AI backend.
 *
 * Defaults to http://localhost:8000 (configurable via VITE_API_URL).
 */

export const API_BASE_URL = (
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:8000'
).replace(/\/$/, '')

/**
 * Converts a base64 dataURL (e.g., from HTML5 canvas or FileReader)
 * into a binary Blob ready for multipart/form-data upload.
 *
 * @param {string} dataurl - Base64 Data URL string
 * @returns {Blob} Binary image Blob
 */
export function dataURLtoBlob(dataurl) {
  if (!dataurl || typeof dataurl !== 'string') {
    throw new Error('Invalid dataURL provided.')
  }

  const arr = dataurl.split(',')
  if (arr.length < 2) {
    throw new Error('Malformed dataURL string.')
  }

  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

/**
 * Verifies backend health and connectivity.
 *
 * @param {Object} [options]
 * @param {number} [options.timeoutMs=5000]
 * @returns {Promise<{ status: string, version: string, service: string }>}
 */
export async function checkBackendHealth({ timeoutMs = 5000 } = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Health check failed with HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Backend health check timed out after ${timeoutMs}ms.`)
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Sends a captured food image (File, Blob, or Data URL) to the FastAPI
 * ML Computer Vision endpoint for classification and macronutrient calculation.
 *
 * @param {Blob|File|string} imageFileOrDataUrl - Image Blob, File, or base64 DataURL
 * @param {Object} [options]
 * @param {number} [options.timeoutMs=15000] - Request timeout in milliseconds
 * @param {AbortSignal} [options.signal] - Optional external AbortSignal
 * @returns {Promise<Object>} Formatted nutrition & classification result
 */
export async function scanFoodImage(imageFileOrDataUrl, { timeoutMs = 15000, signal } = {}) {
  if (!imageFileOrDataUrl) {
    throw new Error('No image provided for food scan.')
  }

  let blob
  let filename = 'capture.jpg'

  if (typeof imageFileOrDataUrl === 'string') {
    blob = dataURLtoBlob(imageFileOrDataUrl)
  } else if (imageFileOrDataUrl instanceof Blob) {
    blob = imageFileOrDataUrl
    if (imageFileOrDataUrl.name) {
      filename = imageFileOrDataUrl.name
    }
  } else {
    throw new Error('Unsupported image payload type. Expected Blob, File, or base64 DataURL.')
  }

  const formData = new FormData()
  formData.append('file', blob, filename)

  const controller = new AbortController()
  const internalTimeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // Link external signal if provided
  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/scan-food`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })

    if (!response.ok) {
      let errorDetail = response.statusText
      try {
        const errorJson = await response.json()
        if (errorJson && errorJson.detail) {
          errorDetail = typeof errorJson.detail === 'string'
            ? errorJson.detail
            : JSON.stringify(errorJson.detail)
        }
      } catch {
        // Fallback to statusText if response is not JSON
      }
      throw new Error(`Food scan failed (HTTP ${response.status}): ${errorDetail}`)
    }

    const data = await response.json()
    return data
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Food scan request timed out after ${timeoutMs}ms.`)
    }
    throw err
  } finally {
    clearTimeout(internalTimeoutId)
  }
}

export const api = {
  checkBackendHealth,
  scanFoodImage,
  dataURLtoBlob,
  API_BASE_URL,
}

export default api
