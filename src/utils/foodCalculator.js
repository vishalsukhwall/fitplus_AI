/**
 * foodCalculator.js — Intelligent Food Parsing & Macro Estimation Engine
 * ──────────────────────────────────────────────────────────────────────
 * Provides:
 *   1. FOOD_DATABASE: Curated nutrition lookup for common athlete & everyday foods.
 *   2. parseQuantity: Extracts numeric amount, unit, and calculates effective grams.
 *   3. findFoodMatch: Fuzzy & token matching against database items and aliases.
 *   4. estimateMacros: Estimates calories & macros (Protein, Carbs, Fat) from food name
 *      and quantity string, with intelligent algorithmic fallback for custom foods.
 */

// ─── 1. Curated Food Database (per 100g standard reference) ───────────────────
export const FOOD_DATABASE = [
  // ─── Proteins & Poultry ───
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    aliases: ['chicken', 'chicken breast', 'grilled chicken', 'cooked chicken', 'chicken fillet', 'boiled chicken'],
    category: 'Poultry',
    per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    servingConversions: { piece: 150, breast: 150, serving: 150, cup: 140, oz: 28.35 },
  },
  {
    id: 'chicken-thigh',
    name: 'Chicken Thigh (Skinless)',
    aliases: ['chicken thigh', 'chicken thighs', 'dark meat chicken'],
    category: 'Poultry',
    per100g: { calories: 209, protein: 26, carbs: 0, fat: 10.9 },
    servingConversions: { piece: 110, thigh: 110, serving: 150, oz: 28.35 },
  },
  {
    id: 'turkey-breast',
    name: 'Turkey Breast',
    aliases: ['turkey', 'turkey breast', 'ground turkey', 'sliced turkey'],
    category: 'Poultry',
    per100g: { calories: 135, protein: 30, carbs: 0, fat: 1.0 },
    servingConversions: { slice: 28, piece: 150, serving: 150, oz: 28.35 },
  },
  {
    id: 'whole-egg',
    name: 'Whole Eggs',
    aliases: ['egg', 'eggs', 'whole egg', 'whole eggs', 'boiled egg', 'hard boiled egg', 'fried egg', 'poached egg'],
    category: 'Proteins',
    per100g: { calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
    servingConversions: { egg: 50, piece: 50, serving: 100 }, // 1 large egg ~ 50g
  },
  {
    id: 'egg-whites',
    name: 'Egg Whites',
    aliases: ['egg white', 'egg whites', 'liquid egg whites'],
    category: 'Proteins',
    per100g: { calories: 52, protein: 10.9, carbs: 0.7, fat: 0.2 },
    servingConversions: { egg: 33, piece: 33, white: 33, cup: 240, serving: 100 },
  },
  {
    id: 'salmon',
    name: 'Atlantic Salmon',
    aliases: ['salmon', 'wild salmon', 'salmon fillet', 'grilled salmon', 'baked salmon', 'smoked salmon'],
    category: 'Fish',
    per100g: { calories: 208, protein: 20.4, carbs: 0, fat: 13.4 },
    servingConversions: { fillet: 180, piece: 180, serving: 150, oz: 28.35 },
  },
  {
    id: 'tuna',
    name: 'Canned Tuna (in Water)',
    aliases: ['tuna', 'canned tuna', 'chunk light tuna', 'albacore tuna', 'tuna fish'],
    category: 'Fish',
    per100g: { calories: 116, protein: 25.5, carbs: 0, fat: 0.8 },
    servingConversions: { can: 140, serving: 100, cup: 150 },
  },
  {
    id: 'shrimp',
    name: 'Shrimp / Prawns (Cooked)',
    aliases: ['shrimp', 'prawns', 'grilled shrimp', 'boiled shrimp'],
    category: 'Fish',
    per100g: { calories: 99, protein: 24.0, carbs: 0.2, fat: 0.3 },
    servingConversions: { piece: 12, serving: 120, cup: 145 },
  },
  {
    id: 'lean-ground-beef',
    name: 'Lean Ground Beef (90/10)',
    aliases: ['ground beef', 'minced beef', 'lean beef', 'beef mince', 'mince'],
    category: 'Meat',
    per100g: { calories: 217, protein: 26.1, carbs: 0, fat: 11.8 },
    servingConversions: { patty: 120, serving: 150, oz: 28.35 },
  },
  {
    id: 'steak',
    name: 'Beef Steak (Ribeye / Sirloin)',
    aliases: ['steak', 'ribeye', 'sirloin', 'beef steak', 'flame-grilled ribeye steak', 'beef', 'filet mignon'],
    category: 'Meat',
    per100g: { calories: 242, protein: 27.0, carbs: 0, fat: 15.0 },
    servingConversions: { steak: 220, piece: 220, serving: 200, oz: 28.35 },
  },

  // ─── Indian & Vegetarian Staples ───
  {
    id: 'paneer',
    name: 'Paneer (Indian Cottage Cheese)',
    aliases: ['paneer', 'cottage cheese', 'panir', 'indian cottage cheese'],
    category: 'Dairy',
    per100g: { calories: 265, protein: 18.3, carbs: 3.4, fat: 20.8 },
    servingConversions: { piece: 50, block: 200, serving: 100, cup: 150 },
  },
  {
    id: 'tofu',
    name: 'Firm Tofu',
    aliases: ['tofu', 'firm tofu', 'soy paneer', 'extra firm tofu'],
    category: 'Plant Protein',
    per100g: { calories: 76, protein: 8.1, carbs: 1.9, fat: 4.8 },
    servingConversions: { block: 300, piece: 100, serving: 100, cup: 150 },
  },
  {
    id: 'lentils-dal',
    name: 'Lentils / Dal (Cooked)',
    aliases: ['dal', 'daal', 'lentils', 'yellow dal', 'moong dal', 'masoor dal', 'cooked lentils'],
    category: 'Legumes',
    per100g: { calories: 116, protein: 9.0, carbs: 20.1, fat: 0.4 },
    servingConversions: { cup: 200, bowl: 220, serving: 150 },
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas / Chana (Cooked)',
    aliases: ['chickpeas', 'chana', 'garbanzo', 'garbanzo beans', 'boiled chickpeas'],
    category: 'Legumes',
    per100g: { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6 },
    servingConversions: { cup: 164, bowl: 200, serving: 130 },
  },

  // ─── Grains & Complex Carbohydrates ───
  {
    id: 'oats',
    name: 'Oats / Oatmeal',
    aliases: ['oats', 'oatmeal', 'rolled oats', 'steel cut oats', 'instant oats', 'porridge'],
    category: 'Grains',
    per100g: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
    servingConversions: { cup: 80, bowl: 120, serving: 50, scoop: 40, tbsp: 10 },
  },
  {
    id: 'brown-rice',
    name: 'Brown Rice (Cooked)',
    aliases: ['brown rice', 'cooked brown rice', 'steamed brown rice'],
    category: 'Grains',
    per100g: { calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9 },
    servingConversions: { cup: 195, bowl: 200, serving: 150 },
  },
  {
    id: 'white-rice',
    name: 'White / Jasmine Rice (Cooked)',
    aliases: ['rice', 'white rice', 'jasmine rice', 'basmati rice', 'cooked rice', 'steamed rice'],
    category: 'Grains',
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
    servingConversions: { cup: 185, bowl: 200, serving: 150 },
  },
  {
    id: 'quinoa',
    name: 'Quinoa (Cooked)',
    aliases: ['quinoa', 'cooked quinoa'],
    category: 'Grains',
    per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
    servingConversions: { cup: 185, bowl: 200, serving: 150 },
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato (Baked/Boiled)',
    aliases: ['sweet potato', 'sweet potatoes', 'roasted sweet potato', 'yam'],
    category: 'Vegetables',
    per100g: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },
    servingConversions: { piece: 130, potato: 130, cup: 200, serving: 150 },
  },
  {
    id: 'potato',
    name: 'White Potato (Boiled/Baked)',
    aliases: ['potato', 'potatoes', 'baked potato', 'boiled potato', 'mashed potato'],
    category: 'Vegetables',
    per100g: { calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },
    servingConversions: { piece: 170, potato: 170, cup: 150, serving: 150 },
  },
  {
    id: 'bread',
    name: 'Bread / Sourdough / Whole Wheat',
    aliases: ['bread', 'sourdough', 'whole wheat bread', 'toast', 'artisan sourdough', 'white bread', 'multigrain bread', 'roti', 'chapati'],
    category: 'Grains',
    per100g: { calories: 265, protein: 9.1, carbs: 49.0, fat: 3.2 },
    servingConversions: { slice: 38, piece: 38, serving: 76 },
  },
  {
    id: 'pasta',
    name: 'Pasta (Cooked)',
    aliases: ['pasta', 'spaghetti', 'penne', 'macaroni', 'noodles', 'cooked pasta'],
    category: 'Grains',
    per100g: { calories: 158, protein: 5.8, carbs: 30.9, fat: 0.9 },
    servingConversions: { cup: 140, bowl: 200, serving: 150 },
  },

  // ─── Fruits & Healthy Vegetables ───
  {
    id: 'banana',
    name: 'Banana',
    aliases: ['banana', 'bananas', 'ripe banana'],
    category: 'Fruits',
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
    servingConversions: { piece: 118, banana: 118, serving: 118, cup: 150 },
  },
  {
    id: 'apple',
    name: 'Fresh Apple',
    aliases: ['apple', 'apples', 'green apple', 'red apple'],
    category: 'Fruits',
    per100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
    servingConversions: { piece: 180, apple: 180, serving: 180, cup: 125 },
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    aliases: ['blueberry', 'blueberries', 'berries', 'mixed berries'],
    category: 'Fruits',
    per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
    servingConversions: { cup: 148, handful: 40, serving: 100 },
  },
  {
    id: 'avocado',
    name: 'Avocado',
    aliases: ['avocado', 'avocados', 'guacamole'],
    category: 'Fruits & Fats',
    per100g: { calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7 },
    servingConversions: { piece: 150, half: 75, serving: 100, cup: 150 },
  },
  {
    id: 'broccoli',
    name: 'Broccoli (Steamed/Raw)',
    aliases: ['broccoli', 'steamed broccoli', 'fresh broccoli'],
    category: 'Vegetables',
    per100g: { calories: 35, protein: 2.8, carbs: 7.2, fat: 0.4 },
    servingConversions: { cup: 90, head: 300, serving: 100 },
  },
  {
    id: 'spinach',
    name: 'Baby Spinach',
    aliases: ['spinach', 'baby spinach', 'cooked spinach'],
    category: 'Vegetables',
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    servingConversions: { cup: 30, bowl: 100, serving: 85 },
  },

  // ─── Dairy, Shakes & Supplements ───
  {
    id: 'whey-protein',
    name: 'Whey Protein Isolate',
    aliases: ['whey', 'whey protein', 'whey isolate', 'protein powder', 'protein shake', 'whey protein isolate shake'],
    category: 'Supplements',
    per100g: { calories: 385, protein: 82.0, carbs: 4.0, fat: 3.0 },
    servingConversions: { scoop: 32, serving: 32, tbsp: 12 },
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt (Non-Fat)',
    aliases: ['greek yogurt', 'yogurt', 'curd', 'dahi', 'plain greek yogurt', 'greek yogurt berry parfait'],
    category: 'Dairy',
    per100g: { calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4 },
    servingConversions: { cup: 245, bowl: 200, serving: 170 },
  },
  {
    id: 'cottage-cheese',
    name: 'Cottage Cheese (Low Fat)',
    aliases: ['cottage cheese', 'low fat cottage cheese'],
    category: 'Dairy',
    per100g: { calories: 84, protein: 11.1, carbs: 4.3, fat: 2.3 },
    servingConversions: { cup: 226, bowl: 200, serving: 113 },
  },
  {
    id: 'whole-milk',
    name: 'Whole Milk',
    aliases: ['milk', 'whole milk', 'cow milk'],
    category: 'Dairy',
    per100g: { calories: 62, protein: 3.2, carbs: 4.8, fat: 3.3 },
    servingConversions: { cup: 244, glass: 244, serving: 244, ml: 1.03 },
  },
  {
    id: 'almond-milk',
    name: 'Unsweetened Almond Milk',
    aliases: ['almond milk', 'unsweetened almond milk'],
    category: 'Dairy Alternative',
    per100g: { calories: 15, protein: 0.6, carbs: 0.3, fat: 1.2 },
    servingConversions: { cup: 240, glass: 240, serving: 240, ml: 1.0 },
  },

  // ─── Healthy Fats & Nuts ───
  {
    id: 'peanut-butter',
    name: 'Natural Peanut Butter',
    aliases: ['peanut butter', 'pb', 'natural peanut butter', 'creamy peanut butter'],
    category: 'Nuts & Fats',
    per100g: { calories: 588, protein: 25.0, carbs: 20.0, fat: 50.0 },
    servingConversions: { tbsp: 16, tsp: 5, serving: 32, cup: 250 },
  },
  {
    id: 'almonds',
    name: 'Raw Almonds',
    aliases: ['almond', 'almonds', 'roasted almonds'],
    category: 'Nuts & Fats',
    per100g: { calories: 579, protein: 21.0, carbs: 22.0, fat: 50.0 },
    servingConversions: { handful: 28, serving: 28, oz: 28.35, cup: 140, tbsp: 10 },
  },
  {
    id: 'olive-oil',
    name: 'Extra Virgin Olive Oil',
    aliases: ['olive oil', 'oil', 'extra virgin olive oil', 'cooking oil'],
    category: 'Nuts & Fats',
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100.0 },
    servingConversions: { tbsp: 14, tsp: 4.5, serving: 14 },
  },
]

// ─── 2. Parse Quantity String ────────────────────────────────────────────────
/**
 * Parses user input like "100g", "2 cups", "1.5 scoop", "2 pieces", "1/2 cup", "250 ml", "4 oz"
 * @param {string} str - Raw quantity string
 * @returns {{ amount: number, unit: string, raw: string }}
 */
export function parseQuantity(str) {
  if (!str || typeof str !== 'string' || !str.trim()) {
    return { amount: 1, unit: 'serving', raw: '1 serving' }
  }

  const trimmed = str.trim().toLowerCase()

  // Match fractions like "1/2", "3/4", "1 1/2"
  const fractionMatch = trimmed.match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)\s*(.*)$/)
  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseFloat(fractionMatch[1]) : 0
    const numerator = parseFloat(fractionMatch[2])
    const denominator = parseFloat(fractionMatch[3]) || 1
    const amount = whole + numerator / denominator
    const rawUnit = (fractionMatch[4] || '').trim()
    const unit = normalizeUnit(rawUnit || 'serving')
    return { amount, unit, raw: str.trim() }
  }

  // Standard regex: number (int/float) followed by optional unit
  const match = trimmed.match(/^([\d.,]+)\s*(.*)$/)
  if (match) {
    const cleanNum = match[1].replace(/,/g, '')
    const amount = parseFloat(cleanNum)
    if (!isNaN(amount) && amount > 0) {
      const rawUnit = (match[2] || '').trim()
      let unit = normalizeUnit(rawUnit)

      // If user typed a plain number without unit (e.g. "150"):
      if (!rawUnit) {
        unit = amount >= 20 ? 'g' : 'serving'
      }

      return { amount, unit, raw: str.trim() }
    }
  }

  // If no leading number, check for standalone word unit like "cup", "scoop", "piece"
  const normalized = normalizeUnit(trimmed)
  return { amount: 1, unit: normalized, raw: str.trim() }
}

/**
 * Normalizes different unit variants to canonical keys.
 */
function normalizeUnit(raw) {
  const u = raw.toLowerCase().trim()
  if (!u) return 'serving'

  if (/^(g|gram|grams|gm|gms)$/.test(u)) return 'g'
  if (/^(kg|kgs|kilogram|kilograms)$/.test(u)) return 'kg'
  if (/^(ml|milliliter|milliliters)$/.test(u)) return 'ml'
  if (/^(l|liter|liters)$/.test(u)) return 'l'
  if (/^(oz|ounce|ounces)$/.test(u)) return 'oz'
  if (/^(lb|lbs|pound|pounds)$/.test(u)) return 'lb'
  if (/^(cup|cups)$/.test(u)) return 'cup'
  if (/^(scoop|scoops)$/.test(u)) return 'scoop'
  if (/^(slice|slices)$/.test(u)) return 'slice'
  if (/^(piece|pieces|pc|pcs)$/.test(u)) return 'piece'
  if (/^(egg|eggs|whole egg|whole eggs)$/.test(u)) return 'egg'
  if (/^(white|whites|egg white|egg whites)$/.test(u)) return 'egg'
  if (/^(tbsp|tbsps|tablespoon|tablespoons)$/.test(u)) return 'tbsp'
  if (/^(tsp|tsps|teaspoon|teaspoons)$/.test(u)) return 'tsp'
  if (/^(bowl|bowls)$/.test(u)) return 'bowl'
  if (/^(can|cans)$/.test(u)) return 'can'
  if (/^(fillet|fillets)$/.test(u)) return 'fillet'
  if (/^(patty|patties)$/.test(u)) return 'patty'
  if (/^(thigh|thighs)$/.test(u)) return 'thigh'
  if (/^(serving|servings|portion|portions)$/.test(u)) return 'serving'

  return u
}

// ─── 3. Find Food Match In Database ──────────────────────────────────────────
/**
 * Matches food name against FOOD_DATABASE aliases and names.
 * @param {string} inputName - Name of the food
 * @returns {{ item: object, matchType: string, confidence: number } | null}
 */
export function findFoodMatch(inputName) {
  if (!inputName || typeof inputName !== 'string') return null

  const clean = inputName.trim().toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
  const words = clean.split(/\s+/).filter(Boolean)
  if (words.length === 0) return null

  let bestMatch = null
  let bestScore = 0
  let bestMatchType = 'none'

  for (const item of FOOD_DATABASE) {
    // 1. Exact alias match
    for (const alias of item.aliases) {
      const cleanAlias = alias.toLowerCase().trim()
      if (clean === cleanAlias) {
        return { item, matchType: 'exact', confidence: 0.99 }
      }
      if (clean.includes(cleanAlias)) {
        const score = cleanAlias.length / clean.length + 0.8
        if (score > bestScore) {
          bestScore = score
          bestMatch = item
          bestMatchType = 'exact_substring'
        }
      }
    }

    // 2. Token overlap score
    const itemTokens = [
      ...item.name.toLowerCase().split(/\s+/),
      ...item.aliases.flatMap(a => a.toLowerCase().split(/\s+/))
    ]
    const tokenSet = new Set(itemTokens)

    let matchCount = 0
    for (const w of words) {
      if (tokenSet.has(w)) matchCount++
    }

    if (matchCount > 0) {
      const score = matchCount / Math.max(words.length, 1)
      if (score > bestScore) {
        bestScore = score
        bestMatch = item
        bestMatchType = 'token_match'
      }
    }
  }

  if (bestMatch && bestScore >= 0.4) {
    return {
      item: bestMatch,
      matchType: bestMatchType === 'exact_substring' ? 'database' : 'fuzzy',
      confidence: Math.min(0.95, Math.round(bestScore * 100) / 100),
    }
  }

  return null
}

// ─── 4. Algorithmic Fallback Estimation (Semantic Profiler) ───────────────────
/**
 * Provides smart caloric and macro density estimation for custom/unknown foods.
 */
function getAlgorithmicDensity(foodName) {
  const clean = foodName.toLowerCase()

  // Protein dense (meats, poultry, fish, seafood)
  if (/\b(meat|chicken|beef|steak|pork|turkey|bison|lamb|fish|salmon|tuna|shrimp|prawn|crab|protein|whey|isolate|egg|whites|seafood)\b/.test(clean)) {
    return {
      category: 'High-Protein',
      per100g: { calories: 190, protein: 28.0, carbs: 0.5, fat: 8.0 },
      defaultUnitGrams: { serving: 150, piece: 150, cup: 140, slice: 30, bowl: 200 },
    }
  }

  // Carbohydrate dense (grains, rice, pasta, bread, potatoes)
  if (/\b(rice|bread|pasta|noodle|spaghetti|potato|oat|flour|grain|cereal|corn|bagel|pancake|waffle|quinoa|roti|wrap|tortilla|carb)\b/.test(clean)) {
    return {
      category: 'Carbohydrates',
      per100g: { calories: 150, protein: 4.5, carbs: 30.0, fat: 1.5 },
      defaultUnitGrams: { serving: 150, piece: 40, cup: 180, slice: 40, bowl: 200 },
    }
  }

  // Fat dense (oils, butter, nuts, seeds, cheese)
  if (/\b(oil|butter|ghee|fat|nut|almond|walnut|cashew|peanut|seed|avocado|cheese|mayo|dressing)\b/.test(clean)) {
    return {
      category: 'Healthy Fats',
      per100g: { calories: 550, protein: 10.0, carbs: 12.0, fat: 55.0 },
      defaultUnitGrams: { serving: 30, tbsp: 15, tsp: 5, handful: 30, cup: 140 },
    }
  }

  // Low-cal vegetables & salads
  if (/\b(salad|vegetable|veggie|green|broccoli|spinach|lettuce|cucumber|tomato|cauliflower|carrot|pepper|onion|kale)\b/.test(clean)) {
    return {
      category: 'Vegetables',
      per100g: { calories: 35, protein: 2.2, carbs: 6.0, fat: 0.4 },
      defaultUnitGrams: { serving: 100, cup: 80, bowl: 150, piece: 50 },
    }
  }

  // Fruits
  if (/\b(fruit|apple|banana|berry|berries|orange|mango|melon|grape|peach|pear|pineapple)\b/.test(clean)) {
    return {
      category: 'Fruits',
      per100g: { calories: 65, protein: 0.8, carbs: 16.0, fat: 0.3 },
      defaultUnitGrams: { serving: 120, piece: 120, cup: 140, bowl: 180 },
    }
  }

  // Shakes & Smoothies & Drinks
  if (/\b(shake|smoothie|drink|juice|latte|coffee|tea|milk)\b/.test(clean)) {
    return {
      category: 'Beverage',
      per100g: { calories: 60, protein: 3.0, carbs: 9.0, fat: 1.5 },
      defaultUnitGrams: { serving: 250, cup: 240, glass: 240, ml: 1.0 },
    }
  }

  // Balanced generic food fallback
  return {
    category: 'Custom Entry',
    per100g: { calories: 150, protein: 7.0, carbs: 18.0, fat: 5.0 },
    defaultUnitGrams: { serving: 150, piece: 100, cup: 150, slice: 40, bowl: 220 },
  }
}

// ─── 5. Main Estimation Function ─────────────────────────────────────────────
/**
 * Calculates estimated calories & macros for a food item and quantity.
 * @param {string} foodName - Name of the food (e.g. "Chicken Breast", "Oats")
 * @param {string} quantityStr - Quantity string (e.g. "100g", "2 cups", "1.5 scoop")
 * @returns {object|null} Estimated macro breakdown and metadata
 */
export function estimateMacros(foodName, quantityStr = '') {
  if (!foodName || typeof foodName !== 'string' || !foodName.trim()) {
    return null
  }

  const cleanName = foodName.trim()
  const parsed = parseQuantity(quantityStr)
  const matchResult = findFoodMatch(cleanName)

  let effectiveGrams = 100
  let per100g = { calories: 150, protein: 7, carbs: 18, fat: 5 }
  let category = 'Manual Entry'
  let matchType = 'algorithmic'
  let confidence = 0.70
  let resolvedName = cleanName

  if (matchResult) {
    const { item } = matchResult
    per100g = item.per100g
    category = item.category
    matchType = matchResult.matchType
    confidence = matchResult.confidence
    resolvedName = item.name

    // Calculate effective weight in grams using item's specific conversions
    const unit = parsed.unit
    const amount = parsed.amount

    if (unit === 'g') {
      effectiveGrams = amount
    } else if (unit === 'kg') {
      effectiveGrams = amount * 1000
    } else if (unit === 'ml') {
      effectiveGrams = amount * (item.density || 1.0)
    } else if (unit === 'l') {
      effectiveGrams = amount * 1000
    } else if (unit === 'oz') {
      effectiveGrams = amount * 28.35
    } else if (unit === 'lb') {
      effectiveGrams = amount * 453.6
    } else if (item.servingConversions && item.servingConversions[unit]) {
      effectiveGrams = amount * item.servingConversions[unit]
    } else {
      // Common unit fallbacks
      const commonGrams = {
        cup: 160,
        scoop: 32,
        piece: 100,
        slice: 38,
        egg: 50,
        tbsp: 15,
        tsp: 5,
        bowl: 220,
        can: 140,
        serving: 150,
      }
      effectiveGrams = amount * (commonGrams[unit] || 100)
    }
  } else {
    // Algorithmic Fallback
    const fallback = getAlgorithmicDensity(cleanName)
    per100g = fallback.per100g
    category = fallback.category
    matchType = 'algorithmic'
    confidence = 0.75

    const unit = parsed.unit
    const amount = parsed.amount

    if (unit === 'g') {
      effectiveGrams = amount
    } else if (unit === 'kg') {
      effectiveGrams = amount * 1000
    } else if (unit === 'ml') {
      effectiveGrams = amount
    } else if (unit === 'l') {
      effectiveGrams = amount * 1000
    } else if (unit === 'oz') {
      effectiveGrams = amount * 28.35
    } else if (unit === 'lb') {
      effectiveGrams = amount * 453.6
    } else {
      const unitGram = fallback.defaultUnitGrams[unit] || 100
      effectiveGrams = amount * unitGram
    }
  }

  // Dynamic multiplication by quantity factor
  const factor = effectiveGrams / 100

  const calculatedCalories = Math.round(per100g.calories * factor)
  const calculatedProtein = Math.round(per100g.protein * factor * 10) / 10
  const calculatedCarbs = Math.round(per100g.carbs * factor * 10) / 10
  const calculatedFat = Math.round(per100g.fat * factor * 10) / 10

  return {
    matched: Boolean(matchResult),
    resolvedName,
    rawInputName: cleanName,
    category,
    matchType, // 'exact' | 'database' | 'fuzzy' | 'algorithmic'
    confidence,
    calories: calculatedCalories,
    protein: calculatedProtein,
    carbs: calculatedCarbs,
    fat: calculatedFat,
    parsedQuantity: {
      amount: parsed.amount,
      unit: parsed.unit,
      raw: parsed.raw,
      effectiveGrams: Math.round(effectiveGrams),
    },
    per100g,
  }
}

// ─── 6. Quick Autocomplete Helper ────────────────────────────────────────────
/**
 * Returns matching food suggestions for quick search.
 */
export function getFoodSuggestions(query, limit = 5) {
  if (!query || typeof query !== 'string' || !query.trim()) return []
  const clean = query.trim().toLowerCase()

  const results = []
  for (const item of FOOD_DATABASE) {
    if (
      item.name.toLowerCase().includes(clean) ||
      item.aliases.some(a => a.toLowerCase().includes(clean))
    ) {
      results.push(item)
      if (results.length >= limit) break
    }
  }

  return results
}
