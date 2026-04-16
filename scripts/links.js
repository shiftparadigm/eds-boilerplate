/**
 * Global link decorator.
 *
 * Authors control link behavior via hash fragments in DA:
 *
 * Targets:
 *   #_blank           -> target="_blank"
 *   #_self            -> target="_self"
 *
 * CSS classes:
 *   #_css[btn,btn-primary] -> adds classes "btn" and "btn-primary"
 *
 * Remove styling:
 *   #_text            -> removes all classes + button-container wrapper
 */

const VALID_TARGETS = ['_blank', '_self', '_parent', '_top'];

export function decorateLinks(a) {
  let url;
  try {
    url = new URL(a.getAttribute('href'), window.location.href);
  } catch (e) {
    return;
  }

  let target;
  const cssClasses = [];
  let stripClasses = false;

  if (url.hash) {
    const decodedHash = decodeURIComponent(url.hash);
    const parts = decodedHash.split('#').filter(Boolean);
    const remaining = [];

    parts.forEach((part) => {
      const lower = part.toLowerCase();

      if (!target && VALID_TARGETS.includes(lower)) {
        target = lower;
        return;
      }

      const cssMatch = part.match(/^_css\[([^\]]+)\]$/i);
      if (cssMatch) {
        cssMatch[1].split(',').forEach((cls) => {
          const trimmed = cls.trim();
          if (trimmed) cssClasses.push(trimmed);
        });
        return;
      }

      if (lower === '_text') {
        stripClasses = true;
        return;
      }

      if (!part.startsWith('_')) {
        remaining.push(part);
      }
    });

    url.hash = remaining.length ? `#${remaining.join('#')}` : '';
  }

  if (url.searchParams.has('target')) {
    target = `_${url.searchParams.get('target').replace('_', '')}`;
    url.searchParams.delete('target');
  }

  if (target) {
    a.target = target;
    if (target === '_blank') a.rel = 'noopener noreferrer';
  }

  if (stripClasses) {
    a.className = '';
    a.parentElement?.classList?.remove('button-container');
  } else if (cssClasses.length > 0) {
    cssClasses.forEach((cls) => a.classList.add(cls));
  }

  const isExternal = url.hostname !== window.location.hostname;
  a.setAttribute(
    'href',
    isExternal ? url.href : url.pathname + url.search + url.hash,
  );

  const isPDF = url.pathname.toLowerCase().endsWith('.pdf');
  if (!a.target && (isExternal || isPDF)) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  }
}

export function decorateAllLinks(scope) {
  scope.querySelectorAll('a[href]').forEach((a) => decorateLinks(a));
}
