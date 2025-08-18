/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header
  const headerRow = ['Hero (hero22)'];

  // Row 2: Background image - none present in the provided HTML
  const backgroundRow = [''];

  // Row 3: Main content cell
  // We'll collect: subtitle, title, description (paragraph), and CTA

  // Get direct children for robust extraction
  const children = Array.from(element.children);

  // Extract elements by class
  const title = children.find(el => el.classList.contains('header'));
  const subheading = children.find(el => el.classList.contains('subtitle'));
  const cta = children.find(el => el.classList.contains('cta'));

  // Find first non-empty <p> not inside another heading
  let description = null;
  for (const child of children) {
    if (
      child.tagName === 'P' &&
      child.textContent.trim().length > 0 &&
      !child.classList.contains('header')
    ) {
      description = child;
      break;
    }
  }

  // Compose the content cell, only adding elements that exist
  const contentParts = [];
  if (subheading) contentParts.push(subheading);
  if (title) contentParts.push(title);
  if (description) contentParts.push(description);
  if (cta) contentParts.push(cta);

  // Defensive: If nothing found, fallback to entire element content
  const contentRow = [contentParts.length ? contentParts : [element]];

  // Compose table rows
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  // Create & replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
