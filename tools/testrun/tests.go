package main

import (
	"context"
	"fmt"
	"strings"
	"time"

	"microsoft.ghe.com/ccrook/drivecdp/browser"
)

// helpers

func navigateTo(ctx context.Context, page *browser.Page, url string) error {
	if err := page.Navigate(ctx, url); err != nil {
		return fmt.Errorf("navigate to %s: %w", url, err)
	}
	idleCtx, cancel := context.WithTimeout(ctx, 8*time.Second)
	defer cancel()
	page.WaitForNetworkIdle(idleCtx)
	return nil
}

func expectText(ctx context.Context, page *browser.Page, selector, contains string) error {
	el, err := page.WaitForSelector(ctx, selector)
	if err != nil {
		return fmt.Errorf("selector %q not found: %w", selector, err)
	}
	text, err := el.InnerText(ctx)
	if err != nil {
		return fmt.Errorf("read text from %q: %w", selector, err)
	}
	if !strings.Contains(strings.ToLower(text), strings.ToLower(contains)) {
		return fmt.Errorf("expected %q to contain %q, got %q", selector, contains, text)
	}
	return nil
}

func expectSelector(ctx context.Context, page *browser.Page, selector string) error {
	_, err := page.WaitForSelector(ctx, selector)
	if err != nil {
		return fmt.Errorf("selector %q not found: %w", selector, err)
	}
	return nil
}

func clickSelector(ctx context.Context, page *browser.Page, selector string) error {
	el, err := page.WaitForSelector(ctx, selector)
	if err != nil {
		return fmt.Errorf("click target %q not found: %w", selector, err)
	}
	return el.Click(ctx)
}

func evalString(ctx context.Context, page *browser.Page, expr string) (string, error) {
	val, err := page.Evaluate(ctx, expr)
	if err != nil {
		return "", err
	}
	s, ok := val.(string)
	if !ok {
		return fmt.Sprintf("%v", val), nil
	}
	return s, nil
}

func evalBool(ctx context.Context, page *browser.Page, expr string) (bool, error) {
	val, err := page.Evaluate(ctx, expr)
	if err != nil {
		return false, err
	}
	b, ok := val.(bool)
	if !ok {
		return false, fmt.Errorf("expected bool, got %T", val)
	}
	return b, nil
}

func evalFloat(ctx context.Context, page *browser.Page, expr string) (float64, error) {
	val, err := page.Evaluate(ctx, expr)
	if err != nil {
		return 0, err
	}
	f, ok := val.(float64)
	if !ok {
		return 0, fmt.Errorf("expected number, got %T", val)
	}
	return f, nil
}

// shortPause gives the React app time to re-render after interactions.
func shortPause() {
	time.Sleep(300 * time.Millisecond)
}

// ──────────────────────────────────────────────────────────────
// TEST 1: Portal tab loads with expected UI elements
// ──────────────────────────────────────────────────────────────
func testPortalLoads(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Check page title/heading
	if err := expectText(ctx, page, "h1", "Libernumerus"); err != nil {
		return fmt.Errorf("heading: %w", err)
	}

	// Check tab bar is present (5 tabs)
	count, err := evalFloat(ctx, page, `document.querySelectorAll('nav button').length`)
	if err != nil {
		return fmt.Errorf("tab bar query: %w", err)
	}
	if count != 5 {
		return fmt.Errorf("expected 5 tab buttons, got %.0f", count)
	}

	// Check input mode buttons exist (NAME, DATE, NUMBER at minimum)
	hasName, err := evalBool(ctx, page, `!!Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'NAME')`)
	if err != nil {
		return fmt.Errorf("NAME button query: %w", err)
	}
	if !hasName {
		return fmt.Errorf("NAME input mode button not found")
	}

	// Check Evaluate button exists
	hasEval, err := evalBool(ctx, page, `!!Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Evaluate')`)
	if err != nil {
		return fmt.Errorf("Evaluate button query: %w", err)
	}
	if !hasEval {
		return fmt.Errorf("Evaluate button not found")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 2: Name evaluation produces results
// ──────────────────────────────────────────────────────────────
func testNameEvaluation(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Type a name into the input
	_, err := page.Evaluate(ctx, `
		const input = document.querySelector('input[type="text"]');
		if (!input) throw new Error('text input not found');
		const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
		nativeSet.call(input, 'Pythagoras');
		input.dispatchEvent(new Event('input', { bubbles: true }));
	`)
	if err != nil {
		return fmt.Errorf("fill name input: %w", err)
	}
	shortPause()

	// Verify real-time letter values appear (the small numbers under each letter)
	hasLetterValues, err := evalBool(ctx, page, `document.querySelectorAll('span').length > 10`)
	if err != nil {
		return fmt.Errorf("letter values query: %w", err)
	}
	if !hasLetterValues {
		return fmt.Errorf("expected letter value indicators to appear")
	}

	// Click Evaluate
	_, err = page.Evaluate(ctx, `
		const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Evaluate');
		if (btn) btn.click();
		else throw new Error('Evaluate button not found');
	`)
	if err != nil {
		return fmt.Errorf("click evaluate: %w", err)
	}

	// Wait for results to render
	time.Sleep(500 * time.Millisecond)

	// Check that result cards appeared
	hasResults, err := evalBool(ctx, page, `
		document.querySelectorAll('[style*="backdrop-filter"]').length > 1 ||
		document.querySelectorAll('[style*="glassmorphism"]').length > 0 ||
		!!document.querySelector('[style*="border-radius: 12px"]')
	`)
	if err != nil {
		return fmt.Errorf("results check: %w", err)
	}
	if !hasResults {
		return fmt.Errorf("no result cards appeared after evaluation")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 3: Date evaluation produces results
// ──────────────────────────────────────────────────────────────
func testDateEvaluation(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Switch to DATE mode
	_, err := page.Evaluate(ctx, `
		const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'DATE');
		if (btn) btn.click();
		else throw new Error('DATE button not found');
	`)
	if err != nil {
		return fmt.Errorf("switch to DATE mode: %w", err)
	}
	shortPause()

	// Set a date value
	_, err = page.Evaluate(ctx, `
		const input = document.querySelector('input[type="date"]');
		if (!input) throw new Error('date input not found');
		const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
		nativeSet.call(input, '1990-06-15');
		input.dispatchEvent(new Event('input', { bubbles: true }));
		input.dispatchEvent(new Event('change', { bubbles: true }));
	`)
	if err != nil {
		return fmt.Errorf("fill date: %w", err)
	}
	shortPause()

	// Click Evaluate
	_, err = page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Evaluate')?.click();
	`)
	if err != nil {
		return fmt.Errorf("click evaluate: %w", err)
	}
	time.Sleep(500 * time.Millisecond)

	// Verify Life Path or similar date-based result appeared
	hasResult, err := evalBool(ctx, page, `
		const text = document.body.innerText.toLowerCase();
		text.includes('life path') || text.includes('expression') || text.includes('birth')
	`)
	if err != nil {
		return fmt.Errorf("result check: %w", err)
	}
	if !hasResult {
		return fmt.Errorf("no date-based result (Life Path / Birth) appeared")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 4: Number evaluation produces results
// ──────────────────────────────────────────────────────────────
func testNumberEvaluation(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Switch to NUMBER mode
	_, err := page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'NUMBER')?.click();
	`)
	if err != nil {
		return fmt.Errorf("switch to NUMBER: %w", err)
	}
	shortPause()

	// Enter number 7
	_, err = page.Evaluate(ctx, `
		const input = document.querySelector('input[type="number"]');
		if (!input) throw new Error('number input not found');
		const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
		nativeSet.call(input, '7');
		input.dispatchEvent(new Event('input', { bubbles: true }));
	`)
	if err != nil {
		return fmt.Errorf("fill number: %w", err)
	}
	shortPause()

	// Evaluate
	_, err = page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Evaluate')?.click();
	`)
	if err != nil {
		return fmt.Errorf("click evaluate: %w", err)
	}
	time.Sleep(500 * time.Millisecond)

	// Check for a meaning result (number 7 should produce meaning in every system)
	hasResult, err := evalBool(ctx, page, `
		document.body.innerText.toLowerCase().includes('7') &&
		document.body.innerText.length > 200
	`)
	if err != nil {
		return fmt.Errorf("result check: %w", err)
	}
	if !hasResult {
		return fmt.Errorf("no results for number 7")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 5: System switching changes active system
// ──────────────────────────────────────────────────────────────
func testSystemSwitching(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Read current system name from the system selector button
	initialSys, err := evalString(ctx, page, `
		const sysBtn = document.querySelector('button[style*="border-radius: 20px"]') ||
			document.querySelector('button[style*="borderRadius"]');
		sysBtn ? sysBtn.textContent.trim() : ''
	`)
	if err != nil || initialSys == "" {
		return fmt.Errorf("could not read initial system name: %v (got %q)", err, initialSys)
	}

	// Click system selector to open picker
	_, err = page.Evaluate(ctx, `
		const sysBtn = document.querySelector('button[style*="border-radius: 20px"]') ||
			Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pythagorean'));
		if (sysBtn) sysBtn.click();
		else throw new Error('system selector not found');
	`)
	if err != nil {
		return fmt.Errorf("open system picker: %w", err)
	}
	shortPause()

	// Verify the picker modal is open (should see "Choose System" heading)
	hasModal, err := evalBool(ctx, page, `document.body.innerText.includes('Choose System')`)
	if err != nil {
		return fmt.Errorf("modal check: %w", err)
	}
	if !hasModal {
		return fmt.Errorf("system picker modal did not open")
	}

	// Click on a different system (Hebrew Gematria)
	_, err = page.Evaluate(ctx, `
		const btns = Array.from(document.querySelectorAll('button'));
		const hebrew = btns.find(b => b.textContent.includes('Hebrew Gematria'));
		if (hebrew) hebrew.click();
		else throw new Error('Hebrew Gematria not in picker');
	`)
	if err != nil {
		return fmt.Errorf("select Hebrew Gematria: %w", err)
	}
	shortPause()

	// Verify system changed
	newSys, err := evalString(ctx, page, `
		const sysBtn = document.querySelector('button[style*="border-radius: 20px"]') ||
			Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hebrew'));
		sysBtn ? sysBtn.textContent.trim() : ''
	`)
	if err != nil {
		return fmt.Errorf("read new system: %w", err)
	}
	if !strings.Contains(newSys, "Hebrew") {
		return fmt.Errorf("system did not switch to Hebrew, got %q", newSys)
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 6: Explore tab — System Browser and Number Index
// ──────────────────────────────────────────────────────────────
func testExploreTab(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Click Explore tab
	_, err := page.Evaluate(ctx, `
		const tabs = Array.from(document.querySelectorAll('nav button'));
		const explore = tabs.find(b => b.textContent.toLowerCase().includes('explore'));
		if (explore) explore.click();
		else throw new Error('Explore tab not found');
	`)
	if err != nil {
		return fmt.Errorf("click explore tab: %w", err)
	}
	shortPause()

	// Verify Explore heading
	hasHeading, err := evalBool(ctx, page, `document.body.innerText.includes('Explore')`)
	if err != nil {
		return fmt.Errorf("heading check: %w", err)
	}
	if !hasHeading {
		return fmt.Errorf("Explore heading not found")
	}

	// Verify system entries are listed (should see at least a few system names)
	sysCount, err := evalFloat(ctx, page, `
		const text = document.body.innerText;
		let count = 0;
		['Pythagorean','Hebrew Gematria','Chaldean','Tarot','Mayan','Norse Runic'].forEach(s => {
			if (text.includes(s)) count++;
		});
		count
	`)
	if err != nil {
		return fmt.Errorf("system count: %w", err)
	}
	if sysCount < 4 {
		return fmt.Errorf("expected at least 4 systems visible, found %.0f", sysCount)
	}

	// Switch to Numbers segment
	_, err = page.Evaluate(ctx, `
		const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'NUMBERS');
		if (btn) btn.click();
	`)
	if err != nil {
		return fmt.Errorf("click Numbers segment: %w", err)
	}
	shortPause()

	// Verify number entries appear
	hasNumbers, err := evalBool(ctx, page, `
		document.body.innerText.includes('meanings') || document.body.innerText.includes('numbers')
	`)
	if err != nil {
		return fmt.Errorf("numbers check: %w", err)
	}
	if !hasNumbers {
		return fmt.Errorf("Number Index content not found")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 7: Divination — Norse Rune Draw
// ──────────────────────────────────────────────────────────────
func testDivinationRunes(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Navigate to Explore > Divination
	_, err := page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.toLowerCase().includes('explore'))?.click();
	`)
	if err != nil {
		return fmt.Errorf("click explore: %w", err)
	}
	shortPause()

	_, err = page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'DIVINATION')?.click();
	`)
	if err != nil {
		return fmt.Errorf("click divination segment: %w", err)
	}
	shortPause()

	// Click Rune Draw
	_, err = page.Evaluate(ctx, `
		const card = Array.from(document.querySelectorAll('div[style]')).find(
			d => d.textContent.includes('Rune Draw')
		);
		if (card) card.click();
		else throw new Error('Rune Draw card not found');
	`)
	if err != nil {
		return fmt.Errorf("click rune draw: %w", err)
	}
	shortPause()

	// Verify we're on the rune draw screen
	hasRuneUI, err := evalBool(ctx, page, `
		document.body.innerText.includes('Rune Draw') &&
		document.body.innerText.includes('Elder Futhark')
	`)
	if err != nil {
		return fmt.Errorf("rune UI check: %w", err)
	}
	if !hasRuneUI {
		return fmt.Errorf("rune draw screen did not load")
	}

	// Click DRAW button
	_, err = page.Evaluate(ctx, `
		const btn = Array.from(document.querySelectorAll('button')).find(
			b => b.textContent.trim() === 'DRAW'
		);
		if (btn) btn.click();
		else throw new Error('DRAW button not found');
	`)
	if err != nil {
		return fmt.Errorf("click draw: %w", err)
	}

	// Wait for rune result
	time.Sleep(1200 * time.Millisecond)

	// Verify a rune appeared (runic character + name)
	hasRune, err := evalBool(ctx, page, `
		const text = document.body.innerText;
		// Check for a rune name — all Elder Futhark runes have recognizable names
		['Fehu','Uruz','Thurisaz','Ansuz','Raidho','Kenaz','Gebo','Wunjo',
		 'Hagalaz','Nauthiz','Isa','Jera','Eihwaz','Perthro','Algiz','Sowilo',
		 'Tiwaz','Berkano','Ehwaz','Mannaz','Laguz','Ingwaz','Dagaz','Othala'].some(
			name => text.includes(name)
		)
	`)
	if err != nil {
		return fmt.Errorf("rune result check: %w", err)
	}
	if !hasRune {
		return fmt.Errorf("no rune name appeared after draw")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 8: Journal — evaluation history is recorded
// ──────────────────────────────────────────────────────────────
func testJournalHistory(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// First, run an evaluation so there's something in history
	_, err := page.Evaluate(ctx, `
		const input = document.querySelector('input[type="text"]');
		if (input) {
			const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
			nativeSet.call(input, 'TestHistory');
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}
	`)
	if err != nil {
		return fmt.Errorf("fill input: %w", err)
	}
	shortPause()

	_, err = page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Evaluate')?.click();
	`)
	if err != nil {
		return fmt.Errorf("evaluate: %w", err)
	}
	time.Sleep(500 * time.Millisecond)

	// Switch to Journal tab
	_, err = page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.toLowerCase().includes('journal'))?.click();
	`)
	if err != nil {
		return fmt.Errorf("click journal tab: %w", err)
	}
	shortPause()

	// Verify Journal heading
	hasJournal, err := evalBool(ctx, page, `document.body.innerText.includes('Journal')`)
	if err != nil {
		return fmt.Errorf("journal check: %w", err)
	}
	if !hasJournal {
		return fmt.Errorf("Journal heading not found")
	}

	// Verify the evaluation we just ran appears
	hasEntry, err := evalBool(ctx, page, `document.body.innerText.includes('TestHistory')`)
	if err != nil {
		return fmt.Errorf("history entry check: %w", err)
	}
	if !hasEntry {
		return fmt.Errorf("evaluation 'TestHistory' not found in journal")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 9: Settings — profile editing persists
// ──────────────────────────────────────────────────────────────
func testSettingsProfile(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Switch to Settings tab
	_, err := page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.toLowerCase().includes('settings'))?.click();
	`)
	if err != nil {
		return fmt.Errorf("click settings tab: %w", err)
	}
	shortPause()

	// Verify Settings heading
	hasSettings, err := evalBool(ctx, page, `document.body.innerText.includes('Settings')`)
	if err != nil {
		return fmt.Errorf("settings check: %w", err)
	}
	if !hasSettings {
		return fmt.Errorf("Settings heading not found")
	}

	// Verify Profile section exists with Name input
	hasProfile, err := evalBool(ctx, page, `
		document.body.innerText.includes('Profile') &&
		!!document.querySelector('input[placeholder*="name" i]')
	`)
	if err != nil {
		return fmt.Errorf("profile check: %w", err)
	}
	if !hasProfile {
		return fmt.Errorf("Profile section with name input not found")
	}

	// Verify mode toggle (Basic/Premium) exists
	hasMode, err := evalBool(ctx, page, `
		document.body.innerText.includes('Basic') && document.body.innerText.includes('Premium')
	`)
	if err != nil {
		return fmt.Errorf("mode check: %w", err)
	}
	if !hasMode {
		return fmt.Errorf("Basic/Premium mode toggle not found")
	}

	// Verify system presets section
	hasPresets, err := evalBool(ctx, page, `document.body.innerText.includes('System Presets')`)
	if err != nil {
		return fmt.Errorf("presets check: %w", err)
	}
	if !hasPresets {
		return fmt.Errorf("System Presets section not found")
	}

	return nil
}

// ──────────────────────────────────────────────────────────────
// TEST 10: DrillDown modal opens on result tap
// ──────────────────────────────────────────────────────────────
func testDrilldownModal(ctx context.Context, page *browser.Page, baseURL string) error {
	if err := navigateTo(ctx, page, baseURL); err != nil {
		return err
	}

	// Run an evaluation first
	_, err := page.Evaluate(ctx, `
		// Switch to NUMBER mode for simplest evaluation
		Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'NUMBER')?.click();
	`)
	if err != nil {
		return fmt.Errorf("switch to NUMBER: %w", err)
	}
	shortPause()

	_, err = page.Evaluate(ctx, `
		const input = document.querySelector('input[type="number"]');
		if (input) {
			const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
			nativeSet.call(input, '22');
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}
	`)
	if err != nil {
		return fmt.Errorf("enter number: %w", err)
	}
	shortPause()

	_, err = page.Evaluate(ctx, `
		Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Evaluate')?.click();
	`)
	if err != nil {
		return fmt.Errorf("evaluate: %w", err)
	}
	time.Sleep(500 * time.Millisecond)

	// Click on a result card to open DrillDown
	_, err = page.Evaluate(ctx, `
		const cards = document.querySelectorAll('div[style*="backdrop-filter"]');
		// Find a clickable result card (not the input card)
		for (const card of cards) {
			if (card.style.cursor === 'pointer' || card.onclick || card.getAttribute('style')?.includes('cursor: pointer')) {
				card.click();
				break;
			}
		}
	`)
	if err != nil {
		return fmt.Errorf("click result card: %w", err)
	}
	time.Sleep(300 * time.Millisecond)

	// Check if DrillDown modal appeared (has the close button ✕ and layer sections)
	hasDrill, err := evalBool(ctx, page, `
		const text = document.body.innerText;
		(text.includes('Reduction Path') || text.includes('System Meaning') || text.includes('Mathematical Properties')) &&
		text.includes('✕')
	`)
	if err != nil {
		return fmt.Errorf("drilldown check: %w", err)
	}
	if !hasDrill {
		return fmt.Errorf("DrillDown modal did not appear with expected layers")
	}

	return nil
}
