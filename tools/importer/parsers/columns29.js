/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header: match exactly
  const headerRow = ['Columns (columns29)'];

  // 2. Locate columns structure
  // The parent element has .column-container > .sl > .sl-list.has-2-items > .sl-item (x2)
  const list = element.querySelector('.column-container .sl .sl-list');
  if (!list) return;
  const items = Array.from(list.children);

  // 3. For each column, extract ALL direct content as elements, preserve order and formatting
  const colCells = items.map(item => {
    // If there are multiple children, gather them in order
    // For the first column: two .cm-rich-text blocks
    // For the second column: image block
    const children = Array.from(item.children);
    // Filter out empty wrappers (for robustness)
    const filtered = children.filter(el => {
      // Remove empty wrappers (like empty divs)
      if (el.childElementCount === 0 && !el.textContent.trim()) return false;
      return true;
    });
    // If only one child and it's an image block, return the image only
    if (filtered.length === 1) {
      const img = filtered[0].querySelector('img');
      if (img) return img;
    }
    // Otherwise, return all non-empty children
    return filtered;
  });

  // 4. Table: header, then a content row with cols
  const cells = [headerRow, colCells];

  // 5. Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element
  element.replaceWith(block);
}
