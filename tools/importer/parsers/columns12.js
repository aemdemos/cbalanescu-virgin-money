/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW: exactly as the example
  const headerRow = ['Columns (columns12)'];

  // Find the main columns wrapper
  const mainColumnContainer = element.querySelector(':scope > .column-container');
  let columnEls = [];
  if (mainColumnContainer) {
    const sl = mainColumnContainer.querySelector(':scope > .sl');
    if (sl) {
      const slList = sl.querySelector(':scope > .sl-list');
      if (slList) {
        // Each .sl-item is a column (there should be two)
        const slItems = slList.querySelectorAll(':scope > .sl-item');
        slItems.forEach((slItem) => {
          // Gather all direct children (preserve structure & all text)
          const colContent = [];
          Array.from(slItem.children).forEach(child => colContent.push(child));
          // Sometimes, there can be text nodes only
          if (colContent.length === 0 && slItem.textContent.trim()) {
            colContent.push(document.createTextNode(slItem.textContent.trim()));
          }
          // If still empty, push empty string to keep structure
          columnEls.push(colContent.length === 1 ? colContent[0] : colContent);
        });
      }
    }
  }

  // Fallback: treat the whole element as a single column if above didn't work
  if (columnEls.length === 0) {
    const fallbackContent = [];
    Array.from(element.children).forEach(child => fallbackContent.push(child));
    if (fallbackContent.length === 0 && element.textContent.trim()) {
      fallbackContent.push(document.createTextNode(element.textContent.trim()));
    }
    columnEls.push(fallbackContent.length === 1 ? fallbackContent[0] : fallbackContent);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnEls
  ], document);

  element.replaceWith(table);
}
