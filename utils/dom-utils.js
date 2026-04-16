/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable no-param-reassign */

/**
 * Example Usage:
 *
 * domEl('main',
 *  div({ class: 'card' },
 *  a({ href: item.path },
 *    div({ class: 'card-thumb' },
 *     createOptimizedPicture(item.image, item.title, 'lazy', [{ width: '800' }]),
 *    ),
 *   div({ class: 'card-caption' },
 *      h3(item.title),
 *      p({ class: 'card-description' }, item.description),
 *      p({ class: 'button-container' },
 *       a({ href: item.path, 'aria-label': 'Read More', class: 'button primary' }, 'Read More'),
 *     ),
 *   ),
 *  ),
 * )
 */

/**
 * Helper for more concisely generating DOM Elements with attributes and children
 * @param {string} tag HTML tag of the desired element
 * @param  {[Object?, ...Element]} items: First item can optionally be an object of attributes,
 *  everything else is a child element
 * @returns {HTMLElement} The constructred DOM Element
 */
export function domEl(tag, ...items) {
  const element = document.createElement(tag);

  if (!items || items.length === 0) return element;

  if (
    !(items[0] instanceof Element || items[0] instanceof HTMLElement) && typeof items[0] === 'object') {
    const [attributes, ...rest] = items;
    items = rest;

    Object.entries(attributes).forEach(([key, value]) => {
      if (!key.toLowerCase().startsWith('on')) {
        element.setAttribute(key, Array.isArray(value) ? value.join(' ') : value);
      } else {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      }
    });
  }

  items.forEach((item) => {
    item = item instanceof Element
      || item instanceof HTMLElement ? item : document.createTextNode(item);
    element.appendChild(item);
  });

  return element;
}

/*
  More short hand functions can be added for very common DOM elements below.
  domEl function from above can be used for one off DOM element occurrences.
*/
/**
 * @returns {HTMLDivElement} The constructred DOM Element
 */
export function div(...items) {
  return domEl('div', ...items);
}
/**
 * @returns {HTMLParagraphElement} The constructred DOM Element
 */
export function p(...items) {
  return domEl('p', ...items);
}
/**
 * @returns {HTMLAnchorElement} The constructred DOM Element
 */
export function a(...items) {
  return domEl('a', ...items);
}
/**
 * @returns {HTMLHeadingElement} The constructred DOM Element
 */
export function h1(...items) {
  return domEl('h1', ...items);
}
/**
 * @returns {HTMLHeadingElement} The constructred DOM Element
 */
export function h2(...items) {
  return domEl('h2', ...items);
}
/**
 * @returns {HTMLHeadingElement} The constructred DOM Element
 */
export function h3(...items) {
  return domEl('h3', ...items);
}
/**
 * @returns {HTMLHeadingElement} The constructred DOM Element
 */
export function h4(...items) {
  return domEl('h4', ...items);
}
/**
 * @returns {HTMLHeadingElement} The constructred DOM Element
 */
export function h5(...items) {
  return domEl('h5', ...items);
}
/**
 * @returns {HTMLHeadingElement} The constructred DOM Element
 */
export function h6(...items) {
  return domEl('h6', ...items);
}
/**
 * @returns {HTMLUListElement} The constructred DOM Element
 */
export function ul(...items) {
  return domEl('ul', ...items);
}
/**
 * @returns {HTMLOListElement} The constructred DOM Element
 */
export function ol(...items) {
  return domEl('ol', ...items);
}
/**
 * @returns {HTMLLIElement} The constructred DOM Element
 */
export function li(...items) {
  return domEl('li', ...items);
}
export function i(...items) {
  return domEl('i', ...items);
}
/**
 * @returns {HTMLImageElement} The constructred DOM Element
 */
export function img(...items) {
  return domEl('img', ...items);
}
/**
 * @returns {HTMLSpanElement} The constructred DOM Element
 */
export function span(...items) {
  return domEl('span', ...items);
}
/**
 * @returns {HTMLFormElement} The constructred DOM Element
 */
export function form(...items) {
  return domEl('form', ...items);
}
/**
 * @returns {HTMLInputElement} The constructred DOM Element
 */
export function input(...items) {
  return domEl('input', ...items);
}
/**
 * @returns {HTMLLabelElement} The constructred DOM Element
 */
export function label(...items) {
  return domEl('label', ...items);
}
/**
 * @returns {HTMLButtonElement} The constructred DOM Element
 */
export function button(...items) {
  return domEl('button', ...items);
}
/**
 * @returns {HTMLDetailsElement} The constructred DOM Element
 */
export function details(...items) {
  return domEl('details', ...items);
}
/**
 * @returns {HTMLIFrameElement} The constructred DOM Element
 */
export function iframe(...items) {
  return domEl('iframe', ...items);
}
export function nav(...items) {
  return domEl('nav', ...items);
}
/**
 * @returns {HTMLFieldSetElement} The constructred DOM Element
 */
export function fieldset(...items) {
  return domEl('fieldset', ...items);
}
export function article(...items) {
  return domEl('article', ...items);
}
export function strong(...items) {
  return domEl('strong', ...items);
}
/**
 * @returns {HTMLSelectElement} The constructred DOM Element
 */
export function select(...items) {
  return domEl('select', ...items);
}
/**
 * @returns {HTMLOptionElement} The constructred DOM Element
 */
export function option(...items) {
  return domEl('option', ...items);
}
/**
 * @returns {HTMLDListElement} The constructred DOM Element
 */
export function dl(...items) {
  return domEl('dl', ...items);
}
export function dt(...items) {
  return domEl('dt', ...items);
}
export function dd(...items) {
  return domEl('dd', ...items);
}
/**
 * @returns {HTMLPictureElement} The constructred DOM Element
 */
export function picture(...items) {
  return domEl('picture', ...items);
}
/**
 * @returns {HTMLElement} The constructred DOM Element
 */
export function section(...items) {
  return domEl('section', ...items);
}
/**
 * @returns {HTMLSummaryElement} The constructred DOM Element
 */
export function summary(...items) {
  return domEl('summary', ...items);
}
/**
 * @returns {HTMLTableElement} The constructred DOM Element
 */
export function table(...items) {
  return domEl('table', ...items);
}
/**
 * @returns {HTMLTableSectionElement} The constructred DOM Element
 */
export function thead(...items) {
  return domEl('thead', ...items);
}
/**
 * @returns {HTMLTableSectionElement} The constructred DOM Element
 */
export function tbody(...items) {
  return domEl('tbody', ...items);
}
/**
 * @returns {HTMLTableRowElement} The constructred DOM Element
 */
export function tr(...items) {
  return domEl('tr', ...items);
}
/**
 * @returns {HTMLTableCellElement} The constructred DOM Element
 */
export function th(...items) {
  return domEl('th', ...items);
}
/**
 * @returns {HTMLTableCellElement} The constructred DOM Element
 */
export function td(...items) {
  return domEl('td', ...items);
}
export function search(...items) {
  return domEl('search', ...items);
}
/**
 * @returns {HTMLOutputElement} The constructred DOM Element
 */
export function output(...items) {
  return domEl('output', ...items);
}
/**
 * @returns {HTMLHRElement} The constructred DOM Element
 */
export function hr(...items) {
  return domEl('hr', ...items);
}
/**
 * @returns {HTMLTextAreaElement} The constructred DOM Element
 */
export function textarea(...items) {
  return domEl('textarea', ...items);
}