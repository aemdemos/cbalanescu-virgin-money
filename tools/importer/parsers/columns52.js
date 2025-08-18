/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row exactly as required
  const headerRow = ['Columns (columns52)'];

  // Get the main column containers
  // Immediate children of .sl-list (which has-2-items)
  const slList = element.querySelector('.sl-list');
  if (!slList) return; // Edge case: sl-list missing
  const slItems = Array.from(slList.children);
  if (slItems.length < 2) return; // Expecting at least 2 items

  // Left column: first sl-item, which contains .cm-rich-text
  const leftCol = slItems[0].querySelector('.cm-rich-text');
  // Defensive: if leftCol null, fallback to slItems[0]
  const leftCell = leftCol ? leftCol : slItems[0];

  // Right column: second sl-item, which contains several .cm.cm-icon-title sections
  const rightColContainer = slItems[1];
  const iconSections = Array.from(rightColContainer.querySelectorAll('.cm.cm-icon-title'));
  // Compose right column cell: combine all icon sections, separated by <br> for separation
  const rightCell = document.createElement('div');
  iconSections.forEach((section, idx) => {
    if (idx > 0) rightCell.appendChild(document.createElement('br'));
    rightCell.appendChild(section);
  });

  // Table structure: header row then one row with two columns
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
