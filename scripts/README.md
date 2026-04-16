# Scripts

Core JavaScript for page lifecycle and site-wide behavior. This directory contains the default EDS entry points (`aem.js`, `scripts.js`, `delayed.js`) plus project-specific additions.

## Default EDS Files

### aem.js

The Adobe Edge Delivery Services core library. **Modifications to this file should be minimal.** It provides the block/section decoration pipeline, icon handling, header/footer loading, and CSS loading utilities. Functions imported from here include `buildBlock`, `loadHeader`, `loadFooter`, `decorateIcons`, `decorateSections`, `decorateBlocks`, `decorateTemplateAndTheme`, `waitForFirstImage`, `loadSection`, `loadSections`, and `loadCSS`.

### scripts.js

Main entry point — called on every page load. Orchestrates the three-phase loading model (eager/lazy/delayed) and site-wide decoration.

Key behaviors beyond the EDS defaults:

- **Video URL collection** — at script load time (before any block runs), scans `<main>` for links matching video providers and collects them into `collectedVideoUrls`. These are passed to `buildVideoSchema` during the eager phase to inject VideoObject JSON-LD before blocks transform the DOM.
- **Fragment auto-blocking** — `buildAutoBlocks` finds `a[href*="/fragments/"]` links and dynamically replaces them with loaded fragment content.
- **Button decoration** — `decorateButtons` converts links inside `<strong>` or `<em>` formatting into styled button components (`.primary`, `.secondary`, `.accent`). Only triggers when the link text is the sole content of its paragraph and the text is not a raw URL.
- **Link decoration** — calls `decorateAllLinks` from `links.js` on the main element during the eager phase.

### delayed.js

Loaded 3 seconds after page load for non-critical work (analytics, martech, etc.). Currently a placeholder.

## Non-Default Additions

### links.js

Global link decorator that processes author-controlled hash-fragment directives on `<a>` elements. Authors add directives in the CMS URL hash; this module parses and applies them, then cleans the URL.

Supported directives:

| Hash fragment | Effect |
|---|---|
| `#_blank` | Sets `target="_blank"` with `rel="noopener noreferrer"` |
| `#_self` | Sets `target="_self"` |
| `#_css[btn,btn-primary]` | Adds CSS classes `btn` and `btn-primary` to the link |
| `#_text` | Strips all classes and removes the `button-container` wrapper |

Additional behaviors:
- Also reads a `?target=` query param as a fallback for setting link target
- External links and PDF links automatically get `target="_blank"` and `rel="noopener noreferrer"` unless an explicit target is already set
- External links keep absolute URLs; internal links are rewritten to relative paths

Exports: `decorateLinks(a)` for a single anchor, `decorateAllLinks(scope)` for all anchors in a container.

### configs.js

Environment-aware configuration system that reads key-value pairs from a CMS-authored `configs.json` sheet.

- `calcEnvironment()` — determines the current environment (`prod`, `dev`, `local`, `stage`, `qa`) based on the page URL. Non-prod environments can be overridden via `sessionStorage.setItem('environment', 'stage')`.
- `getConfig(environment?)` — fetches and caches (in sessionStorage) the full config array for the given or current environment. The sheet URL is `{origin}/configs.json?sheet={env}`.
- `getConfigValue(configParam, environment?)` — convenience to get a single value by key.
- `getCookie(cookieName)` / `deleteCookie(cookieName)` — cookie helpers co-located here for scripts that already import configs.

Uses `window-utils.js` for iframe-safe URL resolution.
