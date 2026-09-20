import { describe, it, expect } from 'vitest'
import {
  parseQuantity,
  findFoodMatch,
  estimateMacros,
  getFoodSuggestions,
  FOOD_DATABASE,
} from '../foodCalculator'

describe('foodCalculator utility', () => {
  describe('parseQuantity', () => {
    it('parses metric gram formats accurately', () => {
      expect(parseQuantity('100g')).toEqual({ amount: 100, unit: 'g', raw: '100g' })
      expect(parseQuantity('250 grams')).toEqual({ amount: 250, unit: 'g', raw: '250 grams' })
      expect(parseQuantity('50 gm')).toEqual({ amount: 50, unit: 'g', raw: '50 gm' })
    })

    it('parses household and volume measures', () => {
      expect(parseQuantity('2 cups')).toEqual({ amount: 2, unit: 'cup', raw: '2 cups' })
      expect(parseQuantity('1.5 scoop')).toEqual({ amount: 1.5, unit: 'scoop', raw: '1.5 scoop' })
      expect(parseQuantity('2 pieces')).toEqual({ amount: 2, unit: 'piece', raw: '2 pieces' })
      expect(parseQuantity('4 whole eggs')).toEqual({ amount: 4, unit: 'egg', raw: '4 whole eggs' })
      expect(parseQuantity('250 ml')).toEqual({ amount: 250, unit: 'ml', raw: '250 ml' })
      expect(parseQuantity('1 tbsp')).toEqual({ amount: 1, unit: 'tbsp', raw: '1 tbsp' })
    })

    it('parses fractions correctly', () => {
      const resHalf = parseQuantity('1/2 cup')
      expect(resHalf.amount).toBe(0.5)
      expect(resHalf.unit).toBe('cup')

      const resOneAndHalf = parseQuantity('1 1/2 cups')
      expect(resOneAndHalf.amount).toBe(1.5)
      expect(resOneAndHalf.unit).toBe('cup')
    })

    it('handles naked numbers with smart unit assignment', () => {
      expect(parseQuantity('150')).toEqual({ amount: 150, unit: 'g', raw: '150' })
      expect(parseQuantity('2')).toEqual({ amount: 2, unit: 'serving', raw: '2' })
    })

    it('handles empty or missing input gracefully', () => {
      expect(parseQuantity('')).toEqual({ amount: 1, unit: 'serving', raw: '1 serving' })
      expect(parseQuantity(null)).toEqual({ amount: 1, unit: 'serving', raw: '1 serving' })
    })
  })

  describe('findFoodMatch', () => {
    it('matches exact food names and aliases', () => {
      const matchOats = findFoodMatch('Oats')
      expect(matchOats).not.toBeNull()
      expect(matchOats.item.id).toBe('oats')

      const matchChicken = findFoodMatch('Chicken Breast')
      expect(matchChicken).not.toBeNull()
      expect(matchChicken.item.id).toBe('chicken-breast')

      const matchPaneer = findFoodMatch('Paneer')
      expect(matchPaneer).not.toBeNull()
      expect(matchPaneer.item.id).toBe('paneer')
    })

    it('matches fuzzy and token combinations', () => {
      const match = findFoodMatch('Grilled Chicken Fillet')
      expect(match).not.toBeNull()
      expect(match.item.id).toBe('chicken-breast')
    })
  })

  describe('estimateMacros', () => {
    it('accurately estimates macros for Oats (100g)', () => {
      const res = estimateMacros('Oats', '100g')
      expect(res).not.toBeNull()
      expect(res.matched).toBe(true)
      expect(res.resolvedName).toBe('Oats / Oatmeal')
      expect(res.calories).toBe(389)
      expect(res.protein).toBeCloseTo(16.9, 1)
      expect(res.carbs).toBeCloseTo(66.3, 1)
      expect(res.fat).toBeCloseTo(6.9, 1)
    })

    it('accurately estimates macros for Chicken Breast (100g)', () => {
      const res = estimateMacros('Chicken Breast', '100g')
      expect(res.matched).toBe(true)
      expect(res.calories).toBe(165)
      expect(res.protein).toBe(31)
      expect(res.carbs).toBe(0)
      expect(res.fat).toBeCloseTo(3.6, 1)
    })

    it('accurately estimates macros for Brown Rice (2 cups)', () => {
      // 1 cup brown rice is 195g -> 2 cups = 390g
      const res = estimateMacros('Brown Rice', '2 cups')
      expect(res.matched).toBe(true)
      expect(res.parsedQuantity.effectiveGrams).toBe(390)
      expect(res.calories).toBe(Math.round(111 * 3.9)) // ~433 kcal
      expect(res.protein).toBeCloseTo(10.1, 1)
      expect(res.carbs).toBeCloseTo(89.7, 1)
    })

    it('accurately estimates macros for Banana (2 pieces)', () => {
      // 1 medium banana ~ 118g -> 2 pieces = 236g
      const res = estimateMacros('Banana', '2 pieces')
      expect(res.matched).toBe(true)
      expect(res.parsedQuantity.effectiveGrams).toBe(236)
      expect(res.calories).toBe(Math.round(89 * 2.36)) // 210 kcal
      expect(res.carbs).toBeCloseTo(53.8, 1)
    })

    it('accurately estimates macros for Paneer (100g)', () => {
      const res = estimateMacros('Paneer', '100g')
      expect(res.matched).toBe(true)
      expect(res.calories).toBe(265)
      expect(res.protein).toBeCloseTo(18.3, 1)
      expect(res.fat).toBeCloseTo(20.8, 1)
    })

    it('accurately estimates Whey Protein for 1.5 scoop', () => {
      // 1 scoop = 32g -> 1.5 scoop = 48g
      const res = estimateMacros('Whey Protein', '1.5 scoop')
      expect(res.matched).toBe(true)
      expect(res.parsedQuantity.effectiveGrams).toBe(48)
      expect(res.protein).toBeCloseTo(39.4, 1)
    })

    it('provides smart algorithmic fallback for custom/unknown foods', () => {
      const customMeat = estimateMacros('Bison Patties', '150g')
      expect(customMeat.matched).toBe(false)
      expect(customMeat.matchType).toBe('algorithmic')
      expect(customMeat.category).toBe('High-Protein')
      expect(customMeat.calories).toBe(Math.round(190 * 1.5)) // 285 kcal
      expect(customMeat.protein).toBe(42) // 28 * 1.5
    })

    it('returns null for empty input', () => {
      expect(estimateMacros('')).toBeNull()
      expect(estimateMacros('   ')).toBeNull()
    })
  })

  describe('getFoodSuggestions', () => {
    it('returns relevant suggestions for prefix query', () => {
      const suggestions = getFoodSuggestions('chi')
      expect(suggestions.length).toBeGreaterThan(0)
      const names = suggestions.map(s => s.name)
      expect(names.some(n => n.includes('Chicken'))).toBe(true)
    })
  })
})
