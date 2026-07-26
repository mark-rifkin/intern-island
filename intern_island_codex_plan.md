# Intern Island — Codex Implementation Specification

## 1. Objective

Build a polished, full-screen, touchscreen-friendly web application called **Intern Island**.

The app simulates a professional, Square-inspired tipping and payment flow for a joke. It must look credible and restrained until the fictional payment is declined. It must not process real payments, contact external services, or use Square branding or assets.

The intended device is a Dell XPS 15 running the app in a full-screen desktop browser. The operator will enter full-screen mode manually. The participant begins directly on the tip-selection screen.

---

## 2. Product requirements

### 2.1 Core flow

The application has five main screens:

1. **Tip selection**
2. **Tip allocation**
3. **Simulated processing**
4. **Transaction declined**
5. **Appreciation confirmation**

A custom-amount modal appears over the tip-selection screen.

### 2.2 Functional summary

- The participant chooses a tip amount.
- Preset amounts are `$2`, `$5`, `$10`, `$20`, `$1,000`, and `Custom`.
- `$1,000` has a subtle `Recommended` badge above the button.
- The participant must press `Continue`.
- The selected fixed total is divided among six interns.
- Intern order is randomized every time the allocation screen loads.
- Initial allocation is as even as possible.
- The participant can adjust six horizontal sliders.
- Increasing one intern's allocation reduces the other nonzero allocations equally.
- Decreasing one intern's allocation distributes the released amount equally among the other five.
- The total always remains exactly equal to the selected tip.
- After pressing `Pay $X`, the app runs a fictional corporate approval sequence.
- The transaction is always declined.
- The decline reason changes when the tip is greater than `$50`.
- The participant may press `Try again` or `Pay with appreciation`.
- `Pay with appreciation` shows a clean screen reading `Your appreciation is noted.`
- The appreciation screen automatically resets after 15 seconds.
- Pressing `R` resets the app from any screen.

---

## 3. Recommended stack

Use:

- React
- TypeScript
- Vite
- Plain CSS or CSS Modules
- Vitest for unit tests

Do not use a backend.

Do not implement:

- Stripe
- Square APIs
- PayPal
- Card readers
- Authentication
- Databases
- Network requests
- Analytics
- Local storage
- Session storage
- Real payment collection

The entire app must function locally in the browser.

---

## 4. Project structure

Suggested structure:

```text
src/
  App.tsx
  app.css

  components/
    AppShell.tsx
    TipSelectionScreen.tsx
    TipOptionButton.tsx
    CustomAmountModal.tsx
    AllocationScreen.tsx
    AllocationRow.tsx
    ProcessingScreen.tsx
    DeclineScreen.tsx
    AppreciationScreen.tsx
    SecurePaymentLabel.tsx

  hooks/
    useGlobalReset.ts
    useCursorVisibility.ts

  utils/
    currency.ts
    allocation.ts
    sliderScale.ts
    shuffle.ts

  data/
    interns.ts

  tests/
    currency.test.ts
    allocation.test.ts
    sliderScale.test.ts
    declineCopy.test.ts

public/
  interns/
    intern-1.jpg
    intern-2.jpg
    intern-3.jpg
    intern-4.jpg
    intern-5.jpg
    intern-6.jpg
    placeholder.jpg
```

The intern images will be supplied later. Use placeholder assets during development.

---

## 5. Application state

Use a small explicit screen state rather than multiple unrelated booleans.

```ts
type Screen =
  | "tip-selection"
  | "allocation"
  | "processing"
  | "declined"
  | "appreciation";
```

Suggested types:

```ts
interface Intern {
  id: string;
  imageSrc: string;
  alt: string;
}

interface AppState {
  screen: Screen;
  selectedTipCents: number | null;
  allocationsCents: number[];
  internOrder: Intern[];
  customModalOpen: boolean;
  processingStep: number;
}
```

Hard-code exactly six interns:

```ts
export const interns: Intern[] = [
  { id: "intern-1", imageSrc: "/interns/intern-1.jpg", alt: "Intern portrait" },
  { id: "intern-2", imageSrc: "/interns/intern-2.jpg", alt: "Intern portrait" },
  { id: "intern-3", imageSrc: "/interns/intern-3.jpg", alt: "Intern portrait" },
  { id: "intern-4", imageSrc: "/interns/intern-4.jpg", alt: "Intern portrait" },
  { id: "intern-5", imageSrc: "/interns/intern-5.jpg", alt: "Intern portrait" },
  { id: "intern-6", imageSrc: "/interns/intern-6.jpg", alt: "Intern portrait" },
];
```

Do not display intern names in the UI.

---

## 6. Currency handling

Store all money values as integer cents.

Never use floating-point dollar values for allocation math.

Use `Intl.NumberFormat` with locale `en-US` and currency `USD`.

Formatting rules:

- Whole-dollar values omit `.00`.
- Values with cents show exactly two decimal places.
- Thousands separators are required.
- Always include `$`.

Examples:

```text
$2
$20
$25.50
$1,000
$1,000,000
```

Suggested helper:

```ts
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  const hasCents = cents % 100 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(dollars);
}
```

---

## 7. Global visual direction

The interface should evoke a modern Square-style payment terminal without copying Square's branding, logo, wordmark, proprietary icons, or exact layouts.

### 7.1 Design principles

Use:

- White and very light-gray surfaces
- Near-black text
- One restrained accent color
- Large touch targets
- Rounded buttons and panels
- Thin neutral borders
- Subtle shadows
- Generous spacing
- Tabular numerals for money
- Minimal animation
- Professional, corporate visual language

Avoid:

- Confetti
- Sound
- Cartoon styling
- Bright gradients
- Loud joke styling
- Excessive motion
- Direct Square branding
- Card-number entry
- Fake card fields

### 7.2 Suggested design tokens

```css
:root {
  --background: #f5f6f7;
  --surface: #ffffff;
  --surface-muted: #f0f2f4;
  --text-primary: #15171a;
  --text-secondary: #697078;
  --border: #dfe3e7;
  --accent: #1677ff;
  --accent-dark: #0d5fd1;
  --danger: #c92a2a;
  --success: #1f7a4d;
  --shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  --radius-large: 20px;
  --radius-medium: 14px;
}
```

These values are starting points and may be tuned.

### 7.3 Typography

Use a clean system stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Use:

```css
font-variant-numeric: tabular-nums;
```

for all currency values.

### 7.4 Main shell

Suggested shell:

```css
.app-shell {
  width: min(1180px, calc(100vw - 48px));
  height: min(760px, calc(100vh - 48px));
  margin: 24px auto;
  background: var(--surface);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow);
  overflow: hidden;
}
```

The final app must fit without scrolling at approximately `1280 × 720`.

---

## 8. Global controls

### 8.1 Reset shortcut

Pressing `R` from any screen resets the application to the tip-selection screen.

Do not trigger reset when:

- The event has `Ctrl`, `Alt`, `Meta`, or another modifier.
- The focused element is an editable field.
- The event has already been prevented.

Reset behavior:

```ts
function resetApp() {
  clearAllTimers();
  setScreen("tip-selection");
  setSelectedTipCents(null);
  setAllocationsCents([]);
  setInternOrder([]);
  setCustomModalOpen(false);
  setProcessingStep(0);
}
```

The tip-selection screen should load with no selected amount.

### 8.2 Full-screen behavior

The operator will enter browser full-screen mode manually.

Do not require a participant-facing Begin screen.

Optional: support an undocumented operator shortcut such as `F` for the Fullscreen API, but this is not required.

### 8.3 Cursor hiding

Because the app is touch-first:

- Hide the cursor after approximately 2 seconds without mouse movement.
- Show it immediately on mouse movement.
- Use `cursor: none` only while hidden.
- Touch interaction should not depend on cursor visibility.
- Clear cursor timers on unmount.

### 8.4 Browser refresh

Refreshing the page must return to the initial tip-selection screen.

Do not persist state.

---

## 9. Screen 1 — Tip selection

### 9.1 Copy

Header:

```text
Intern Island
```

Subtitle:

```text
How much would you like to tip?
```

Security label:

```text
Secure payment
```

Show a small neutral lock icon next to `Secure payment`.

### 9.2 Tip options

Display a 3-column by 2-row grid:

```text
$2       $5       $10
$20      $1,000   Custom
```

Preset values:

```ts
const PRESET_TIPS_CENTS = [
  200,
  500,
  1000,
  2000,
  100000,
];
```

### 9.3 Recommended badge

The `$1,000` option must have a subtle badge above it:

```text
RECOMMENDED
```

The badge should:

- Float above or slightly overlap the top edge.
- Be visually restrained.
- Not change the button's dimensions.
- Not make the button dramatically brighter than the other options.

Suggested markup:

```tsx
<div className="tip-option-wrapper recommended">
  <span className="recommended-badge">Recommended</span>
  <button className="tip-option">$1,000</button>
</div>
```

### 9.4 Selected state

A selected amount should show:

- Accent border
- Light accent background
- Optional check icon
- Clear selected state that does not depend only on color

Do not use exaggerated scaling or bouncing.

### 9.5 Selected total

Show:

```text
Selected tip: $20
```

Use the actual selected amount.

### 9.6 Continue button

The primary action reads:

```text
Continue
```

It is disabled until an amount is selected.

On press:

1. Shuffle the six interns.
2. Create a fresh even allocation.
3. Navigate to the allocation screen.

---

## 10. Custom amount modal

Pressing `Custom` opens a modal over the tip-selection screen.

Do not include a keyboard-editable text field.

### 10.1 Modal contents

Include:

- Title: `Choose a custom amount`
- Large live amount display
- Logarithmic slider
- Scale labels
- Circular checkmark confirmation button
- Close control in the top-right
- Dimmed backdrop

Example:

```text
Choose a custom amount

              $1,000,000

$0      $10      $100      $1K      $10K      $100K      $1M
────────────────────────────────────────────────────────────●

                            ✓
```

### 10.2 Default value

The slider must open at the maximum:

```ts
const CUSTOM_MAX_CENTS = 100_000_000;
```

This equals `$1,000,000`.

### 10.3 Slider domain

Use a standard range input:

```ts
min = 0
max = 1000
step = 1
```

Map position to money using an exponential/logarithmic function.

Suggested implementation:

```ts
export function positionToAmountCents(position: number): number {
  if (position <= 0) return 0;
  if (position >= 1000) return 100_000_000;

  const normalized = position / 1000;
  const minDollars = 1;
  const maxDollars = 1_000_000;

  const logMin = Math.log10(minDollars);
  const logMax = Math.log10(maxDollars);

  const dollars =
    10 ** (logMin + normalized * (logMax - logMin));

  return Math.round(dollars * 100);
}
```

The far-left position is a special `$0` case because a logarithmic function cannot represent zero.

### 10.4 Snapping

Snap values to readable increments:

```ts
export function snapCustomAmountCents(amountCents: number): number {
  const dollars = amountCents / 100;

  let stepDollars: number;

  if (dollars < 10) stepDollars = 0.25;
  else if (dollars < 100) stepDollars = 1;
  else if (dollars < 1_000) stepDollars = 5;
  else if (dollars < 10_000) stepDollars = 25;
  else if (dollars < 100_000) stepDollars = 100;
  else stepDollars = 1_000;

  const snapped =
    Math.round(dollars / stepDollars) * stepDollars;

  return Math.max(
    0,
    Math.min(100_000_000, Math.round(snapped * 100))
  );
}
```

The slider is intentionally imprecise and biased toward large values. It is part of the joke.

### 10.5 Confirmation

Use a large circular checkmark button.

On confirmation:

1. Store the displayed custom amount.
2. Mark `Custom` as selected.
3. Close the modal.
4. Return to the tip-selection screen.
5. Leave the user on the tip-selection screen until `Continue` is pressed.

### 10.6 Closing behavior

The modal may be closed by:

- Close button
- `Escape`
- Clicking the backdrop

Closing without confirmation preserves the previously selected tip.

### 10.7 Accessibility

Use:

- `role="dialog"`
- `aria-modal="true"`
- Focus trap
- Focus return to the Custom button when dismissed
- Accessible label for the checkmark button

---

## 11. Screen 2 — Allocation

### 11.1 Entry behavior

Every time the allocation screen loads:

1. Shuffle the six interns.
2. Create a fresh equal allocation.
3. Discard any prior allocation state.

Do not randomize again while the participant is adjusting sliders.

### 11.2 Initial equal allocation

Use integer cents.

Example for `$10`:

```ts
1000 / 6 = 166 cents with 4 cents remainder
```

Result:

```ts
[167, 167, 167, 167, 166, 166]
```

Helper:

```ts
export function createEvenAllocation(
  totalCents: number,
  count: number
): number[] {
  const base = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  return Array.from({ length: count }, (_, index) =>
    base + (index < remainder ? 1 : 0)
  );
}
```

The sum must always equal the selected total exactly.

### 11.3 Copy

Header:

```text
Allocate your tip
```

Subtitle:

```text
Adjust how the total will be divided.
```

Show the total:

```text
Total: $20
```

### 11.4 Layout

Show six stacked horizontal rows.

Each row contains:

1. Circular portrait on the left
2. Horizontal slider in the center
3. Dollar amount on the right

Example:

```text
[photo]   ━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━   $3.25
[photo]   ━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━   $3.50
[photo]   ━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━   $2.75
```

Do not show:

- Names
- Percentages
- Titles
- Subtitles
- Rankings
- Locks
- Highest-allocation indicators

### 11.5 Portraits

Portrait requirements:

- Circular crop
- `object-fit: cover`
- Consistent size
- Neutral border
- No image inside the slider thumb
- Fallback placeholder on load error

Suggested desktop size:

```css
.intern-photo {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: cover;
}
```

Use a smaller size in compact-height mode.

### 11.6 Slider behavior

Each slider:

- Minimum: `0`
- Maximum: selected total
- Updates continuously while dragging
- Uses a large thumb suitable for touch
- Uses a thick track
- Displays no browser tooltip
- Updates all six displayed amounts immediately
- Uses a filled-track visual if practical

The participant may allocate the full tip to one intern.

All other interns may reach `$0`.

### 11.7 Dynamic allocation steps

Use:

```ts
export function getAllocationStepCents(
  totalCents: number
): number {
  if (totalCents < 25) return 1;

  const dollars = totalCents / 100;

  if (dollars < 100) return 25;
  if (dollars < 1_000) return 100;
  if (dollars < 10_000) return 500;
  if (dollars < 100_000) return 2_500;
  return 10_000;
}
```

This yields:

- Below `$0.25`: `$0.01`
- Below `$100`: `$0.25`
- `$100`–`$999.99`: `$1`
- `$1,000`–`$9,999.99`: `$5`
- `$10,000`–`$99,999.99`: `$25`
- `$100,000` and above: `$100`

The redistribution algorithm may produce other interns' values that are not exact multiples of the active slider's step. That is acceptable. Exact total preservation is more important.

### 11.8 Pay button

The bottom action reads:

```text
Pay $20
```

Use the actual selected total.

Pressing it immediately navigates to processing and prevents duplicate activation.

---

## 12. Allocation redistribution algorithm

This is the most important logic in the application.

### 12.1 Invariants

After every slider update:

- The sum of all six allocations equals the selected total.
- No allocation is negative.
- The changed allocation equals the requested clamped value.
- An intern may receive the entire total.
- Other interns may be `$0`.
- Money is redistributed as evenly as integer cents permit.

### 12.2 Main function

Implement:

```ts
export function updateAllocation(
  allocations: number[],
  changedIndex: number,
  requestedValueCents: number,
  totalCents: number
): number[]
```

### 12.3 Clamp the requested value

```ts
const newValue = Math.max(
  0,
  Math.min(requestedValueCents, totalCents)
);
```

### 12.4 Calculate delta

```ts
const oldValue = allocations[changedIndex];
const delta = newValue - oldValue;
```

If `delta === 0`, return the original values or a shallow copy.

---

### 12.5 Increasing one intern

If `delta > 0`:

- The other five interns must collectively lose `delta`.
- Reduce them equally.
- If an intern reaches zero, remove that intern from further reduction.
- Continue until the full amount has been transferred.

Use an iterative water-filling approach.

Suggested implementation:

```ts
function decreaseOthersEvenly(
  allocations: number[],
  excludedIndex: number,
  amountToRemove: number
): number[] {
  const result = [...allocations];
  let remaining = amountToRemove;

  let eligible = result
    .map((value, index) => ({ value, index }))
    .filter(
      item =>
        item.index !== excludedIndex &&
        item.value > 0
    )
    .map(item => item.index);

  while (remaining > 0 && eligible.length > 0) {
    const baseShare = Math.floor(
      remaining / eligible.length
    );
    const remainder = remaining % eligible.length;

    let removedThisRound = 0;

    for (
      let position = 0;
      position < eligible.length;
      position++
    ) {
      const index = eligible[position];
      const desiredRemoval =
        baseShare + (position < remainder ? 1 : 0);

      const actualRemoval = Math.min(
        desiredRemoval,
        result[index]
      );

      result[index] -= actualRemoval;
      removedThisRound += actualRemoval;
    }

    remaining -= removedThisRound;
    eligible = eligible.filter(
      index => result[index] > 0
    );

    if (removedThisRound === 0) {
      break;
    }
  }

  return result;
}
```

Then set:

```ts
result[changedIndex] = newValue;
```

Because the original allocations already sum to the selected total, the other interns collectively have enough money for any clamped value up to the total.

---

### 12.6 Decreasing one intern

If `delta < 0`:

- Compute `released = Math.abs(delta)`.
- Distribute the released cents equally among the other five interns.
- Assign any remainder cents to the first recipients in array order.

Suggested implementation:

```ts
function increaseOthersEvenly(
  allocations: number[],
  excludedIndex: number,
  amountToAdd: number
): number[] {
  const result = [...allocations];

  const recipients = result
    .map((_, index) => index)
    .filter(index => index !== excludedIndex);

  const baseShare = Math.floor(
    amountToAdd / recipients.length
  );
  const remainder =
    amountToAdd % recipients.length;

  recipients.forEach((index, position) => {
    result[index] +=
      baseShare + (position < remainder ? 1 : 0);
  });

  return result;
}
```

Then set the changed intern to the requested value.

---

### 12.7 Final consistency check

After each update:

```ts
const sum = result.reduce(
  (total, value) => total + value,
  0
);

const difference = totalCents - sum;
```

Normally `difference` should be zero.

If a small difference exists:

1. Apply it to the changed intern if doing so keeps that value between `0` and `totalCents`.
2. Otherwise apply it to the first other intern that can absorb it without becoming negative.
3. Assert in development that the final sum equals `totalCents`.

Do not silently allow mismatched totals.

### 12.8 Continuous updates

Use React `onChange` on the range input so values update continuously during drag.

Avoid CSS transitions on slider thumb positions because they may create lag or visual jitter.

---

## 13. Screen 3 — Simulated processing

Pressing `Pay $X` immediately enters the processing screen.

### 13.1 Processing sequence

Display these messages, one at a time, in this exact order:

1. `Preparing payment…`
2. `Checking with Finance…`
3. `Checking with Legal…`
4. `Escalating for approval…`
5. `Reviewing compensation policies…`

Suggested timings:

```ts
const PROCESSING_STEPS = [
  { text: "Preparing payment…", durationMs: 700 },
  { text: "Checking with Finance…", durationMs: 850 },
  { text: "Checking with Legal…", durationMs: 850 },
  { text: "Escalating for approval…", durationMs: 950 },
  {
    text: "Reviewing compensation policies…",
    durationMs: 1100,
  },
];
```

Total duration should be approximately 4–5 seconds.

### 13.2 Visual treatment

Use:

- Centered content
- Restrained spinner
- One line at a time
- Gentle fade between messages
- No progress percentage
- No intern portraits
- No back button
- No interaction during processing

### 13.3 Timer safety

All timers must be stored and cleaned up when:

- The processing component unmounts
- `R` is pressed
- The app resets
- A new processing run starts

A stale timer must never redirect the app after reset.

---

## 14. Screen 4 — Transaction declined

### 14.1 Heading

Always show:

```text
Transaction declined
```

Use a restrained error icon such as a circle containing an `×`.

Do not make the screen visually alarming.

### 14.2 Conditional body copy

For tips of `$50` or less:

```text
Your payment could not be authorized.
```

Condition:

```ts
selectedTipCents <= 5000
```

For tips over `$50`:

```text
Tip amount exceeds the approved internal appreciation budget.
```

Condition:

```ts
selectedTipCents > 5000
```

At exactly `$50`, use the authorization message.

### 14.3 Buttons

Show:

```text
Try again
Pay with appreciation
```

Recommended visual hierarchy:

- `Try again`: primary dark or accent-filled button
- `Pay with appreciation`: secondary outlined button

### 14.4 Try again behavior

`Try again`:

- Clears all state
- Returns to tip selection
- Leaves no amount selected
- Does not return to allocation

### 14.5 Pay with appreciation behavior

`Pay with appreciation` navigates to the separate appreciation screen.

---

## 15. Screen 5 — Appreciation confirmation

### 15.1 Copy

Show only:

```text
Your appreciation is noted.
```

A subtle checkmark icon is allowed.

Do not add:

- A Done button
- Intern allocations
- Payment details
- Explanatory text
- Confetti
- Sound
- Additional jokes

### 15.2 Automatic reset

Start a 15-second timer when this screen appears.

After exactly 15 seconds:

- Reset the app
- Return to tip selection
- Clear selected amount
- Clear allocations
- Clear intern order
- Clear timers

Pressing `R` resets immediately.

The appreciation timer must be canceled when the component unmounts or reset occurs.

---

## 16. Randomization

Use Fisher–Yates shuffle.

```ts
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (
    let index = copy.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [copy[index], copy[randomIndex]] = [
      copy[randomIndex],
      copy[index],
    ];
  }

  return copy;
}
```

Randomize:

- Every time the allocation screen loads
- After the participant presses Continue
- After a full reset, when allocation is next entered

Do not randomize while sliders are being adjusted.

---

## 17. Keyboard behavior

### 17.1 Global

- `R`: reset to tip selection
- `Escape`: close the custom modal if open
- Browser behavior may use `Escape` to leave full screen

### 17.2 Tip selection

- `Tab` moves among options
- `Enter` or `Space` selects an option
- `Enter` or `Space` activates Continue

### 17.3 Custom modal

- Arrow keys adjust the range slider
- `Enter` or `Space` activates the check button
- `Escape` closes the modal

### 17.4 Allocation

Use native range-input keyboard behavior:

- Left/Right arrows
- Home/End
- Tab between sliders
- Enter/Space on the Pay button

Do not override native keyboard controls unnecessarily.

---

## 18. Accessibility

Implement basic accessibility despite the controlled context.

Requirements:

- Use real `<button>` elements.
- Use native `<input type="range">` elements where possible.
- Add accessible labels to icon-only controls.
- Use `role="dialog"` and `aria-modal="true"` for the custom modal.
- Use an `aria-live="polite"` region for changing processing messages.
- Move focus to the decline heading when the screen appears.
- Move focus to the appreciation heading when the screen appears.
- Use `alt="Intern portrait"` for portraits.
- Do not rely only on color for selected states.
- Respect `prefers-reduced-motion`.
- Ensure visible focus styles for keyboard use.

---

## 19. Responsive behavior

The app is for a full-screen Dell XPS 15, not for mobile.

Target minimum viewport:

```text
1280 × 720
```

Preferred viewport:

```text
1920 × 1080
```

Requirements:

- No scrolling at the target viewport.
- All six allocation rows must be visible.
- The Pay button must remain visible.
- The modal must fit within the viewport.
- Tip buttons must remain large enough for touch.

Suggested compact-height CSS:

```css
@media (max-height: 760px) {
  .allocation-row {
    min-height: 68px;
  }

  .intern-photo {
    width: 58px;
    height: 58px;
  }

  .allocation-screen {
    gap: 8px;
  }
}
```

Suggested vertical budget at 720px height:

- Header: approximately 80–90px
- Six rows: approximately 65–75px each
- Footer/action area: approximately 80–90px
- Remaining space: padding and gaps

---

## 20. Animation rules

Allowed:

- 120–180ms button hover/selection transitions
- 150–250ms modal fade
- Gentle opacity transition between processing messages
- Spinner rotation
- Small, restrained state changes

Do not use:

- Confetti
- Bouncing
- Sound
- Portrait reactions
- Count-up animations
- Dramatic screen transitions
- Excessive scaling

The app should look credible until the decline copy appears.

---

## 21. Edge cases

### 21.1 Custom `$0`

Allow `$0`.

Behavior:

- Continue remains allowed.
- All six allocations are `$0`.
- Sliders are disabled or remain fixed at zero.
- Pay button reads `Pay $0`.
- Processing and decline still occur.

### 21.2 Very small totals

For totals below `$0.25`, use a one-cent slider step.

Some interns may begin at `$0`.

### 21.3 Totals below six cents

Distribute one cent to the first few interns in randomized order and zero to the rest.

### 21.4 Full allocation to one intern

Allow one intern to receive the entire selected amount.

All others become `$0`.

### 21.5 Missing image

If an intern image fails to load:

- Replace it with `/interns/placeholder.jpg`
- Preserve the same circular dimensions

### 21.6 Duplicate payment activation

The Pay button must not start multiple processing sequences.

Navigate synchronously or disable the button immediately after activation.

### 21.7 Reset during processing

Pressing `R` during processing must:

- Clear all active processing timers
- Return to tip selection
- Prevent delayed navigation to decline

### 21.8 Reset during appreciation

Pressing `R` during appreciation must cancel the 15-second reset timer before resetting.

---

## 22. Pure utility functions

Implement and export these as pure functions:

```ts
formatCurrency(cents: number): string

createEvenAllocation(
  totalCents: number,
  count: number
): number[]

getAllocationStepCents(
  totalCents: number
): number

updateAllocation(
  allocations: number[],
  changedIndex: number,
  requestedValueCents: number,
  totalCents: number
): number[]

positionToAmountCents(
  position: number
): number

snapCustomAmountCents(
  amountCents: number
): number

shuffle<T>(items: T[]): T[]

getDeclineMessage(
  selectedTipCents: number
): string
```

Suggested decline helper:

```ts
export function getDeclineMessage(
  selectedTipCents: number
): string {
  if (selectedTipCents > 5000) {
    return "Tip amount exceeds the approved internal appreciation budget.";
  }

  return "Your payment could not be authorized.";
}
```

---

## 23. Automated tests

Use Vitest.

### 23.1 Currency formatting

Test:

```text
200        -> $2
2550       -> $25.50
100000     -> $1,000
100000000  -> $1,000,000
```

### 23.2 Equal allocation

For `1000` cents across six interns:

- Result length is six
- Sum is exactly `1000`
- Maximum minus minimum is at most one cent

### 23.3 Increase redistribution

Starting with:

```ts
[100, 100, 100, 100, 100, 100]
```

Change index `0` to `200`.

Assert:

- Result sum is `600`
- Index `0` is `200`
- No value is negative
- Other values are as equal as possible

### 23.4 Zero-floor redistribution

Starting with:

```ts
[500, 20, 20, 20, 20, 20]
```

Increase index `0` to the full total.

Assert:

- Index `0` becomes `600`
- All others become `0`
- Sum remains `600`
- No negative values occur

### 23.5 Decrease redistribution

Starting with:

```ts
[500, 100, 100, 100, 100, 100]
```

Decrease index `0` to `250`.

Assert:

- Released `250` cents is distributed among the other five
- Sum remains constant
- Distribution differs by at most one cent

### 23.6 Slider mapping

Assert:

- Position `0` returns `$0`
- Position `1000` returns `$1,000,000`
- Values increase monotonically
- No result exceeds the maximum
- No result is negative

### 23.7 Decline copy

Assert:

- `$50` returns `Your payment could not be authorized.`
- `$50.01` returns `Tip amount exceeds the approved internal appreciation budget.`

### 23.8 Invariant/property-style tests

For many randomly generated valid allocations and slider changes:

- Sum always equals total
- No value is negative
- Changed value is clamped correctly
- Result length remains six

---

## 24. Manual acceptance checklist

### 24.1 Tip selection

- [ ] The app opens directly on the tip screen.
- [ ] The title reads `Intern Island`.
- [ ] The subtitle reads `How much would you like to tip?`
- [ ] A lock icon and `Secure payment` appear.
- [ ] The six options are `$2`, `$5`, `$10`, `$20`, `$1,000`, and `Custom`.
- [ ] `$1,000` has a subtle Recommended badge above it.
- [ ] No amount is selected initially.
- [ ] Continue is initially disabled.
- [ ] Selecting an amount clearly changes its state.
- [ ] Whole-dollar amounts omit `.00`.
- [ ] Continue enters allocation.

### 24.2 Custom modal

- [ ] Custom opens a modal.
- [ ] No text input appears.
- [ ] The slider starts at `$1,000,000`.
- [ ] The slider uses logarithmic/exponential mapping.
- [ ] The amount updates continuously.
- [ ] A circular checkmark confirms.
- [ ] Escape closes the modal.
- [ ] Backdrop click closes the modal.
- [ ] Confirming selects the amount but does not automatically continue.

### 24.3 Allocation

- [ ] Six circular portraits appear.
- [ ] The order changes every time allocation loads.
- [ ] Initial values are equal within one cent.
- [ ] The total is exact.
- [ ] Sliders update continuously.
- [ ] Increasing one amount reduces the others evenly.
- [ ] Interns at zero are excluded from further decreases.
- [ ] Decreasing one amount distributes released money evenly.
- [ ] No allocation becomes negative.
- [ ] One intern can receive the entire tip.
- [ ] The Pay button shows the selected total.
- [ ] All six rows and the Pay button fit without scrolling.

### 24.4 Processing

- [ ] The five messages appear in the specified order.
- [ ] Only one message appears at a time.
- [ ] Total duration is approximately 4–5 seconds.
- [ ] A restrained spinner appears.
- [ ] The participant cannot interact.
- [ ] Pressing `R` safely resets.
- [ ] No stale timer redirects after reset.

### 24.5 Decline

- [ ] Heading reads `Transaction declined`.
- [ ] Tips at or below `$50` use the authorization message.
- [ ] Tips above `$50` use the internal appreciation budget message.
- [ ] `Try again` returns to a fresh tip screen.
- [ ] `Pay with appreciation` opens a separate confirmation screen.

### 24.6 Appreciation

- [ ] The screen reads only `Your appreciation is noted.`
- [ ] There is no Done button.
- [ ] There is no extra explanatory text.
- [ ] The app resets automatically after 15 seconds.
- [ ] Pressing `R` resets immediately.

### 24.7 Global

- [ ] The app works by touch.
- [ ] Keyboard navigation works.
- [ ] The cursor hides after inactivity and returns on movement.
- [ ] Refresh resets the app.
- [ ] No payment service is contacted.
- [ ] No external network request is required.
- [ ] The interface looks professional and Square-inspired without copying branding.

---

## 25. Implementation order

Implement in this sequence:

1. Create the Vite React TypeScript project.
2. Add global styles and the application shell.
3. Add explicit screen-state routing.
4. Implement currency formatting.
5. Implement the tip-selection screen.
6. Implement the Recommended badge.
7. Implement the custom logarithmic slider modal.
8. Implement shuffle and hard-coded intern data.
9. Implement equal allocation.
10. Implement the allocation screen and portrait rows.
11. Implement redistribution logic.
12. Add unit tests for all allocation invariants.
13. Add the Pay button.
14. Implement the processing sequence and timer cleanup.
15. Implement conditional decline copy.
16. Implement Try again.
17. Implement the appreciation screen and 15-second timer.
18. Implement global `R` reset.
19. Implement cursor hiding.
20. Add accessibility behavior.
21. Add compact-height CSS.
22. Test at `1280 × 720`.
23. Test in full-screen mode on the actual Dell XPS 15.
24. Tune slider thumb size, row spacing, and typography based on physical touchscreen use.

---

## 26. Definition of done

The implementation is done when:

- It runs locally with a standard Vite development command.
- It requires no backend or payment credentials.
- It displays all five screens correctly.
- It preserves the exact selected total through every allocation change.
- It supports six randomized intern portraits.
- It works smoothly by touch at the target viewport.
- It passes all unit tests.
- It has no stale timer bugs.
- It resets correctly with `R`.
- It automatically resets from the appreciation screen after 15 seconds.
- It looks polished, restrained, and plausibly payment-terminal-like.
