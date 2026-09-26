# 001 — Remove motion from catalog filtering

- **Status**: TODO
- **Commit**: c8d7c5e
- **Severity**: HIGH
- **Category**: Purpose & frequency; interruptibility
- **Estimated scope**: 2 source files, about 12 lines

## Problem

Changing a catalog select recreates the result cards and animates every new card for 300 ms. Filtering is a repeated reading task: the cards should become readable immediately. Recreating cards also restarts the keyframe on every change.

```css
/* css/styles.css:336-337 — current */
.catalog__grid.is-filtering .catalog-card { animation: catalog-results-enter 300ms var(--ease-out) both; }
@keyframes catalog-results-enter { from { opacity: 0.4; transform: translateY(0.35rem); } to { opacity: 1; transform: translateY(0); } }
```

```js
// js/propiedades.js:102-111, 113-117, 131-134 — current excerpts
function render(animate = false) {
  const criteria = currentCriteria();
  const matches = filterProperties(properties, criteria);
  count.textContent = resultLabel(matches.length);
  grid.classList.toggle('is-filtering', animate);
  grid.innerHTML = matches.map(cardMarkup).join('');
  grid.hidden = matches.length === 0;
  empty.hidden = matches.length !== 0;
  syncUrl(criteria);
}

function clearFilters() {
  form.reset();
  setPriceOptions('');
  render(true);
}

form.addEventListener('change', (event) => {
  if (event.target === operation) setPriceOptions(operation.value);
  render(event.target.name !== 'ubicacion');
});
```

The `prefers-reduced-motion` block also contains `.catalog__grid.is-filtering .catalog-card { animation: none; }` at `css/styles.css:624`.

## Target

Every filter change, location keystroke, and clear action updates the count and result cards immediately. There is no `is-filtering` state, `catalog-results-enter` keyframe, or catalog-specific reduced-motion override. Keep the existing filtering, URL synchronization, empty state, and card markup.

```js
function render() {
  const criteria = currentCriteria();
  const matches = filterProperties(properties, criteria);
  count.textContent = resultLabel(matches.length);
  grid.innerHTML = matches.map(cardMarkup).join('');
  grid.hidden = matches.length === 0;
  empty.hidden = matches.length !== 0;
  syncUrl(criteria);
}

function clearFilters() {
  form.reset();
  setPriceOptions('');
  render();
}

form.addEventListener('change', (event) => {
  if (event.target === operation) setPriceOptions(operation.value);
  render();
});
```

Retain `render()` in the `input` handler and at initialization.

## Repo conventions to follow

- `css/styles.css:16-17` defines the motion tokens; this change needs no new token.
- `js/propiedades.js:102-110` owns catalog rendering and URL synchronization. Keep the latter in place.
- `css/styles.css:334` already handles `hidden` grid and empty states instantly.

## Steps

1. In `css/styles.css`, delete the selector and keyframe at lines 336-337 and the now-unused catalog reduced-motion override near line 624.
2. In `js/propiedades.js`, remove the `animate` parameter and `is-filtering` class toggle. Change `render(true)` and `render(event.target.name !== 'ubicacion')` to `render()`.
3. Search for `is-filtering` and `catalog-results-enter`; neither should remain.
4. Update the `js/propiedades.js` version query in `propiedades.html` so returning visitors receive the new behavior.

## Boundaries

- Do not change filter matching, pricing, count text, URLs, empty state, card content, or other scroll-reveal animations.
- Do not add a replacement animation or a dependency.
- If the cited code differs from commit `c8d7c5e`, stop and reconcile this plan before editing.

## Verification

- **Mechanical**: run `node --test tests/*.test.js` and `git diff --check`; both must pass. Confirm the search in step 3 is empty.
- **Feel check**: on `propiedades.html`, change operation, type, bedrooms, and price in quick succession. Results must be readable at once, without fading or vertical travel. Type and erase a location rapidly; cards and the count must keep up without delayed frames. Clear filters and confirm all cards return immediately.
- **Reduced motion**: repeat the filter sequence with `prefers-reduced-motion: reduce`; filtering behavior and timing should match normal mode.
- **Done when**: results never animate during filtering, and filtering, URL updates, and the empty state still work.
