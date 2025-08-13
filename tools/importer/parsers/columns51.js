/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, per requirements
  const headerRow = ['Columns (columns51)'];

  // Find the list of columns (direct children of .sl-list)
  const slList = element.querySelector('.sl-list');
  let items = [];
  if (slList) {
    items = Array.from(slList.children);
  }

  // Each column in the block corresponds to an .sl-item child
  const contentRow = items.map(item => {
    // Per guidelines, just reference the immediate child (should be div.cm-rich-text or section.cm-icon-title)
    if (item.children.length === 1) {
      return item.firstElementChild;
    }
    // If for some reason, extra structure, return the .sl-item itself
    return item;
  });

  // Compose the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
