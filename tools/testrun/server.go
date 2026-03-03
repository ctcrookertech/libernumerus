package main

import (
	"context"
	"fmt"
	"net/http"
	"os/exec"
	"time"
)

// startDevServer launches `npx vite` in the app directory.
func startDevServer(ctx context.Context) (*exec.Cmd, error) {
	cmd := exec.CommandContext(ctx, "npx", "vite", "--host", "0.0.0.0", "--port", "5173")
	cmd.Dir = "../../app"

	// Start in background
	if err := cmd.Start(); err != nil {
		return nil, fmt.Errorf("start vite: %w", err)
	}

	return cmd, nil
}

// stopDevServer kills the dev server process.
func stopDevServer(cmd *exec.Cmd) {
	if cmd != nil && cmd.Process != nil {
		cmd.Process.Kill()
		cmd.Wait()
	}
}

// waitForServer polls the base URL until it responds or the timeout expires.
func waitForServer(ctx context.Context, url string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	client := &http.Client{Timeout: 2 * time.Second}

	for time.Now().Before(deadline) {
		if ctx.Err() != nil {
			return ctx.Err()
		}

		resp, err := client.Get(url)
		if err == nil {
			resp.Body.Close()
			if resp.StatusCode == 200 {
				return nil
			}
		}

		time.Sleep(500 * time.Millisecond)
	}

	return fmt.Errorf("server at %s not ready after %v", url, timeout)
}
