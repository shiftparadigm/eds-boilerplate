let localWindow = null;

export function getWindow() {
  localWindow = window.location.href === 'about:srcdoc'
    ? window.parent
    : window;
  return localWindow;
}

/**
 * Returns the true origin of the current page in the browser.
 * If the page is running in an iframe with srcdoc, the ancestor origin is returned.
 * @returns {string} The true origin
 */
export function getOrigin() {
  return getWindow().location.origin;
}

/**
 * Returns the true href of the current page in the browser.
 * If the page is running in an iframe with srcdoc,
 * the ancestor origin + the path query param is returned.
 *
 * @returns {string} The href of the current page or the href of the block running in the library
 */
export function getHref() {
  if (window.location.href !== 'about:srcdoc') {
    return window.location.href;
  }

  const { location: parentLocation } = window.parent;
  const urlParams = new URLSearchParams(parentLocation.search);

  return `${parentLocation.origin}${urlParams.get('path')}`;
}
