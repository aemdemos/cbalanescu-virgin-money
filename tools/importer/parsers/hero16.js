/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero16)'];

  // 2. Background image row (none in this HTML, so empty string)
  const bgRow = [''];

  // 3. Content row: Title, Subheading, CTA
  // Defensive: get children in order
  const children = Array.from(element.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ''));

  // Title (h1 with nested p > span > b)
  let title = null;
  for (const node of children) {
    if (node.tagName && node.tagName.toLowerCase() === 'h1') {
      // Use the h1 as-is, but flatten if it only contains a p/span/b
      // Remove the wrapping <p> if present
      const h1 = node;
      if (h1.childNodes.length === 1 && h1.firstElementChild && h1.firstElementChild.tagName.toLowerCase() === 'p') {
        // Use the <p> contents
        const p = h1.firstElementChild;
        if (p.childNodes.length === 1 && p.firstElementChild && p.firstElementChild.tagName.toLowerCase() === 'span') {
          // Use the <span> contents
          const span = p.firstElementChild;
          if (span.childNodes.length === 1 && span.firstElementChild && span.firstElementChild.tagName.toLowerCase() === 'b') {
            // Use the <b> contents
            title = document.createElement('h1');
            title.append(span.firstElementChild.cloneNode(true));
          } else {
            title = document.createElement('h1');
            title.append(span.cloneNode(true));
          }
        } else {
          title = document.createElement('h1');
          title.append(...p.childNodes);
        }
      } else {
        title = h1.cloneNode(true);
      }
      break;
    }
  }

  // Subheading (span.subtitle)
  let subheading = null;
  for (const node of children) {
    if (node.tagName && node.tagName.toLowerCase() === 'span' && node.classList.contains('subtitle')) {
      subheading = node;
      break;
    }
  }

  // Description (first non-empty <p> after h1)
  let description = null;
  for (const node of children) {
    if (node.tagName && node.tagName.toLowerCase() === 'p' && node.textContent.trim().length > 0) {
      description = node;
      break;
    }
  }

  // CTA (span.cta)
  let cta = null;
  for (const node of children) {
    if (node.tagName && node.tagName.toLowerCase() === 'span' && node.classList.contains('cta')) {
      cta = node;
      break;
    }
  }

  // Compose content cell
  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  const contentRow = [contentCell];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
