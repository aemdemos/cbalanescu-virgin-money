/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [
    ['Cards (cards21)']
  ];

  // Get all cards (direct children)
  const items = element.querySelectorAll(':scope > .sl-list > .sl-item');

  items.forEach((item) => {
    // Find image
    const img = item.querySelector('img');

    // Find anchor containing the content
    const anchor = item.querySelector('a');
    // Prefer to reference the heading element (h2) directly from within the anchor
    let heading = null;
    if (anchor) {
      heading = anchor.querySelector('h2, h3, h4, h5, h6, .header');
    }

    // The title (required, from heading)
    let titleElem = null;
    if (heading) {
      titleElem = heading;
    }

    // Compose the title as a link if possible, using the anchor's href
    let textCell;
    if (titleElem && anchor && anchor.href) {
      // Wrap title in an <a> referencing the original anchor
      const link = document.createElement('a');
      link.href = anchor.href;
      link.innerHTML = titleElem.textContent;
      textCell = link;
    } else if (titleElem) {
      textCell = titleElem;
    } else {
      // Fallback: use anchor text or empty
      textCell = anchor ? anchor.textContent : '';
    }
    cells.push([img || '', textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
