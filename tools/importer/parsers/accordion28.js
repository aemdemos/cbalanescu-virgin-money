/* global WebImporter */
export default function parse(element, { document }) {
  // ACCORDION BLOCK HEADER
  const headerRow = ['Accordion (accordion28)'];

  // Find all accordion items (each .filtered-content block)
  const filteredItems = Array.from(element.querySelectorAll('.filtered-content'));

  // Compose block table rows per accordion item
  const rows = filteredItems.map((item) => {
    // TITLE CELL: data-title attribute (mandatory)
    let title = item.getAttribute('data-title');
    // Fallback: get h3 inside item
    if (!title) {
      const h3 = item.querySelector('h3');
      title = h3 ? h3.textContent.trim() : '';
    }
    // Create a div for the title to ensure semantic meaning and allow rich formatting (should not create with hardcoded string)
    const titleElem = document.createElement('div');
    titleElem.textContent = title;

    // CONTENT CELL: take the entire .column-container inside item
    const contentElem = item.querySelector('.column-container');
    // If content missing, fallback to empty div
    const bodyCell = contentElem ? contentElem : document.createElement('div');

    return [titleElem, bodyCell];
  });

  // Compose the full table for the block
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with new block table
  element.replaceWith(block);
}
