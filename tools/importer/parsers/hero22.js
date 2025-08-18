/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW (block name)
  const headerRow = ['Hero (hero22)'];

  // IMAGE ROW (optional background image)
  // For this HTML, there is no background image, so use empty string
  const imageRow = [''];

  // CONTENT ROW: Collect title, subheading, description, CTA, maintaining order and referencing elements
  // Use only direct children for robustness
  const children = Array.from(element.children);
  let titleEl = null;
  let subheadingEl = null;
  let descEl = null;
  let ctaEl = null;

  // Find title (h1)
  for (const child of children) {
    if (child.tagName && child.tagName.toLowerCase() === 'h1') {
      titleEl = child;
      break;
    }
  }

  // Find subheading (subtitle span)
  for (const child of children) {
    if (child.classList && child.classList.contains('subtitle')) {
      subheadingEl = child;
      break;
    }
  }

  // Find description (first <p> with text)
  for (const child of children) {
    if (
      child.tagName &&
      child.tagName.toLowerCase() === 'p' &&
      child.textContent.trim().length > 0
    ) {
      descEl = child;
      break;
    }
  }

  // Find CTA (span.cta)
  for (const child of children) {
    if (child.classList && child.classList.contains('cta')) {
      ctaEl = child;
      break;
    }
  }

  // Compose the cell, preserving order as in the example
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (subheadingEl) contentCell.push(document.createElement('br'), subheadingEl);
  if (descEl) contentCell.push(document.createElement('br'), descEl);
  if (ctaEl) contentCell.push(document.createElement('br'), ctaEl);

  // Make sure not to add extra <br> at start if title is missing
  const filteredContentCell = [];
  let first = true;
  for (let i = 0; i < contentCell.length; i++) {
    if (contentCell[i].tagName === 'BR') {
      if (first) continue;
    } else {
      first = false;
    }
    filteredContentCell.push(contentCell[i]);
  }

  // Final table
  const tableCells = [headerRow, imageRow, [filteredContentCell]];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
