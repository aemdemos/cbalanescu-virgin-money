/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards8)'];
  const cells = [headerRow];

  // Find all card items (immediate children of .sl-list)
  const items = element.querySelectorAll('.sl-list > .sl-item');
  items.forEach((item) => {
    // Find the image (mandatory, first cell)
    const img = item.querySelector('img');

    // Find the card title (mandatory, second cell)
    const link = item.querySelector('a');
    let textFragments = [];
    if (link) {
      // Use heading if present
      const heading = link.querySelector('h2');
      if (heading) {
        textFragments.push(heading);
      } else if (link.textContent.trim()) {
        // fallback: use link text if heading not present
        const span = document.createElement('span');
        span.textContent = link.textContent.trim();
        textFragments.push(span);
      }
      // If there were other descriptive elements, they would be added here
    }
    // Defensive: if no heading or text, put empty text node
    if (textFragments.length === 0) {
      textFragments.push(document.createTextNode(''));
    }

    // Each row: [image, title/description/text]
    cells.push([img, textFragments]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
