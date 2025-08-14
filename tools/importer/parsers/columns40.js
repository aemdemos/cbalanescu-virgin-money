/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the spec
  const headerRow = ['Columns (columns40)'];

  // Try to extract the two columns from the HTML structure
  // The structure is:
  // div.column-container > div.sl > div.sl-list.has-2-items > div.sl-item (2x)
  const slList = element.querySelector('.sl-list');
  let col1, col2;

  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    // Defensive: only proceed if there are exactly 2 items (2 columns)
    if (items.length === 2) {
      // Column 1: the image (as a node)
      // Prefer the <img> inside the first .sl-item
      const img = items[0].querySelector('img');
      col1 = img ? img : items[0]; // fallback: whole sl-item if img missing

      // Column 2: heading, text, and buttons (as nodes)
      // Extract content nodes in order, ignoring empty <p> and <small>
      const rich = items[1].querySelector('.cm-rich-text');
      let col2Content = [];
      if (rich) {
        // Heading
        const heading = rich.querySelector('h2');
        if (heading) col2Content.push(heading);
        // Paragraphs (ignore empty)
        const paragraphs = Array.from(rich.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
        col2Content.push(...paragraphs);
        // Table with app store links (responsive-table)
        const table = rich.querySelector('.responsive-table table');
        if (table) col2Content.push(table);
      } else {
        // fallback: use entire sl-item if .cm-rich-text not found
        col2Content = [items[1]];
      }
      col2 = col2Content;
    } else {
      // fallback: not expected, but support as single column
      col1 = element;
      col2 = [];
    }
  } else {
    // fallback: not expected, treat all as single column
    col1 = element;
    col2 = [];
  }

  // Compose the final cells array: header, then a single row of two columns
  const cells = [
    headerRow,
    [col1, col2]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
