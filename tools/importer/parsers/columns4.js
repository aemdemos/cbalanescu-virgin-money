/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main column container. If not found, fallback to element itself.
  let container = element.querySelector('.column-container');
  if (!container) container = element;

  // 2. Find the block with the two columns (one with heading, one with contacts)
  let sl = container.querySelector('.sl.has-top-border');
  if (!sl) sl = container;

  // 3. The list holding the two columns
  const slList = sl.querySelector('.sl-list');
  if (!slList) return;

  // 4. Find all top-level column items
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // Left column: the first .sl-item contains the heading
  let leftCol = slItems[0].querySelector('.cm-rich-text') || slItems[0];
  // Defensive: if no heading, fallback to slItems[0] itself
  if (!leftCol) leftCol = slItems[0];

  // Right column: the second .sl-item contains multiple help sections
  let rightCol = slItems[1];
  let rightCellContent = [];
  // Gather all .cm-icon-title sections. If none found, rightCol itself
  const helpSections = Array.from(rightCol.querySelectorAll(':scope > section.cm.cm-icon-title'));
  if (helpSections.length > 0) {
    helpSections.forEach((section, idx) => {
      if (idx > 0) rightCellContent.push(document.createElement('br'));
      rightCellContent.push(section);
    });
  } else {
    rightCellContent = [rightCol];
  }

  // 5. Header row exactly: Columns (columns4)
  const headerRow = ['Columns (columns4)'];
  // 6. Data row: two columns, as per structure
  const dataRow = [leftCol, rightCellContent];

  // 7. Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    dataRow
  ], document);

  // 8. Replace the original element with the new table
  element.replaceWith(table);
}
