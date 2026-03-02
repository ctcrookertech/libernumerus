# Liber Numerus: The Book of Numbers — UI Specification

## 1. Overview

**Liber Numerus** is a mobile-first numerology calculator app rendered as a single React JSX component (938 lines). It implements a "Mystic Tech" aesthetic — deep purple glassmorphism layered over sacred geometry, particle fields, and gaussian-blurred decorative curves. The app accepts alphabetic input, maps letters to digits via the Pythagorean system, reduces the sum to a single digit (or Master Number), and presents the result as a Life Path archetype with animated transitions.

**Viewport:** Max 420px wide × 860px tall, centered. Full `100vh` height with vertical flex layout.

**Framework:** React functional components with hooks (`useState`, `useEffect`, `useRef`, `useCallback`). No external UI libraries — all styling is inline via `style` props. Fonts loaded via Google Fonts CDN.

---

## 2. Color System

All colors are centralized in a `C` constant object for consistency:

| Token | Value | Usage |
|---|---|---|
| `cyan` | `#00e5ff` | Secondary accent — inner vortex ring dots, flow line origins, equation operators, card borders, blurred curves |
| `green` | `#00ffa3` | Primary accent — section labels, active tab state, toggle switches, outer vortex dots, flow line endpoints, button text, SHARE button, result card running border |
| `gold` | `#f5e6be` | Feature color — header title, logo icon, result numbers inside vortex rings, large card number, calculation history result circles |
| `textBright` | `rgba(210,210,240,0.9)` | Primary body text — letter tiles, equation digits, button labels, settings labels |
| `textDim` | `rgba(180,180,220,0.6)` | Secondary text — descriptions, dates, subtitles, keywords |
| `cardBg` | `rgba(18,10,35,0.6)` | Glassmorphism card surface with `backdrop-filter: blur(14px)` |
| `cardBorder` | `rgba(0,229,255,0.15)` | Default card border (cyan at 15% alpha) |

Each accent also has a `Dim` variant (partial rgba string) used to construct opacity-variable references inline, e.g., `${C.greenDim}0.35)` → `rgba(0,255,163,0.35)`.

**Background gradient:** 165° linear gradient through five stops of deep purple:
`#0c0618` → `#150d2e` → `#1a1040` → `#12082a` → `#0a0416`

---

## 3. Typography

| Role | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Header title ("Liber Numerus:") | Playfair Display | 700 | 14px | Gold, letter-spacing 2px, dual-layer text-shadow glow |
| Header subtitle ("The Book of Numbers") | Montserrat | 500 | 11px | Gold at 70% opacity, letter-spacing 1.5px |
| Section labels | Montserrat | 700 | 10px | Green at 70% opacity, letter-spacing 2.5px, all-caps |
| Body text (bright) | Montserrat | 600 | 13px | `textBright` color |
| Body text (dim) | Montserrat | 400 | 12.5px | `textDim` color, line-height 1.5 |
| Letter tiles | — | 700 | 18px | `textBright`, letter displayed above its digit |
| Letter digits | — | 600 | 11px | Green at 80% opacity |
| Equation digits | Playfair Display | 700 | 20px | `textBright` |
| Equation sum | Playfair Display | 700 | 28px | Gold with text-shadow glow |
| Vortex ring numbers | Playfair Display | 700 | 38% of ring `size` prop | Gold with dual glow, `paddingBottom: size * 0.12` for optical centering |
| Result card main number | Playfair Display | 700 | 64px | Gold, line-height 0.75, margin-bottom 29px for vertical centering |
| Result card archetype | Montserrat | 700 | 14px | Cyan, letter-spacing 2.5px |
| Bottom nav labels | Montserrat | 600 | 8px | Green (active) or dim lavender (inactive) |

---

## 4. Logo Icon

A 22×22px SVG composed of three layered geometric elements, all stroked in gold at 0.9 opacity:

1. **Inverted pentagon** — 5 vertices at radius 10.5 from center (12,12), rotated so one vertex points straight down (offset +90°). Stroke-width 1, no fill.
2. **8-pointed star (octagram)** — Two overlapping 11×11 squares centered at (12,12). The second square is rotated 45° via `transform="rotate(45 12 12)"`. Stroke-width 0.8, no fill. Lines visibly cross at 8 intersection points.
3. **Equilateral triangle** — Centered inside the star, vertices at (12,7), (16.33,14.5), (7.67,14.5). Circumradius ~5px. Fill gold at 20% opacity, stroke gold at 0.7 width.

Icon is positioned 3px right of the hamburger menu, nudged down 1px for optical alignment, with 3px gap before title text.

---

## 5. Background Layers (Bottom to Top)

All background layers are `position: absolute`, `inset: 0`, `pointer-events: none`, `z-index: 0`.

### 5.1 Particle Canvas

An HTML5 `<canvas>` element running a continuous `requestAnimationFrame` loop:

- **55 particles**, each with random position, radius (0.3–1.8px), velocity (±0.25 px/frame), alpha (0.15–0.55)
- **Color:** HSL hue randomly 160 (green-tinted) or 180 (cyan-tinted), 100% saturation, 60% lightness
- **Constellation lines:** Between any two particles within 90px distance, a connecting line at `rgba(0,229,255, 0.06 × (1 - dist/90))` opacity
- **Responsive:** Canvas resizes to parent on window resize

### 5.2 Sacred Geometry (Metatron's Cube)

A 400×400 SVG at **18% opacity**, color `#c0b0ff` (pale lavender-purple):

- **13 Fruit of Life circles:** 1 center + 6 inner (radius R=60 from center) + 6 outer (radius 2R from center). Each circle: radius `R × 0.95 = 57`, stroke-width 0.6, opacity 0.8
- **78 connecting lines:** Every point connected to every other point (13 choose 2). Stroke-width 0.5, opacity 0.7. This forms the full Metatron's Cube lattice.
- **Hexagram (Star of David):** Two overlapping equilateral triangles at radius `R × 2.2 = 132` from center. Stroke-width 0.55, opacity 0.6.
- **Bounding circles:** Double ring at `R × 3 = 180` (stroke 0.5, opacity 0.5) and `R × 3.2 = 192` (stroke 0.35, opacity 0.3).
- Includes a `radialGradient` definition (`geoFade`) for potential future use.

### 5.3 Blurred Decorative Curves

A full-viewport SVG (viewBox 0 0 400 700, `preserveAspectRatio="none"`) at **100% opacity** containing 5 bezier paths, each with SVG Gaussian blur filters:

| Curve | Color | Stroke | Opacity | Filter (σ) | Path Description |
|---|---|---|---|---|---|
| Large S-curve | Cyan | 2.5px | 0.20 | 12 | Flows left-to-right, dips through middle |
| Counter-curve | Green | 2.0px | 0.18 | 18 | Flows right-to-left, crosses the S-curve |
| Top accent | Green | 3.0px | 0.15 | 12 | Short curve near top of viewport |
| Bottom curve | Cyan | 2.0px | 0.15 | 18 | Gentle wave along bottom third |
| Central wisp | Cyan→Green gradient | 1.5px | 0.18 | 8 | Closed diamond-like orbit at center |

The `cyanGreenGrad` linearGradient transitions from `C.cyan` to `C.green` diagonally.

---

## 6. Global Layout

```
┌─────────────────────────────────┐
│  Header Bar (z-index: 10)       │  Fixed height ~50px
│  ☰  [Logo] Title     [Avatar]  │
├─────────────────────────────────┤
│                                 │
│  Scrollable Content Area        │  flex: 1, overflow-y: auto
│  (Tab-dependent content)        │  padding: 0 20px 16px
│                                 │
├─────────────────────────────────┤
│  Action Buttons (Home only)     │  Conditional, z-index: 10
├─────────────────────────────────┤
│  Bottom Navigation Bar          │  Fixed, z-index: 10
│  Home  Calc  Insights  Res  Set │  backdrop-blur: 12px
└─────────────────────────────────┘
```

---

## 7. Header Bar

- **Left:** Hamburger icon (3 horizontal lines, 22×22, `rgba(210,210,240,0.6)` stroke)
- **Center:** Logo icon + title group (see §4)
- **Right:** Profile avatar button — 30×30 circle, linear-gradient fill (cyan 25% → green 20%), green border at 35% opacity. On hover: `box-shadow: 0 0 12px green@30%`. Opens `ProfileOverlay` on click. Contains a person SVG icon (16×16).

Padding: 16px top, 20px sides, 8px bottom.

---

## 8. Bottom Navigation Bar

5 tabs in order: **Home**, **Calculations**, **Insights**, **Research**, **Settings**

- Background: `rgba(8,4,18,0.85)` with `backdrop-filter: blur(12px)`
- Top border: `1px solid cyan@6%`
- Each tab: flex column, centered, 6px horizontal padding

**Tab structure:**
- **Active indicator:** 20×2px bar positioned 9px above the icon, colored green with `box-shadow: 0 0 8px green@60%`
- **Icon:** 20×20 SVG, `strokeWidth: 1.5`, stroke-linecap/join round. Active: green with `drop-shadow(0 0 6px green@50%)`. Inactive: `rgba(180,170,210,0.3)`
- **Label:** 8px Montserrat 600, letter-spacing 0.3px. Active: green. Inactive: same dim lavender.

**Tab icons (SVG path `d` values):**
- Home: House outline
- Calculations: Abacus (horizontal lines with beads)
- Insights: Lightning bolt
- Research: Open book
- Settings: Gear/cog

---

## 9. Home Tab — The Calculation Engine

### 9.1 State Machine

The Home tab uses a 4-step animation sequence controlled by `animStep` (0–3) and `showResult` boolean:

| Step | Delay from trigger | What appears |
|---|---|---|
| 0 | 0ms | Letter tiles visible, flow lines hidden |
| 1 | 400ms | Flow lines + equation row animate in |
| 2 | 1000ms | Reduction vortex rings appear |
| 3 | 1600ms | Calculator slides left (opacity 0, translateX -40px), Result card slides in from right |

Transitions use `cubic-bezier(0.16, 1, 0.3, 1)` easing (spring-like).

### 9.2 Input Field

- Full-width, centered text, `rgba(18,10,35,0.5)` background, `backdrop-filter: blur(8px)`
- Border: `1px solid cyan@20%`, transitions to `green@50%` on focus
- Text: Gold, 20px Montserrat 700, letter-spacing 6px
- Accepts only A–Z (auto-uppercased, non-alpha stripped)
- Enter key triggers calculation

### 9.3 Letter Tiles

Horizontally centered flex row, gap 6px, wrapping. Each tile:
- Size: `min(50px, spacing - 4px)` where spacing = `min(56, 280 / letterCount)`
- Background: `rgba(18,10,35,0.6)`, `backdrop-filter: blur(6px)`
- Border: `1px solid cyan@30%`, border-radius 8px
- Box-shadow: `0 0 8px cyan@6%`
- Content: Letter (18px 700 `textBright`) over digit (11px 600 green@80%)
- Entrance animation: `fadeUp 0.3s` with 60ms stagger per letter

### 9.4 Flow Lines (FlowLines Component)

SVG, viewBox `0 0 320 55`, full width, 55px height:

Each letter generates a **bezier curve** from the tile position downward. The curves fan outward from center:
- `drift = (x - 160) * 0.15` — letters further from center curve more
- Control points: `cp1x = x + drift×0.6` at y=15, `cp2x = x + drift` at y=30
- Endpoint: `x + drift×0.5` at y=48

Each curve has two layers:
1. **Glow layer:** 4px stroke, cyan, 25% opacity, Gaussian blur σ=3.5
2. **Crisp layer:** 1.8px stroke, linearGradient (cyan@80% → green@50% → green@10%)

Terminus dot: 2.5px radius circle in green, with pulsing opacity animation (0.3→0.7→0.3 over 2s).

Entrance: `flowFade 0.5s` with 80ms stagger.

### 9.5 Equation Row

Horizontal flex row of digit + operator pairs:
- Each digit: 20px Playfair Display 700, `textBright`
- Operators (`+`): 16px, `green@50%`
- Equals sign: 16px, `cyan@50%`, 6px horizontal margin
- Sum: 28px Playfair Display 700, gold with `text-shadow: 0 0 15px gold@30%`
- Bottom margin: 20px
- Entrance: `fadeUp 0.4s`

### 9.6 Reduction Orbitals (VortexRing Component)

Horizontal flex row, centered, gap 16px. Displays the reduction chain (e.g., 29 → 11 → 2).

**VortexRing** structure (relative container, size × size):

1. **Blurred aura:** `inset: -8`, radial-gradient (green@18% center → cyan@5% mid → transparent), pulses via `pulse` keyframe (scale 1→1.15, opacity 0.6→1, 4s cycle)
2. **Outer ring:** `inset: 0`, 2px border `cyan@18%`, rotates clockwise at 8s/revolution. Carries a 6×6 green dot at top with double glow shadow.
3. **Inner ring:** `inset: 12`, 1.5px border `cyan@30%`, inner+outer box-shadows in cyan@8%, rotates counter-clockwise at 12s/revolution. Carries a 4×4 cyan dot at bottom.
4. **Center number:** Absolutely centered, Playfair Display 700, gold with dual text-shadow glow. `paddingBottom: size × 0.12` for optical vertical centering.

Between vortex rings, an arrow group shows:
- Digit breakdown text (e.g. "2+9") in 9px `green@50%`
- Right-pointing arrow SVG (24×12), green@40% stroke

First and last vortex rings are size 90px. Intermediate rings are 70px.

### 9.7 Action Buttons

Shown only on Home tab, pinned below scroll area.

**Pre-result state (calculator visible):**
- Single "CALCULATE" button, full width
- Background: linear-gradient green@15% → cyan@10%
- Border: green@40%, border-radius 10px
- Text: Green, 13px Montserrat 700, letter-spacing 2.5px
- Animated: `glowPulse` keyframe (box-shadow oscillates green@30% to green@60%, 2s cycle)

**Post-result state (result card visible):**
- Two equal buttons side by side, gap 12px
- "RE-CALCULATE": `rgba(18,10,35,0.6)` bg, cyan@30% border, `textBright` text. Clicking resets to animStep 2.
- "SHARE": gradient bg (green@12%/cyan@8%), green@35% border, green text
- Both: `backdrop-filter: blur(8px)`, border-radius 10px, 12px Montserrat 700, letter-spacing 2px
- Hover: border brightens to 60%, adds `box-shadow: 0 0 16px @12%`

---

## 10. Result Card (ResultCard Component)

Absolutely positioned over the calculator view, slides in from right (translateX 40→0, opacity 0→1) with spring easing over 800ms.

### 10.1 Decorative Swirl

SVG (200×120) positioned behind the top vortex ring at 50% opacity:
- Two nested gaussian-blurred (σ=6) bezier curves — one green (3px), one cyan (2.5px) — forming a chalice/vortex funnel shape converging upward

### 10.2 Top Vortex Ring

100×100px VortexRing displaying the final number, with z-index 2 above the swirl. 16px bottom margin.

### 10.3 Number Card

Max-width 280px, centered:
- Background: `rgba(18,10,35,0.75)`, `backdrop-filter: blur(16px)`
- Border: `1px solid green@30%`, border-radius 16px
- Box-shadow: `0 0 30px green@6%`, plus `inset 0 1px 0 white@5%`
- Padding: 28px vertical, 24px horizontal

**Running border light:** An absolutely positioned pseudo-layer (inset -1px) with a `conic-gradient` that rotates:
`conic-gradient(from 0deg, transparent 0%, green 8%, cyan 15%, transparent 22%)`
Rotates via `spinSlow` at 4s/revolution, 35% opacity. A solid inner fill layer (inset 1px, `rgba(18,10,35,0.95)`) sits behind the content.

**Content stack (centered text):**

| Element | Size | Color | Spacing |
|---|---|---|---|
| "LIFE PATH NUMBER" | 11px Montserrat 600 | green@70% | letter-spacing 3px, mb 8px |
| Final number | 64px Playfair Display 700 | Gold with dual text-shadow | line-height 0.75, mb 29px |
| Archetype title (e.g. "THE HARMONIZER") | 14px Montserrat 700 | Cyan | letter-spacing 2.5px, mb 10px |
| Keywords | 12.5px Montserrat 400 | `textDim` | line-height 1.5, mb 16px |
| "Your Destiny:" | 12px Montserrat 600 | green@60% | mb 6px |
| Destiny text | 12.5px Montserrat 400 | `rgba(210,210,240,0.8)` | line-height 1.6 |

---

## 11. Profile Overlay

Full-screen overlay triggered by the header avatar button:

- Background: `rgba(8,4,18,0.9)`, `backdrop-filter: blur(20px)`
- Transition: opacity 0→1 over 400ms
- z-index: 100

**Close button:** Top-right, X icon (24×24), `rgba(210,210,240,0.6)` stroke.

**Avatar section:**
- 80×80 circle, linear-gradient (cyan@25% → green@20%), green border@35%, `box-shadow: 0 0 24px green@15%`
- Person SVG icon (36×36), `rgba(210,210,240,0.8)` stroke
- Name: 20px Playfair Display 700, gold
- Subtitle: 11px dimText, letter-spacing 1.5px (e.g., "SEEKER · LIFE PATH 2")

**Core Numbers grid:** 2×2 grid, gap 10px:
- Each cell: glassCard containing gold number (24px Playfair) + label (11px brightText) + archetype (10px dimText)
- Numbers displayed: Life Path (2), Expression (7), Soul Urge (9), Personality (4)

**Profile Details:** glassCard with 3 key-value rows:
- Birth Name, Date of Birth, Birth Number
- Rows separated by `cyan@6%` borders

**Edit button:** Full-width, `rgba(18,10,35,0.5)` bg, green@25% border, green text, 12px Montserrat 700.

---

## 12. Calculations Tab

Section label: "CALCULATION HISTORY"

**6 history entries**, each a glassCard row with staggered `fadeUp` entrance (60ms per item):

| Left | Center | Right |
|---|---|---|
| 42×42 circle (green@30% border) with gold result digit | Word (13px brightText, letter-spacing 2px) + reduction summary (10px dimText, e.g. "29 → 2 · THE HARMONIZER") | Date (10px dimText) |

Hover: border transitions to `green@35%`.

Mock data: AURORA (2), DESTINY (3), SERAPHIM (2), ECLIPSE (2), ZEPHYR (4), SOLSTICE (3).

---

## 13. Insights Tab

### 13.1 Insight Cards

Section label: "YOUR INSIGHTS". Three cards with staggered entrance (100ms):

Each card is a glassCard with a directional gradient background tint:
- Card 1 "Number 2 Dominance" — cyan@10% tint
- Card 2 "Master Number Alert" — green@10% tint
- Card 3 "Weekly Pattern" — gold@6% tint

Each has a 6×6 green dot indicator (with `box-shadow: 0 0 8px green@50%`) next to the title.

### 13.2 Number Frequency Chart

Section label: "NUMBER FREQUENCY"

Bar chart inside a glassCard, height 80px. 9 bars for digits 1–9:
- Bar height encodes frequency: 2→70px (dominant), 3→45, 4→30, 7→20, 9→15, others→8
- Dominant bar (2): green gradient fill, green@50% border
- Other bars: cyan gradient fill, cyan@12% border
- Max bar width: 24px, border-radius 4px
- Digit label below each bar: 10px dimText

---

## 14. Research Tab

Section label: "NUMEROLOGY LIBRARY"

5 topic entries, each a glassCard row with staggered entrance (70ms):

| Icon box | Content | Nav |
|---|---|---|
| 38×38, border-radius 10px, green@5% bg, green@15% border, 18px unicode glyph in green | Title (13px brightText) + description (dimText) | 16×16 chevron-right, `rgba(210,210,240,0.2)` |

**Topics:**
1. △ Pythagorean Numerology
2. ☽ Chaldean Numerology
3. ✦ Master Numbers
4. ⬡ Sacred Geometry
5. ∿ Name Vibrations

Hover: border transitions to `green@35%`.

---

## 15. Settings Tab

### 15.1 Preferences

Section label: "PREFERENCES". Four toggle rows inside a glassCard:

- Push Notifications (on), Haptic Feedback (on), Dark Mode (on), Preserve Master Numbers (on)
- Toggle: 44×24px track with 18×18 knob
- On state: green@30% track, green@50% border, green knob with `box-shadow: 0 0 8px green@50%`
- Off state: `rgba(210,210,240,0.1)` track, dim border, dim lavender knob
- Animation: `transition: all 0.3s` on all elements
- Row dividers: `cyan@5%` bottom border

### 15.2 Calculation System

Section label: "CALCULATION SYSTEM". Two radio options in a glassCard:

- Pythagorean (selected): Green border circle with green filled dot (8×8, glowing)
- Chaldean (unselected): Dim border circle, no fill
- Labels: brightText (selected) / dimText (unselected)

### 15.3 About

Section label: "ABOUT". Centered glassCard with dimText:
- "Liber Numerus: The Book of Numbers v2.4.1"
- "Built with sacred intention" (10px, 50% opacity)

---

## 16. Numerology Engine

### 16.1 Pythagorean Letter Map

Standard Western numerology mapping:
```
A=1 B=2 C=3 D=4 E=5 F=6 G=7 H=8 I=9
J=1 K=2 L=3 M=4 N=5 O=6 P=7 Q=8 R=9
S=1 T=2 U=3 V=4 W=5 X=6 Y=7 Z=8
```

### 16.2 Reduction Algorithm (`reduceToSingle`)

1. Sum all letter digits → `rawSum`
2. Record `rawSum` as first step
3. While result > 9 AND result ∉ {11, 22, 33}:
   - Split digits, sum them
   - Record as next step
4. Return `{ final, steps }` where `steps` is the full reduction chain

Master Numbers 11, 22, 33 are preserved (not reduced further).

### 16.3 Life Path Data

12 archetypes covering digits 1–9 plus Master Numbers 11, 22, 33. Each has:
- `title`: All-caps archetype name (e.g. "THE HARMONIZER")
- `keywords`: Comma-separated trait list
- `destiny`: One-sentence destiny description

---

## 17. Animations

All defined as CSS `@keyframes` in a `<style>` block:

| Name | Duration | Description |
|---|---|---|
| `spinSlow` | Varies (4s, 8s, 12s) | `rotate(0deg)` → `rotate(360deg)`, linear, infinite. Used for vortex rings and conic border |
| `pulse` | 3–4s | Scale 1→1.15→1, opacity 0.6→1→0.6. Ease-in-out, infinite. Vortex auras and result swirl |
| `flowFade` | 0.5s | TranslateY -8→0, opacity 0→1. `both` fill. Staggered per flow line |
| `fadeUp` | 0.3–0.5s | TranslateY 12→0, opacity 0→1. `both` fill. Used for most content entrances |
| `glowPulse` | 2s | Box-shadow oscillates green@30% → green@60%. Ease-in-out, infinite. CALCULATE button |

SVG-native `<animate>`: Flow line terminus dots pulse opacity (0.3→0.7→0.3, 2s, infinite).

---

## 18. Interaction States

- **Input focus:** Border color transitions from cyan@20% to green@50%
- **Card hover:** Border color transitions to green@35% (300ms)
- **Button hover:** Border brightens to @60%, box-shadow appears at @12% (300ms)
- **Tab press:** Immediate state change, icon/label color transition 300ms
- **Profile button hover:** Green glow box-shadow appears
- **Toggle tap:** Track, knob, border, and glow all transition over 300ms

---

## 19. Responsive Behavior

- Container: `max-width: 420px`, centered with `margin: 0 auto`
- Height: `100vh` capped at `max-height: 860px`
- Content area: `overflow-y: auto` with custom 3px-wide scrollbar (cyan@15% thumb, transparent track)
- Letter tile sizing: Dynamically calculated `min(50px, 280/letterCount - 4)` to prevent overflow
- Flow line spacing: Matches tile spacing calculation
- Particle canvas: Resizes on window resize event
- All background SVGs: `width: 100%`, `height: 100%` with absolute positioning

---

## 20. Component Tree

```
NumerologyInsight (root)
├── <style> (keyframes + global resets)
├── ParticleBackground (canvas)
├── SacredGeometry (SVG)
├── BlurredCurves (SVG)
├── ProfileOverlay (conditional)
├── Header
│   ├── Hamburger icon
│   ├── Logo SVG + Title
│   └── Avatar button
├── Scrollable Content
│   ├── [Home] Calculator View / ResultCard
│   ├── [Calculations] CalculationsTab
│   ├── [Insights] InsightsTab
│   ├── [Research] ResearchTab
│   └── [Settings] SettingsTab
├── Action Buttons (Home only)
└── Bottom Nav Bar
```

---

## 21. State Management

All state is local via `useState`:

| State | Type | Default | Purpose |
|---|---|---|---|
| `name` | string | `"AURORA"` | The confirmed calculation input |
| `inputValue` | string | `"AURORA"` | Live text field value |
| `calculated` | boolean | `true` | Whether a calculation has been triggered |
| `showResult` | boolean | `true` | Whether to show the result card |
| `animStep` | number (0–3) | `3` | Current animation phase |
| `activeTab` | string | `"Home"` | Currently selected tab |
| `showProfile` | boolean | `false` | Profile overlay visibility |

Settings tab has its own local `toggles` state object: `{ notifications, haptics, darkMode, masterNumbers }`.

Derived values (recomputed each render): `letters`, `digits`, `rawSum`, `final`, `steps`.
