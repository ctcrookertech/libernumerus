# testrun

E2E test runner for the Liber Numerus web app. Uses drivecdp to drive a headless Chrome browser through 10 core test scenarios.

## Files

| File | Purpose |
|------|---------|
| `main.go` | CLI entry point. Parses flags, starts the Vite dev server (unless `-url` is given), launches a headless browser via drivecdp, runs the test suite, and reports results. |
| `server.go` | Dev server lifecycle: `startDevServer()` launches `npx vite` in `../../app`, `waitForServer()` polls until HTTP 200, `stopDevServer()` kills the process. |
| `tests.go` | 10 test case functions + helper utilities (`navigateTo`, `expectText`, `evalBool`, `evalFloat`, `evalString`, `clickSelector`, `shortPause`). Each test navigates to the app, interacts with the UI via JavaScript evaluation, and returns an error on failure. |
| `go.mod` | Go module definition. Depends on `microsoft.ghe.com/ccrook/drivecdp` via local replace directive pointing to `/windows/_/drivecdp`. |

## Usage

```bash
cd tools/testrun

# Run all 10 tests (headless, auto-starts Vite dev server)
go run .

# Run with browser visible for debugging
go run . -visible

# Run a single test by name (partial match)
go run . -test portal
go run . -test runes
go run . -test journal

# Test against an already-running server (skips Vite launch)
go run . -url http://localhost:5173

# Custom timeout (default: 90s)
go run . -timeout 120s
```

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `-visible` | `false` | Show the browser window instead of running headless |
| `-test` | `""` | Run only tests matching this name (case-insensitive partial match) |
| `-url` | `""` | Base URL of an already-running server; skips Vite dev server launch |
| `-timeout` | `90s` | Overall timeout for the entire test suite |

## Test Cases

| # | Name | What it verifies |
|---|------|-----------------|
| 1 | `portal-loads` | App renders with "Liber Numerus" heading, 5 tab buttons (Portal/Explore/Insights/Journal/Settings), NAME/DATE/NUMBER input mode buttons, and Evaluate button |
| 2 | `name-evaluation` | Types "Pythagoras" into the name input, verifies real-time letter value indicators appear below each character, clicks Evaluate, verifies result cards render |
| 3 | `date-evaluation` | Switches to DATE mode, sets date to 1990-06-15, clicks Evaluate, verifies a date-based result appears (Life Path, Expression, or Birth) |
| 4 | `number-evaluation` | Switches to NUMBER mode, enters 7, clicks Evaluate, verifies meaningful result content appears |
| 5 | `system-switching` | Opens the system picker modal, verifies "Choose System" heading, selects Hebrew Gematria, verifies the active system indicator updates |
| 6 | `explore-tab` | Clicks the Explore tab, verifies system browser lists multiple traditions (Pythagorean, Hebrew, Chaldean, Tarot, Mayan, Norse), switches to Numbers segment, verifies number index content loads |
| 7 | `divination-runes` | Navigates Explore > Divination > Rune Draw, verifies Elder Futhark UI loads, clicks DRAW, waits 1.2s for animation, verifies a recognized rune name appears (checks all 24 Elder Futhark names) |
| 8 | `journal-history` | Evaluates "TestHistory" on the Portal, switches to the Journal tab, verifies the evaluation entry appears in the history list |
| 9 | `settings-profile` | Switches to Settings tab, verifies Profile section with name input, Basic/Premium mode toggle, and System Presets section all render |
| 10 | `drilldown-modal` | Switches to NUMBER mode, evaluates 22 (a Master Number), clicks a result card, verifies the DrillDown modal opens with expected layer sections (Reduction Path, System Meaning, Mathematical Properties) |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All tests passed |
| `1` | One or more tests failed, or infrastructure error (no browser, server timeout, etc.) |

## Prerequisites

- **Go 1.23+**
- **Chrome, Edge, or Chromium** installed and discoverable
- **Node.js + npm** with dependencies installed in `../../app` (`npm install`)
