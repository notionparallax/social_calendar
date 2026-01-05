# Social Spacing Calculator — Project Specification

A small Svelte single‑page web app that computes sustainable intervals for staying in touch with people, based on ranking and a gentle priority curve. Outputs Todoist‑ready recurring tasks.

---

## 1. Purpose

Help users determine how often they should check in with people in their life, without overloading themselves. The app:

- Accepts a ranked list of names  
- Computes sustainable intervals (in days) using a gentle priority curve  
- Lets the user adjust curve strength via a slider  
- Outputs Todoist‑ready “every X days” tasks  
- Supports bulk copy‑and‑paste into Todoist Quick Add  

---

## 2. Core Features

### 2.1 Input

- A CodeMirror text area  
- Each line = one person  
- Order = rank (top = most frequent)

### 2.2 Parameters

- Slider for curve strength (α), range: 0.2 → 2.0, step: 0.05  
- Min interval (days), default: 14 — user-editable via spinner  
  - Min: 1, Max: must be < maxDays  
  - Step: ±1 day  
- Max interval (days), default: 365 — user-editable via spinner  
  - Min: must be > minDays, Max: unlimited (e.g., 730 for 2-year cycles)  
  - Step: ±1 day  
- Total opportunities to meet per year, default: 52 — user-editable via spinner  
  - Min: 1, Max: 365  
  - Step: ±1 meeting  

### 2.3 Computation

For N people with rank \( i \):

1. **Weight function**  
   \( w_i = 1 / (i^\alpha) \)

2. **Normalisation**  
   \( f_i = 52 \cdot \frac{w_i}{\sum w} \)

3. **Interval**  
   \( d_i = 365 / f_i \)

4. **Clamp**  
   \( d_i = \text{clamp}(d_i, \text{minDays}, \text{maxDays}) \)

5. **Renormalise after clamping**  
   - Iteratively adjust intervals proportionally, respecting min/max bounds  
   - Goal: \( \sum_{i=1}^{N} \frac{365}{d_i} \approx \text{totalMeetings} \)  
   - Note: Implementation approach to be refined during development

### 2.4 Output

- Table with:
  - Rank  
  - Name  
  - Days (decimal)  
  - Rounded days (integer)  
- A "Copy tasks" button that outputs **rounded days** (Todoist format):

```
Alice every! 17 days
Bob every! 20 days
Charlie every! 24 days
```

- One name and interval per line  
- No additional text (user can customize in Todoist or via future prepend field feature)  
- Format allows flexible use (people, activities, mixed tasks)

_!_ indicates that the repeat is based on the completed date, not the scheduled date. I.e. if you plan to see x on the 1st of the month, but you don't see them until the 28th, this will schedule the next catch up a month later, not on the 1st again.

---

## 3. Architecture

### 3.1 Tech Stack

- Svelte  
- Vite (build tool)  
- CodeMirror 6  
- No backend  

### 3.2 Component Structure

```
App.svelte
 ├── CodeMirrorInput.svelte
 ├── CurveSlider.svelte
 ├── ParameterSpinners.svelte
 ├── ResultsTable.svelte
 ├── CopyButton.svelte
 └── ExplanationSection.svelte
```

### 3.3 Data Flow

- `App.svelte` holds state:
  - `names[]`
  - `alpha` (default: 1.0)
  - `minDays` (default: 14)
  - `maxDays` (default: 365)
  - `totalMeetings` (default: 52)
  - `intervals[]`
- Computation happens in a pure JS module:
  - `computeIntervals.js`
- Components subscribe reactively to state
- URL state:
  - All parameters (names, alpha, minDays, maxDays, totalMeetings) encoded as query params  
  - Format: `?names=Alice,Bob&alpha=0.7&min=14&max=365&total=52`  
  - Updates debounced (500ms) during typing  
  - On load, parse URL to restore state  
- Initial state (first visit, no URL params):
  - Load with 10 default names
  - Alpha = 1.0
  - Other parameters at their defaults

---

## 4. Core Algorithm (JS Module)

Create a file: `src/lib/computeIntervals.js`

Exports a function:

```js
export function computeIntervals(names, options) {
  // returns array of { name, days, roundedDays }
}
```

Inputs:

- `names: string[]`
- `options: { alpha, minDays, maxDays, totalMeetings }`

Outputs:

- Array of objects:
  - `name`
  - `days` (decimal)
  - `roundedDays` (integer, using Math.ceil)

---

## 5. UI Layout

### Desktop (≥768px)

- Two-column layout:
  - **Left**: CodeMirror input (names list)  
  - **Right**: Results table + copy button  
- **Bottom**: Parameters (slider + spinners) spanning full width  
- **Footer**: Explanation section (algorithm description + usage guide)

### Mobile (<768px)

- Single-column stacked layout:
  1. CodeMirror input  
  2. Parameters (slider + spinners)  
  3. Results table + copy button  
  4. Explanation section  

### Styling

- Plain CSS or minimal styling (no heavy UI framework)  
- Clean, minimal, professional appearance  

---

## 6. UI Behaviour

### 6.1 CodeMirror Input

- Multi‑line text  
- On change → update names array  
- Empty lines ignored  
- Default names (10 examples, each from a different continent):
  - Amara (Africa)  
  - Chen (Asia)  
  - Diego (South America)  
  - Elena (Europe)  
  - Fiona (North America)  
  - Genji (Asia - different region)  
  - Hassan (Middle East)  
  - Isla (Oceania)  
  - Jamal (Africa - different region)  
  - Keiko (Asia - different region)  
- CodeMirror configuration:
  - Line numbers: enabled  
  - Alt+Arrow keys: move lines up/down (reordering)  
  - All other features: disabled or hidden  
  - Minimal, clean appearance

### 6.2 Slider

- Range 0.2 → 2.0  
- Step 0.05  
- Display: numeric value only (e.g., "0.70")  
- Live updates on drag

### 6.3 Parameter Spinners

- Three spinners for minDays, maxDays, totalMeetings  
- Live validation:
  - minDays: must be ≥ 1 and < maxDays  
  - maxDays: must be > minDays  
  - totalMeetings: must be ≥ 1 and ≤ 365  
- Invalid values: spinners block input (UI feedback to be added later)  
- Changes trigger recomputation

### 6.4 Results Table

Columns:

- Rank  
- Name  
- Days (decimal, 1 decimal place)  
- Rounded days (integer)

**Error states:**

- If 0 or 1 names: table shows "Add at least 2 names to calculate intervals"  
- Malformed URL params: fall back to default state

### 6.5 Copy Button

Copies a block like:

```
Alice every! 17 days
Bob every! 20 days
Charlie every! 24 days
```

- Uses **rounded days** (integers) per Todoist specification  
- Button text changes to "Copied!" briefly after successful copy  
- Copies to clipboard using navigator.clipboard API

### 6.6 Explanation Section

Displayed at the bottom of the page. Contains:

**How It Works:**

- Brief explanation of the priority curve algorithm
- How ranking affects contact frequency
- Role of the alpha (α) parameter (curve strength)
- Example: "People at the top of your list get contacted more frequently. The curve strength controls how steep this drop-off is."

**How to Use:**

- Instructions for entering names (one per line, order = priority)
- How to adjust parameters
- How to copy tasks to Todoist
- Tip: Mark all tasks as completed on first import to start the cycle
- Note: Works for any recurring activities, not just meeting people

**Algorithm Summary:**

- Weight function: \( w_i = 1 / i^\alpha \)
- Normalized to target total meetings per year
- Intervals clamped to min/max bounds
- Output rounded up (ceiling) for Todoist format

---

## 7. Acceptance Criteria

### Functional

- Changing the list updates the table instantly  
- Moving the slider updates intervals
- Copy button produces valid Todoist Quick Add lines  
- Algorithm always produces intervals within min/max bounds  
- Total meetings per year ≈ 52 (±1 due to rounding)  

### UI/UX

- No page reloads  
- CodeMirror supports paste, undo, and multi‑line editing  
- Mobile‑friendly layout  

### Technical

- All computation is pure and deterministic  
- No external API calls  
- No backend required  
- Build works with `npm run dev` and `npm run build`  
- Deploys to GitHub Pages from repository root (build output in root)  
- State (all parameters) stored in URL with debounced updates (500ms)

---

## 8. Optional Enhancements (Future)

- Export CSV  
- Drag‑and‑drop reordering  
- Multiple curves (linear, exponential, harmonic)  
- Dark mode  
- Save settings to localStorage  
- "Simulate next 12 months" calendar view  
- Prepend field for custom task text (e.g., "Check in with", "Go", "Practice")
