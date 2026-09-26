# Animation improvement plans

Based on the audit at commit `c8d7c5e`. Both plans are independent and may be executed in either order. Execute 001 first because it removes motion from the catalog's primary task; execute 002 next for keyboard responsiveness.

| Order | Plan | Severity | Status | Dependency |
| --- | --- | --- | --- | --- |
| 1 | [001 — Remove motion from catalog filtering](001-remove-catalog-filter-motion.md) | HIGH | TODO | None |
| 2 | [002 — Close the mobile menu instantly with Escape](002-instant-escape-menu.md) | HIGH | TODO | None |

Each plan contains exact edits, boundaries, and mechanical and visual verification. Reconcile a plan against current code if the site changes after commit `c8d7c5e`.
