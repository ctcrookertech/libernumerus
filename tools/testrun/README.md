# testrun — E2E Test Runner Specification

End-to-end browser test suite for the Liber Numerus web app, built in Go using the [drivecdp](https://microsoft.ghe.com/ccrook/drivecdp) Chrome DevTools Protocol framework.

## Architecture

```
tools/testrun/
  main.go      — CLI entry point, browser lifecycle, test orchestration
  server.go    — Vite dev server launcher and readiness polling
  tests.go     — 10 test case implementations + DOM interaction helpers
  go.mod       — Go module with drivecdp dependency (local replace)
```

## Dependencies

### drivecdp

The sole external dependency. Referenced via Go module replace directive:

```
require microsoft.ghe.com/ccrook/drivecdp v0.0.0-00010101000000-000000000000
replace  microsoft.ghe.com/ccrook/drivecdp => /windows/_/drivecdp
```

**Packages used:**

| Import | Purpose |
|--------|---------|
| `microsoft.ghe.com/ccrook/drivecdp/browser` | `Browser`, `BrowserContext`, `Page` — high-level browser automation API |
| `microsoft.ghe.com/ccrook/drivecdp/process` | `Discover()` — auto-detect Chrome/Edge/Chromium binary on the system |

**Key drivecdp APIs exercised:**

- **`process.Discover()`** — Finds a Chrome-family browser binary by checking environment variables (`CHROME_PATH`, `CHROME_BIN`), platform-specific install paths, and `$PATH` fallback.

- **`browser.DefaultBrowserOptions()`** — Returns sensible defaults: `Headless: true`, `Timeout: 30s`. Testrun overrides `Headless` based on the `-visible` flag and sets a longer `Timeout` for the full suite.

- **`browser.New(ctx, opts)`** — Launches a new isolated browser process. The browser runs in a temporary user data directory (no profile reuse between runs), ensuring test isolation. Connects to the browser via WebSocket and enables CDP domains (`Page`, `Runtime`, `DOM`, `Network`).

- **`b.NewContext()`** — Creates an incognito browser context with its own cookie jar and storage. Each test run gets a fresh context, preventing state leakage.

- **`bc.NewPage()`** — Opens a blank tab within the context. All 10 tests share this single page, navigating between test URLs sequentially.

- **`page.Navigate(ctx, url)`** — Navigates to a URL and waits for the `load` lifecycle event. The test runner follows this with `page.WaitForNetworkIdle()` to let the React SPA finish rendering.

- **`page.WaitForNetworkIdle(ctx)`** — Waits for the CDP `networkIdle` lifecycle event (zero in-flight network requests for 500ms). Critical for React apps where initial module loading continues after `DOMContentLoaded`.

- **`page.WaitForSelector(ctx, selector)`** — Waits for a CSS selector to match a DOM element, returning an `Element` handle. Used in `expectText()` and `clickSelector()` helpers.

- **`page.Evaluate(ctx, jsExpression)`** — Evaluates arbitrary JavaScript in the page context and returns the result as a Go value (`string`, `float64`, `bool`, `map`, etc.). Supports `awaitPromise` for async expressions. This is the primary interaction mechanism — React's synthetic event system requires using native property setters to trigger controlled input updates.

- **`element.InnerText(ctx)`** — Reads the visible text content of a DOM element. Used to verify headings, result content, and rune names.

- **`element.Click(ctx)`** — Dispatches a click event on an element. Used via the `clickSelector()` helper.

### Runtime Dependencies

- **Chrome, Edge, or Chromium** — any Chrome-family browser discoverable by `process.Discover()`.
- **Node.js + npm** — required to run the Vite dev server (unless `-url` is provided to test against an external server).

### No Other Dependencies

The tool has zero dependencies beyond drivecdp (which itself only depends on `github.com/coder/websocket`). No test frameworks, assertion libraries, or third-party Go packages are used. Test assertions are plain Go error returns.

## Browser Lifecycle

```
1. process.Discover()         → find Chrome binary
2. browser.New(ctx, opts)     → launch headless browser process
3. b.NewContext()             → create incognito context (isolated storage)
4. bc.NewPage()               → open blank tab
5. [run tests sequentially]   → navigate, interact, assert
6. page.Close()               → close tab
7. bc.Close()                 → destroy context
8. b.Close()                  → kill browser process + cleanup temp dir
```

All resources are cleaned up via deferred `Close()` calls, even on test failure or timeout.

## Dev Server Management

When no `-url` flag is provided, the runner automatically:

1. Launches `npx vite --host 0.0.0.0 --port 5173` with `cmd.Dir` set to `../../app` (the React app directory, relative to `tools/testrun/`).
2. Polls `http://localhost:5173` every 500ms until it returns HTTP 200 (up to 15s timeout).
3. Kills the Vite process on test completion via `cmd.Process.Kill()`.

To skip this and test against an already-running server:

```bash
go run . -url http://localhost:5173
```

## React Input Interaction Pattern

React uses a synthetic event system with controlled components. Setting `input.value` directly does not trigger React's `onChange` handler. The tests use the native property setter pattern:

```javascript
const nativeSet = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype, 'value'
).set;
nativeSet.call(input, 'value');
input.dispatchEvent(new Event('input', { bubbles: true }));
```

This bypasses React's internal value tracking and fires the correct event for React to re-render.

## Test Isolation

- **Browser process**: Fresh launch per run, temporary user data directory.
- **Browser context**: Incognito — no cookies, localStorage, or cache persist between runs.
- **Page reuse**: Tests share one page for speed, but each test navigates to `baseURL` at the start, resetting React app state via a full page load.
- **localStorage**: The app persists state to localStorage. Since each run uses a fresh incognito context, prior state never leaks into tests. The `journal-history` test exploits this: it creates an evaluation, switches tabs, and verifies the entry appears — all within the same session's localStorage.

## Error Reporting

Each test returns a Go `error` on failure. Errors include:
- The specific assertion that failed
- The CSS selector or JS expression that was evaluated
- The actual vs. expected value when applicable

Output format:

```
[1/10] portal-loads ... PASS
[2/10] name-evaluation ... PASS
[3/10] date-evaluation ... FAIL
       no date-based result (Life Path / Birth) appeared

9 passed, 1 failed, 10 total
```

The process exits with code 0 if all tests pass, code 1 if any fail.
