# Contributing to FitPulse Elite

Thank you for your interest in contributing! Please follow these guidelines.

## Getting Started

```bash
git clone https://github.com/your-username/fitpulse-elite.git
cd fitpulse-elite
npm install
cp .env.example .env   # fill in your API keys
npm run dev
```

## Branch Naming

Use descriptive branch names prefixed by type:

```
feat/barcode-scanner
fix/camera-denied-fallback
refactor/extract-meal-form
docs/update-architecture
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add barcode scanner to FoodScanner
fix: GENERATE_ERROR now clears isGenerating flag
refactor: extract workoutReducer to /store
docs: add ML inference pipeline to ARCHITECTURE.md
test: add stale-closure rapid-dispatch integration test
```

## Pull Request Checklist

- [ ] `npm test` passes (all 53 tests green)
- [ ] `npm run build` exits code 0
- [ ] New components are wrapped in `<ErrorBoundary>`
- [ ] `.map()` calls have null-guards and `<EmptyState>` fallbacks
- [ ] New CSS variables have hardcoded hex fallbacks
- [ ] Accessible: descriptive `alt` text, `aria-label` on icon-only buttons

## Code Style

- Tailwind utility classes for layout; CSS variables for theming
- State changes via dispatch actions — no direct mutation
- localStorage writes via `useNutrition` — never `localStorage.setItem` in components directly
- Keep `initialState` the single source of truth — never initialize state from a prop

## Reporting Bugs

Open an issue with:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser + OS version

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
