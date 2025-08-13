/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns (columns40)'];

  // Find the two sl-item columns
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? slList.querySelectorAll(':scope > .sl-item') : [];

  // Edge case: if there are < 2 columns, fallback to empty
  let col1Content = null;
  let col2Content = null;

  if (slItems.length > 0) {
    // First column (usually image)
    const imgSection = slItems[0].querySelector('.cm-image');
    if (imgSection) {
      // Find any img inside .cm-image
      const img = imgSection.querySelector('img');
      if (img) col1Content = img;
      else col1Content = imgSection; // fallback: section itself
    } else {
      col1Content = slItems[0]; // fallback: whole column
    }
  }

  if (slItems.length > 1) {
    // Second column: rich text and app store buttons
    const richContent = slItems[1].querySelector('.cm-rich-text');
    if (richContent) {
      // Compose a fragment to include all relevant content
      const frag = document.createDocumentFragment();
      // Get heading(s) and paragraphs in order
      Array.from(richContent.children).forEach((child) => {
        if (
          child.tagName === 'P' && child.textContent.trim() === ''
        ) {
          // skip empty p
        } else {
          frag.appendChild(child);
        }
      });
      // Also add any responsive-table (app store links)
      const tableWrap = richContent.querySelector('.responsive-table');
      if (tableWrap) {
        frag.appendChild(tableWrap);
      }
      col2Content = frag.childNodes.length ? Array.from(frag.childNodes) : richContent;
    } else {
      col2Content = slItems[1]; // fallback: whole column
    }
  }

  // Compose the columns row
  const columnsRow = [col1Content, col2Content];

  // Ensure both columns exist as required
  if (columnsRow.length < 2) {
    // add placeholders if needed
    while (columnsRow.length < 2) columnsRow.push('');
  }

  const cells = [
    headerRow,
    columnsRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
