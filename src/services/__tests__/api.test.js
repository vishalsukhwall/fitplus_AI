import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  API_BASE_URL,
  dataURLtoBlob,
  checkBackendHealth,
  scanFoodImage,
} from '../api'

describe('API Service Layer (src/services/api.js)', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  describe('dataURLtoBlob', () => {
    it('converts a valid jpeg dataURL to a Blob', () => {
      // 1x1 transparent/white png or minimal base64
      const sampleDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      const blob = dataURLtoBlob(sampleDataUrl)

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('image/jpeg')
      expect(blob.size).toBeGreaterThan(0)
    })

    it('throws on invalid or malformed dataURL', () => {
      expect(() => dataURLtoBlob(null)).toThrow(/invalid/i)
      expect(() => dataURLtoBlob('not-a-data-url')).toThrow(/malformed/i)
    })
  })

  describe('checkBackendHealth', () => {
    it('returns server health data on successful 200 response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', version: '1.0.0', service: 'FitPulse Vision ML Engine' }),
      })

      const health = await checkBackendHealth()
      expect(health.status).toBe('ok')
      expect(health.service).toBe('FitPulse Vision ML Engine')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/health'),
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('throws error when health check fails with non-200 status', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      })

      await expect(checkBackendHealth()).rejects.toThrow(/HTTP 503/)
    })
  })

  describe('scanFoodImage', () => {
    it('sends multipart/form-data to /api/v1/scan-food and returns nutrition data', async () => {
      const mockApiResponse = {
        success: true,
        name: 'Grilled Chicken Salad',
        confidence: 0.984,
        totalCalories: 380,
        macros: { protein: 44, carbs: 12, fat: 14 },
        foodItems: [{ name: 'Grilled Herb Chicken Breast', calories: 275, portion: '200g' }],
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      })

      const mockBlob = new Blob(['mock-binary-data'], { type: 'image/jpeg' })
      const result = await scanFoodImage(mockBlob)

      expect(result.name).toBe('Grilled Chicken Salad')
      expect(result.totalCalories).toBe(380)
      expect(result.macros.protein).toBe(44)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/scan-food'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      )
    })

    it('throws descriptive error on server error response with detail', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ detail: 'Corrupted image format' }),
      })

      const mockBlob = new Blob(['fake-data'], { type: 'image/jpeg' })
      await expect(scanFoodImage(mockBlob)).rejects.toThrow(/Corrupted image format/)
    })
  })
})
