/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as per requirements
  const headerRow = ['Accordion (accordion30)'];

  // 2. Get all .filtered-content inner blocks
  const filteredSections = Array.from(element.querySelectorAll('.filtered-content'));

  // 3. Build a row for each accordion item
  const rows = filteredSections.map(section => {
    // Title cell: use the data-title attribute
    const title = section.getAttribute('data-title') || '';
    // Content cell: reference the .column-container (contains all content to be revealed)
    let contentCell;
    const colContainer = section.querySelector('.column-container');
    if (colContainer) {
      contentCell = [colContainer];
    } else {
      // fallback: section as whole
      contentCell = [section];
    }
    return [title, contentCell];
  });

  // 4. Assemble the table cells array
  const cells = [headerRow, ...rows];
  // 5. Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // 6. Replace the original element
  element.replaceWith(block);
}
