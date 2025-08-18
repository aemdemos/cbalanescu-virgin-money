/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list within the container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get the .sl-item children (these represent columns)
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  const columns = slItems.map(item => {
    // Use the first (and only) child of .sl-item directly
    return item.firstElementChild || '';
  });

  // Compose the cells array:
  // - The first row is a single-cell array (header row),
  //   so that WebImporter.DOMUtils.createTable will create one <th> with colspan if needed
  // - The second row is the columns array
  const cells = [
    ['Columns (columns35)'],
    columns
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
