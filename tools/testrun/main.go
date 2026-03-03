// testrun — E2E test runner for the Libernumerus web app.
//
// Launches a headless browser, starts the Vite dev server, and runs
// 10 core test cases covering navigation, input, evaluation, system
// switching, divination, drill-down, journal, insights, settings,
// and cross-system Premium evaluation.
//
// Usage:
//
//	go run .                      # run all tests (headless)
//	go run . -visible             # run with browser visible
//	go run . -test portal         # run a single test by name
//	go run . -url http://...      # test against an already-running server
package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"

	"microsoft.ghe.com/ccrook/drivecdp/browser"
	"microsoft.ghe.com/ccrook/drivecdp/process"
)

func main() {
	var (
		visible  bool
		testName string
		baseURL  string
		timeout  time.Duration
	)
	flag.BoolVar(&visible, "visible", false, "show browser window")
	flag.StringVar(&testName, "test", "", "run a single test by name")
	flag.StringVar(&baseURL, "url", "", "test against an already-running server (skip dev server launch)")
	flag.DurationVar(&timeout, "timeout", 90*time.Second, "overall timeout")
	flag.Parse()

	os.Exit(run(visible, testName, baseURL, timeout))
}

func run(visible bool, testName, baseURL string, timeout time.Duration) int {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	// Start dev server if no URL provided
	var devServer *exec.Cmd
	if baseURL == "" {
		baseURL = "http://localhost:5173"
		var err error
		devServer, err = startDevServer(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "FAIL: could not start dev server: %v\n", err)
			return 1
		}
		defer stopDevServer(devServer)

		// Wait for server to be ready
		if err := waitForServer(ctx, baseURL, 15*time.Second); err != nil {
			fmt.Fprintf(os.Stderr, "FAIL: dev server not ready: %v\n", err)
			return 1
		}
	}

	// Discover and launch browser
	binaryPath, err := process.Discover(process.DiscoverOptions{})
	if err != nil {
		fmt.Fprintf(os.Stderr, "FAIL: no browser found: %v\n", err)
		return 1
	}

	opts := browser.DefaultBrowserOptions()
	opts.Binary = binaryPath
	opts.Headless = !visible
	opts.Timeout = timeout

	b, err := browser.New(ctx, opts)
	if err != nil {
		fmt.Fprintf(os.Stderr, "FAIL: browser launch: %v\n", err)
		return 1
	}
	defer b.Close()

	bc, err := b.NewContext()
	if err != nil {
		fmt.Fprintf(os.Stderr, "FAIL: browser context: %v\n", err)
		return 1
	}
	defer bc.Close()

	page, err := bc.NewPage()
	if err != nil {
		fmt.Fprintf(os.Stderr, "FAIL: page creation: %v\n", err)
		return 1
	}
	defer page.Close()

	// Build test suite
	suite := buildSuite(baseURL)

	// Filter if requested
	if testName != "" {
		var filtered []testCase
		for _, tc := range suite {
			if strings.EqualFold(tc.name, testName) || strings.Contains(strings.ToLower(tc.name), strings.ToLower(testName)) {
				filtered = append(filtered, tc)
			}
		}
		if len(filtered) == 0 {
			fmt.Fprintf(os.Stderr, "FAIL: no test matching %q\n", testName)
			fmt.Fprintf(os.Stderr, "Available tests:\n")
			for _, tc := range suite {
				fmt.Fprintf(os.Stderr, "  - %s\n", tc.name)
			}
			return 1
		}
		suite = filtered
	}

	// Run tests
	fmt.Printf("Running %d E2E test(s) against %s\n\n", len(suite), baseURL)

	passed, failed := 0, 0
	for i, tc := range suite {
		fmt.Printf("[%d/%d] %s ... ", i+1, len(suite), tc.name)

		testCtx, testCancel := context.WithTimeout(ctx, 20*time.Second)
		err := tc.fn(testCtx, page, baseURL)
		testCancel()

		if err != nil {
			fmt.Printf("FAIL\n       %v\n", err)
			failed++
		} else {
			fmt.Printf("PASS\n")
			passed++
		}
	}

	fmt.Printf("\n%d passed, %d failed, %d total\n", passed, failed, len(suite))
	if failed > 0 {
		return 1
	}
	return 0
}

// testCase represents a single E2E test.
type testCase struct {
	name string
	fn   func(ctx context.Context, page *browser.Page, baseURL string) error
}

// buildSuite returns the 10 core E2E test cases.
func buildSuite(baseURL string) []testCase {
	return []testCase{
		{"portal-loads", testPortalLoads},
		{"name-evaluation", testNameEvaluation},
		{"date-evaluation", testDateEvaluation},
		{"number-evaluation", testNumberEvaluation},
		{"system-switching", testSystemSwitching},
		{"explore-tab", testExploreTab},
		{"divination-runes", testDivinationRunes},
		{"journal-history", testJournalHistory},
		{"settings-profile", testSettingsProfile},
		{"drilldown-modal", testDrilldownModal},
	}
}
