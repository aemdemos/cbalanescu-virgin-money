/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;
  // Find the sl-list that contains the columns
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  // Get all immediate .sl-item children (these are the columns)
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // For each column, gather all direct children as content for that cell
  // For the right column, also include the accordion (section.cm-accordion), which is a sibling of the last sl-item
  const contentRow = slItems.map((slItem, idx) => {
    // Start with all children of slItem
    const children = Array.from(slItem.children);
    // If this is the last column, check for additional siblings (accordion)
    if (idx === slItems.length - 1) {
      let sibling = slItem.nextElementSibling;
      while (sibling) {
        // Only include <section> with class cm-accordion
        if (
          sibling.tagName.toLowerCase() === 'section' &&
          sibling.classList.contains('cm-accordion')
        ) {
          children.push(sibling);
        }
        sibling = sibling.nextElementSibling;
      }
    }
    // If only one element, just return that element, else return an array
    return children.length === 1 ? children[0] : children;
  });

  // Build the header row
  const headerRow = ['Columns (columns10)'];

  // Build the table and replace the element
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(block);
}