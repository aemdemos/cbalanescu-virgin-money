/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure primary column structure exists
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;
  const sl = columnContainer.querySelector('.sl');
  if (!sl) return;
  const slList = sl.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // First column: image block
  const firstCol = slItems[0];
  let imgEl = firstCol.querySelector('img');
  if (imgEl) {
    // Convert relative src to absolute
    if (imgEl.src && imgEl.src.startsWith('/')) {
      const a = document.createElement('a');
      a.href = imgEl.src;
      imgEl.src = a.href;
    }
  }

  // Second column: rich text block
  const secondCol = slItems[1];
  const richText = secondCol.querySelector('.cm-rich-text');
  // Defensive: if richText is missing, fallback to secondCol itself
  const rightColContent = richText || secondCol;

  // Table Header matches example
  const headerRow = ['Columns (columns44)'];
  // Table row: 2 columns (image, rich text)
  const columnsRow = [imgEl || '', rightColContent];

  // Build and replace
  const tableCells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
