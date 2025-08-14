/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level list (should be ul.nav-footer.has-3-items)
  const list = element.querySelector('ul.nav-footer');
  if (!list) return;

  // Get the three <li>s (columns)
  const columns = Array.from(list.children);

  // For each column, reference the existing title <span> and the <ul> (or social links)
  const cells = columns.map(col => {
    // The column container
    const cellContent = [];
    // Title (span)
    const title = Array.from(col.children).find(child => child.tagName === 'SPAN');
    if (title) cellContent.push(title);

    // List of links (ul)
    const linkList = Array.from(col.children).find(child => child.tagName === 'UL');
    if (linkList) {
      cellContent.push(linkList);
      return cellContent;
    }
    // Social links column: list of <a> inside <ul><li>...</li></ul> (sometimes ul might be missing)
    // If no <ul>, search for <a> links directly
    const anchors = col.querySelectorAll('a');
    if (anchors.length) {
      // Create a container div to preserve structure
      const iconsDiv = document.createElement('div');
      anchors.forEach(a => {
        iconsDiv.appendChild(a);
      });
      cellContent.push(iconsDiv);
    }
    return cellContent;
  });

  // Create the block table
  const headerRow = ['Columns (columns11)'];
  // Each table row (not header) should be an array of N columns (one per major column)
  const data = [headerRow, cells];
  const table = WebImporter.DOMUtils.createTable(data, document);

  element.replaceWith(table);
}
