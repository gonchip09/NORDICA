# 002 — Close the mobile menu instantly with Escape

- **Status**: TODO
- **Commit**: c8d7c5e
- **Severity**: HIGH
- **Category**: Purpose & frequency; easing & duration
- **Estimated scope**: 2 source files and one existing test file, about 20 lines

## Problem

The mobile navigation animates its opacity and position during every close, including Escape. Escape is a keyboard command and should respond immediately. Its current transition also uses the weak `220ms ease` token.

`css/styles.css:16-17` defines `--transition-fast: 220ms ease` and `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. The current navigation rules are:

```css
/* css/styles.css:60-61 — current */
.site-nav { position: absolute; top: 100%; left: 0; right: 0; padding: 1.5rem var(--page-gutter) 2rem; border-radius: 0.75rem; background: var(--color-background); color: var(--color-text); box-shadow: 0 1rem 2.5rem rgb(12 24 20 / 18%); opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(-0.75rem); transition: opacity var(--transition-fast), transform var(--transition-fast), visibility var(--transition-fast); }
.site-nav.is-open { opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0); }
```

```js
// js/main.js:4-24 — current excerpts
function closeMenu(restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  siteNav.classList.remove('is-open');
  if (restoreFocus) menuToggle.focus();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && siteNav.classList.contains('is-open')) closeMenu(true);
});
```

## Target

Escape hides the menu in the same rendering turn and restores focus to the toggle. Pointer opening and closing may retain a spatial transition using the existing strong `--ease-out` curve. The click transition takes 180 ms; the Escape close has no transition. Desktop navigation remains static.

```css
/* Replace only the .site-nav transition declaration. */
.site-nav {
  transition: opacity 180ms var(--ease-out), transform 180ms var(--ease-out), visibility 0s linear 180ms;
}
.site-nav.is-open {
  transition: opacity 180ms var(--ease-out), transform 180ms var(--ease-out), visibility 0s;
}
.site-nav.is-instant { transition: none; }
```

The target blocks above show transition declarations only; preserve every other existing declaration in those rules. In the desktop `@media (min-width: 1024px)` block, make the static override `.site-nav, .site-nav.is-open { transition: none; }`. Both selectors are needed because `.site-nav.is-open` has higher specificity than `.site-nav`.

```js
function closeMenu(restoreFocus = false, instant = false) {
  if (instant) siteNav.classList.add('is-instant');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  siteNav.classList.remove('is-open');
  if (restoreFocus) menuToggle.focus();
}

// Immediately before opening from the menu button:
siteNav.classList.remove('is-instant');

// Escape handler:
closeMenu(true, true);
```

The `is-instant` class may remain while the menu is closed. Remove it before the next pointer open so the opening transition remains available. If the browser does not animate the next pointer opening because style changes were batched, keep Escape instant and remove motion from the entire mobile menu instead; do not add timers or forced synchronous layout reads to restore an optional opening effect.

## Repo conventions to follow

- Reuse `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` from `css/styles.css:17`; do not create another easing token.
- `js/main.js:4-31` owns menu state, labels, focus restoration, link close, and resize close.
- `tests/header.test.js:74-90` already tests menu toggle and Escape focus. Extend those tests to assert `is-instant` on Escape and its removal on the next pointer open.

## Steps

1. In `css/styles.css`, replace only the mobile `.site-nav` transition values shown above. Add `.site-nav.is-instant { transition: none; }` before the desktop media query, and extend the desktop static override to `.site-nav, .site-nav.is-open { transition: none; }` while preserving the remaining desktop declarations.
2. In `js/main.js`, give `closeMenu` the `instant` argument, apply the class before removing `is-open`, and pass `true` for Escape. Remove `is-instant` just before a button-triggered open.
3. Extend the existing tests in `tests/header.test.js` to verify Escape sets the instant class and focus, and the next button open clears the class. Keep the existing ARIA assertions.
4. Update the `js/main.js` version query in all four HTML pages so the new keyboard behavior loads consistently.

## Boundaries

- Do not change menu markup, navigation destinations, ARIA names, focus restoration, or desktop layout.
- Do not add a motion library, timeout, or forced reflow just to preserve the optional click transition.
- Do not modify other keyboard interactions or global transition tokens.
- If the cited code differs from commit `c8d7c5e`, stop and reconcile this plan before editing.

## Verification

- **Mechanical**: run `node --test tests/*.test.js` and `git diff --check`; both must pass.
- **Feel check**: at a mobile width, open and close the menu with the button repeatedly. Opening should start promptly and settle in 180 ms. Then open it and press Escape: menu content must disappear immediately, and keyboard focus must return to the toggle. Open once more by button and check that it still works. Test at 10% playback in DevTools to confirm Escape has no traveling frame and pointer entry comes from above rather than center.
- **Reduced motion**: repeat with `prefers-reduced-motion: reduce`; Escape remains instant, the menu remains usable, and pointer movement is removed by the existing reduced-motion rules.
- **Done when**: Escape closure has no visible animation, focus and ARIA remain correct, and repeat pointer toggles work without stuck states.
