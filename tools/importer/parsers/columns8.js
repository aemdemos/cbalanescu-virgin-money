/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns8)'];

  // Defensive: find the two columns in the source HTML
  // The structure is: .column-container > .sl > .sl-list > .sl-item x2
  const slList = element.querySelector('.sl-list');
  let firstColContent = null;
  let secondColContent = null;

  if (slList) {
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    if (slItems.length >= 2) {
      // First column: .cm-rich-text
      firstColContent = slItems[0].querySelector('.cm-rich-text') || slItems[0];
      // Second column: .cq-dd-paragraph > section.cm-links-related
      const secondColWrap = slItems[1].querySelector('.cq-dd-paragraph');
      if (secondColWrap) {
        // Use the section.cm-links-related if present, else the wrapper
        secondColContent = secondColWrap.querySelector('section.cm-links-related') || secondColWrap;
      } else {
        secondColContent = slItems[1];
      }
    }
  }

  // Fallback: if structure is not as expected, just use all children
  if (!firstColContent || !secondColContent) {
    const children = Array.from(element.children);
    firstColContent = children[0] || document.createElement('div');
    secondColContent = children[1] || document.createElement('div');
  }

  // Build the table rows
  const rows = [
    headerRow,
    [firstColContent, secondColContent],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
