/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header for Columns block, as per the spec and example
  const headerRow = ['Columns (columns39)'];

  // 2. Find the .sl-list container holding the columns
  let slList = element.querySelector('.sl-list');
  if (!slList) {
    // fallback: no .sl-list found
    return;
  }

  // 3. Get all immediate .sl-item children (these are the columns)
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));

  // 4. For each .sl-item, reference the .cm-content-panel-container directly
  //    This preserves structure and semantics such as headings, text, and links
  //    If .cm-content-panel-container not found, fallback to the .sl-item itself
  const contentCells = slItems.map(item => {
    const panel = item.querySelector('.cm-content-panel-container');
    return panel || item;
  });

  // 5. If there are no columns, do not replace the block
  if (!contentCells.length) return;

  // 6. Construct the block table: first row header, second row all columns
  const cells = [
    headerRow,
    contentCells
  ];

  // 7. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
