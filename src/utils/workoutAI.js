/**
 * workoutAI.js — Workout Generation Engine
 * ─────────────────────────────────────────────
 * Simulates AI-powered workout generation with a
 * local exercise database. Swap `generateWorkoutFromAI`
 * for a real Claude/OpenAI API call in production.
 *
 * Muscle groups supported:
 *   chest-triceps | back-biceps | legs | shoulders | fullbody | core
 *   OR any custom string (falls back to fullbody)
 */

// ─── Exercise Database ───────────────────────────────────────
const EXERCISE_DATABASE = {
  'chest-triceps': [
    {
      id: 'ct-001',
      name: 'Barbell Bench Press',
      sets: 4, reps: '6-8', weight: '185-225 lbs',
      difficulty: 'advanced', restSeconds: 120,
      formTips: [
        'Retract and depress scapulae before unracking.',
        'Touch bar 1" above nipple line; explosive concentric.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=barbell+bench+press+form',
    },
    {
      id: 'ct-002',
      name: 'Incline Dumbbell Press',
      sets: 3, reps: '10-12', weight: '65-80 lbs',
      difficulty: 'intermediate', restSeconds: 90,
      formTips: [
        'Set bench 30-45° — not higher or upper chest loses tension.',
        'Bring DBs down at 45° angle to protect shoulder joint.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=incline+dumbbell+press',
    },
    {
      id: 'ct-003',
      name: 'Cable Chest Fly',
      sets: 3, reps: '12-15', weight: '30-40 lbs/side',
      difficulty: 'beginner', restSeconds: 60,
      formTips: [
        'Slight bend in elbow — do NOT straighten arms.',
        'Squeeze pecs hard at midline for 1 second.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=cable+chest+fly',
    },
    {
      id: 'ct-004',
      name: 'Triceps Rope Pushdown',
      sets: 3, reps: '12-15', weight: '50-70 lbs',
      difficulty: 'beginner', restSeconds: 60,
      formTips: [
        'Elbows pinned to ribcage throughout.',
        'Flare rope apart at full extension for lateral head activation.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=rope+triceps+pushdown',
    },
    {
      id: 'ct-005',
      name: 'Close-Grip Bench Press',
      sets: 3, reps: '8-10', weight: '135-155 lbs',
      difficulty: 'intermediate', restSeconds: 90,
      formTips: [
        'Hands shoulder-width — not narrower (wrist strain).',
        'Tuck elbows to 30° to maximize triceps recruitment.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=close+grip+bench+press',
    },
  ],

  'back-biceps': [
    {
      id: 'bb-001',
      name: 'Barbell Deadlift',
      sets: 4, reps: '5', weight: '225-315 lbs',
      difficulty: 'advanced', restSeconds: 180,
      formTips: [
        'Bar over mid-foot, shoulder-width grip, hinge from hips.',
        'Drive floor away — do not pull the bar up.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=deadlift+form',
    },
    {
      id: 'bb-002',
      name: 'Weighted Pull-Ups',
      sets: 4, reps: '6-8', weight: 'BW +25-45 lbs',
      difficulty: 'advanced', restSeconds: 120,
      formTips: [
        'Dead-hang start each rep for full lat stretch.',
        'Chin clears bar; avoid kipping momentum.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=weighted+pull+ups',
    },
    {
      id: 'bb-003',
      name: 'Seated Cable Row',
      sets: 3, reps: '10-12', weight: '120-150 lbs',
      difficulty: 'intermediate', restSeconds: 90,
      formTips: [
        'Sit tall — do not round lower back when reaching forward.',
        'Drive elbows past torso; squeeze rhomboids hard.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=seated+cable+row',
    },
    {
      id: 'bb-004',
      name: 'Barbell Curl',
      sets: 3, reps: '10-12', weight: '65-85 lbs',
      difficulty: 'intermediate', restSeconds: 60,
      formTips: [
        'No swinging — strict curl with elbows at sides.',
        'Supinate wrists fully at top for peak bicep contraction.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=barbell+curl+form',
    },
  ],

  'legs': [
    {
      id: 'lg-001',
      name: 'Barbell Back Squat',
      sets: 5, reps: '5', weight: '185-275 lbs',
      difficulty: 'advanced', restSeconds: 180,
      formTips: [
        'Break parallel — femur below knee crease.',
        'Drive knees out over toes; valsalva on descent.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=barbell+squat+form',
    },
    {
      id: 'lg-002',
      name: 'Romanian Deadlift',
      sets: 4, reps: '8-10', weight: '155-185 lbs',
      difficulty: 'intermediate', restSeconds: 120,
      formTips: [
        'Hinge hips backward until max hamstring stretch (not lower back).',
        'Keep bar close to legs throughout the entire ROM.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=romanian+deadlift+form',
    },
    {
      id: 'lg-003',
      name: 'Bulgarian Split Squat',
      sets: 3, reps: '10/leg', weight: '50-70 lbs DBs',
      difficulty: 'intermediate', restSeconds: 90,
      formTips: [
        'Rear foot elevated on bench — not too high.',
        '15° forward torso lean to shift load to glutes.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=bulgarian+split+squat',
    },
    {
      id: 'lg-004',
      name: 'Leg Press',
      sets: 3, reps: '12-15', weight: '360-450 lbs',
      difficulty: 'beginner', restSeconds: 90,
      formTips: [
        'High foot placement for glute/hamstring bias.',
        'Never lock knees at top; controlled eccentric.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=leg+press+form',
    },
    {
      id: 'lg-005',
      name: 'Standing Calf Raise',
      sets: 4, reps: '15-20', weight: '180-220 lbs',
      difficulty: 'beginner', restSeconds: 45,
      formTips: [
        'Full ROM: deep dorsiflexion stretch at bottom, plantar flex to tiptoe.',
        '2-second pause in stretch eliminates achilles reflex.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=standing+calf+raise',
    },
  ],

  'shoulders': [
    {
      id: 'sh-001',
      name: 'Standing Barbell Overhead Press',
      sets: 4, reps: '6-8', weight: '95-135 lbs',
      difficulty: 'advanced', restSeconds: 120,
      formTips: [
        'Tight glutes and core — do not lean back excessively.',
        'Bar path: slightly back behind head at lockout.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=barbell+overhead+press',
    },
    {
      id: 'sh-002',
      name: 'Dumbbell Lateral Raise',
      sets: 4, reps: '15-20', weight: '20-30 lbs',
      difficulty: 'beginner', restSeconds: 45,
      formTips: [
        'Lead with elbows, not hands — external rotation bias.',
        'Stop at shoulder height; going higher is trap recruitment.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=dumbbell+lateral+raise+form',
    },
    {
      id: 'sh-003',
      name: 'Face Pull',
      sets: 3, reps: '15-20', weight: '40-60 lbs',
      difficulty: 'beginner', restSeconds: 45,
      formTips: [
        'Pull rope to face height, not neck.',
        'External rotate at end — elbows flare behind the plane.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=face+pull+exercise',
    },
    {
      id: 'sh-004',
      name: 'Arnold Press',
      sets: 3, reps: '10-12', weight: '45-55 lbs',
      difficulty: 'intermediate', restSeconds: 90,
      formTips: [
        'Rotate palms smoothly from supinated to pronated on press.',
        'Full ROM — bring DBs down to chin level at bottom.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=arnold+press+form',
    },
  ],

  'fullbody': [
    {
      id: 'fb-001',
      name: 'Barbell Squat',
      sets: 3, reps: '8-10', weight: '135-185 lbs',
      difficulty: 'intermediate', restSeconds: 120,
      formTips: ['Drive knees over toes.', 'Break parallel on every rep.'],
      videoUrl: 'https://youtube.com/results?search_query=barbell+squat',
    },
    {
      id: 'fb-002',
      name: 'Bench Press',
      sets: 3, reps: '8-10', weight: '135-185 lbs',
      difficulty: 'intermediate', restSeconds: 120,
      formTips: ['Retract shoulder blades.', 'Full ROM — touch chest.'],
      videoUrl: 'https://youtube.com/results?search_query=bench+press',
    },
    {
      id: 'fb-003',
      name: 'Bent-Over Barbell Row',
      sets: 3, reps: '8-10', weight: '115-155 lbs',
      difficulty: 'intermediate', restSeconds: 120,
      formTips: ['Torso 45° — not vertical.', 'Drive elbows past torso.'],
      videoUrl: 'https://youtube.com/results?search_query=barbell+row',
    },
    {
      id: 'fb-004',
      name: 'Romanian Deadlift',
      sets: 3, reps: '10-12', weight: '115-155 lbs',
      difficulty: 'intermediate', restSeconds: 90,
      formTips: ['Max hamstring stretch at bottom.', 'Bar stays close to legs.'],
      videoUrl: 'https://youtube.com/results?search_query=romanian+deadlift',
    },
    {
      id: 'fb-005',
      name: 'Overhead Press',
      sets: 3, reps: '8-10', weight: '75-105 lbs',
      difficulty: 'intermediate', restSeconds: 90,
      formTips: ['Brace core hard.', 'Full lockout at top.'],
      videoUrl: 'https://youtube.com/results?search_query=overhead+press',
    },
  ],

  'core': [
    {
      id: 'cr-001',
      name: 'Hanging Leg Raise',
      sets: 4, reps: '12-15', weight: 'Bodyweight',
      difficulty: 'intermediate', restSeconds: 60,
      formTips: [
        'Curl pelvis upward at top — do not just raise legs.',
        'Control descent; no swinging momentum.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=hanging+leg+raise',
    },
    {
      id: 'cr-002',
      name: 'Ab Wheel Rollout',
      sets: 3, reps: '10-12', weight: 'Bodyweight',
      difficulty: 'advanced', restSeconds: 75,
      formTips: [
        'Keep hips in line with torso — do not sag.',
        'Pull back using abs, not hip flexors.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=ab+wheel+rollout',
    },
    {
      id: 'cr-003',
      name: 'Cable Crunch',
      sets: 3, reps: '15-20', weight: '50-70 lbs',
      difficulty: 'beginner', restSeconds: 45,
      formTips: [
        'Kneel and crunch down — elbows to knees.',
        'Do not pull neck; initiate from upper abs.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=cable+crunch',
    },
    {
      id: 'cr-004',
      name: 'Plank with Shoulder Tap',
      sets: 3, reps: '20 taps', weight: 'Bodyweight',
      difficulty: 'beginner', restSeconds: 45,
      formTips: [
        'Feet wide for stability base.',
        'Minimize hip rotation on each tap.',
      ],
      videoUrl: 'https://youtube.com/results?search_query=plank+shoulder+tap',
    },
  ],
}

// ─── Supported Muscle Groups (for UI selectors) ──────────────
export const MUSCLE_GROUPS = [
  { id: 'chest-triceps', label: 'Chest & Triceps',  icon: '💪' },
  { id: 'back-biceps',   label: 'Back & Biceps',    icon: '🏋️' },
  { id: 'legs',          label: 'Legs & Glutes',    icon: '🦵' },
  { id: 'shoulders',     label: 'Shoulders',        icon: '⬆️' },
  { id: 'fullbody',      label: 'Full Body',        icon: '🌟' },
  { id: 'core',          label: 'Core & Abs',       icon: '⭕' },
]

/**
 * generateWorkoutFromAI(muscleGroup)
 * ─────────────────────────────────────
 * Returns a promise resolving to an array of exercise objects.
 * In production, replace the local lookup with an API call:
 *
 * const response = await fetch('/api/generate-workout', {
 *   method: 'POST',
 *   body: JSON.stringify({ muscleGroup }),
 * })
 * return response.json()
 *
 * @param {string} muscleGroup - e.g. 'chest-triceps' | 'legs' | custom
 * @returns {Promise<Exercise[]>}
 */
export async function generateWorkoutFromAI(muscleGroup = 'fullbody') {
  // Simulate network delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600))

  const normalised = muscleGroup.toLowerCase().trim()

  // Direct match
  if (EXERCISE_DATABASE[normalised]) {
    return EXERCISE_DATABASE[normalised].map(ex => ({ ...ex, timestamp: new Date().toISOString() }))
  }

  // Fuzzy match on partial keys (e.g. "chest" → chest-triceps)
  const fuzzyKey = Object.keys(EXERCISE_DATABASE).find(k =>
    k.includes(normalised) || normalised.includes(k.split('-')[0])
  )

  if (fuzzyKey) {
    return EXERCISE_DATABASE[fuzzyKey].map(ex => ({ ...ex, timestamp: new Date().toISOString() }))
  }

  // Fallback: full body
  return EXERCISE_DATABASE.fullbody.map(ex => ({ ...ex, timestamp: new Date().toISOString() }))
}

/**
 * formatRestTime(seconds)
 * Returns "1m 30s", "2m", "45s" etc.
 */
export function formatRestTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

/**
 * getDifficultyColor(difficulty)
 * Returns the CSS custom property string for the Elite palette.
 */
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'beginner':     return 'var(--success)'
    case 'intermediate': return 'var(--accent-cyan)'
    case 'advanced':     return 'var(--accent-purple)'
    case 'elite':        return 'var(--danger)'
    default:             return 'var(--text-secondary)'
  }
}
