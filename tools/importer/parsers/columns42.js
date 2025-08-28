/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly matching the spec
  const headerRow = ['Columns (columns42)'];

  // Get columns: these are .sl-item direct children inside .sl-list
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    items.forEach((item) => {
      // Each sl-item contains 1+ section.cm.cm-icon-title
      const sections = item.querySelectorAll(':scope > section.cm.cm-icon-title');
      // For each section, assemble all content into the cell
      const cellElements = [];
      sections.forEach((section) => {
        // Header section: contains image and heading
        const header = section.querySelector('.header');
        if (header) {
          // If there is an image in the header, add it
          const img = header.querySelector('img');
          if (img) {
            cellElements.push(img);
          }
          // If there is a heading (h2), add it
          const h2 = header.querySelector('h2');
          if (h2) {
            cellElements.push(h2);
          }
        }
        // Content section: contains paragraphs
        const content = section.querySelector('.content');
        if (content) {
          // Add each top-level child node (preserves any <p>, <sup>, etc)
          content.childNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              cellElements.push(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
              // If there is stray text, wrap in <span> for safety
              const span = document.createElement('span');
              span.textContent = node.textContent.trim();
              if (span.textContent) {
                cellElements.push(span);
              }
            }
          });
        }
      });
      columns.push(cellElements);
    });
  }

  // If there are no columns, preserve semantic meaning: create one empty cell per column
  if (columns.length === 0) {
    columns = [ [''], [''] ];
  }

  // The final table: header row, and a row with one cell per column
  const cells = [
    headerRow,
    columns
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
