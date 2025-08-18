/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const cells = [['Cards (cards19)']];

  // 2. Find all cards
  const items = element.querySelectorAll(':scope .sl-list > .sl-item');

  items.forEach(item => {
    // Find image (required)
    const img = item.querySelector('img');
    let imgElem = img ? img : '';

    // Find the link (for possible CTA or to wrap title)
    const a = item.querySelector('a');
    // Find the h2 title
    const h2 = item.querySelector('h2');
    let textFrag;
    if (h2 && a) {
      // Compose title as a link (usually Cards block titles are not inside links, but HTML uses link)
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = h2.textContent;
      // Use heading semantics for the card title
      const titleEl = document.createElement('strong');
      titleEl.appendChild(link);
      textFrag = [titleEl];
    } else if (h2) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = h2.textContent;
      textFrag = [titleEl];
    } else {
      // Fallback: nothing found
      textFrag = [];
    }
    // No description or secondary text found
    cells.push([
      imgElem,
      textFrag.length > 0 ? textFrag : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
