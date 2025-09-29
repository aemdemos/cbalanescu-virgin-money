/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children by selector
  function getDirectChildrenBySelector(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the main column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the .sl-list (the row of columns)
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get the .sl-item elements (the columns)
  const slItems = getDirectChildrenBySelector(slList, '.sl-item');
  if (!slItems.length) return;

  // Prepare the header row
  const headerRow = ['Columns (columns35)'];

  // Prepare the columns for the second row
  const columns = slItems.map((item) => {
    const fragment = document.createDocumentFragment();
    // If the item has a section.cm.cm-image, use that (image column)
    const imageSection = item.querySelector('section.cm.cm-image');
    if (imageSection) {
      const img = imageSection.querySelector('img');
      if (img) fragment.appendChild(img);
    }
    // If the item has a .cm-rich-text, use its content (text + app store buttons)
    const richText = item.querySelector('.cm-rich-text');
    if (richText) {
      Array.from(richText.children).forEach(child => {
        // Skip empty headings/paras
        if ((child.tagName === 'H2' || child.tagName === 'P' || child.tagName === 'SMALL') && !child.textContent.trim()) return;
        // For the table of app store buttons, flatten the table into its cell contents
        if (child.classList.contains('responsive-table')) {
          // Find the actual table
          const innerTable = child.querySelector('table');
          if (innerTable) {
            // Get all cells from the first row
            const firstRow = innerTable.querySelector('tr');
            if (firstRow) {
              Array.from(firstRow.children).forEach(td => {
                // Append all children of the cell (e.g., links, images)
                Array.from(td.childNodes).forEach(node => {
                  fragment.appendChild(node.cloneNode(true));
                });
              });
            }
          }
        } else {
          fragment.appendChild(child.cloneNode(true));
        }
      });
    }
    // If only one node, return that node, else fragment
    return fragment.childNodes.length === 1 ? fragment.firstChild : fragment;
  });

  // Build the table rows
  const rows = [
    headerRow,
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
