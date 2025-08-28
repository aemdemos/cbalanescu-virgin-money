/* global WebImporter */
export default function parse(element, { document }) {
  // Find each card block (sl-item), each contains a section.cm-content-tile
  const cardItems = element.querySelectorAll('.sl-item');
  const headerRow = ['Cards (cards26)'];
  const rows = [];

  cardItems.forEach(item => {
    // Get the card image (mandatory)
    const img = item.querySelector('.image img');
    // Get the card text content (mandatory)
    const contentDiv = item.querySelector('.content');
    // Reference the original nodes instead of cloning
    let textCell;
    if (contentDiv) {
      // We want all child nodes of .content except empty text
      // We'll build a document fragment to preserve structure
      textCell = document.createDocumentFragment();
      Array.from(contentDiv.childNodes).forEach(node => {
        // Only include non-empty text nodes and elements
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          textCell.appendChild(node);
        }
      });
    } else {
      textCell = '';
    }
    rows.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
