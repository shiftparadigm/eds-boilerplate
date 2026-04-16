# Utils

Shared utility modules imported by blocks and scripts throughout the project. Each file is a self-contained ES module with no build step — import individual functions as needed.

## Modules

### cookie-utils.js

Single default export `getCookie(cookieName)` that reads a value from `document.cookie` by name. Use this in blocks; for scripts-level cookie access see `configs.js` which has its own `getCookie`/`deleteCookie`.

### dom-utils.js

Programmatic DOM element factory originally from Adobe. The core function `domEl(tag, ...items)` creates an element with optional attributes (first argument as a plain object) and child elements. Attribute keys starting with `on` are registered as event listeners instead of HTML attributes.

Convenience wrappers are exported for common tags: `div`, `p`, `a`, `h1`–`h6`, `ul`, `ol`, `li`, `img`, `span`, `form`, `input`, `label`, `button`, `details`, `summary`, `iframe`, `nav`, `fieldset`, `article`, `strong`, `select`, `option`, `dl`, `dt`, `dd`, `picture`, `section`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `search`, `output`, `hr`, `textarea`, `i`.

Usage pattern — nest calls to build a tree in a single expression:

```js
import { div, a, h3, p } from '../utils/dom-utils.js';

div({ class: 'card' },
  a({ href: item.path },
    h3(item.title),
    p(item.description),
  ),
);
```

### json-schema-utils.js

Single default export `addLinkedDataSchema(schema)` that injects a `<script type="application/ld+json">` tag into `<head>`. Automatically wraps the object with `@context: "https://schema.org"`. Used by `video-utils.js` and available for any block that needs structured data.

### video-utils.js

Video URL handling and Schema.org VideoObject generation. Two logical halves:

**URL utilities** — detect and normalize video URLs across providers:

- `extractYouTubeId(url)` / `extractVimeoId(url)` — parse IDs from various URL formats
- `detectVideoType(url)` — returns `{ type, url, id }` where type is `youtube`, `vimeo`, `mp4`, or `gif`
- `normalizeVideoUrl(url)` — canonical form for deduplication
- `isSameVideo(url1, url2)` — comparison helper

**Schema generation** — enrich pages with VideoObject structured data:

- `buildVideoSchema(videoUrls, addSchema)` — fetches metadata from `/video-schema.json` (a CMS-authored sheet), matches entries to URLs via normalization, and calls `addSchema` (typically `addLinkedDataSchema`) for each match. Tracks processed URLs to avoid duplicates across calls.
- `parseDateToISO(dateString)` / `parseDurationToISO8601(durationString)` — format helpers for schema fields

The video schema sheet columns are: `Video URL`, `Name`, `Description`, `Thumbnail URL`, `Upload Date`, `Duration` (format: `2h30m5s`).

### window-utils.js

Handles the AEM block library iframe context where `window.location.href === 'about:srcdoc'`:

- `getWindow()` — returns `window.parent` when inside the library iframe, `window` otherwise
- `getOrigin()` — true origin accounting for iframe context
- `getHref()` — full href; inside the library iframe reads the `path` query param from the parent URL

These are used by `configs.js` and any code that needs the real page URL regardless of rendering context.
