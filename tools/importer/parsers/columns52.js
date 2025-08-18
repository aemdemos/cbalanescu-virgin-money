/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row matching the block name and variant exactly
  const headerRow = ['Columns (columns52)'];

  // Defensive: Make sure we find the correct list of column items.
  // Find the .sl-list (the container of columns)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct children with class .sl-item (these are columns)
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  if (slItems.length < 2) return;

  // First column: contains heading text ("Got questions? We're here to help")
  const leftColumn = slItems[0];
  // Grab the only .cm-rich-text child (contains the heading)
  const leftContent = leftColumn.querySelector('.cm-rich-text');
  // If not found, fallback to the whole left column
  const leftCell = leftContent || leftColumn;

  // Second column: contains three contact methods as .cm-icon-title sections
  const rightColumn = slItems[1];
  // Collect all .cm-icon-title sections
  const iconSections = Array.from(rightColumn.querySelectorAll('section.cm-icon-title'));
  // For semantic fidelity, we append each section as-is, preserving structure and images/links
  const rightCellFragment = document.createDocumentFragment();
  iconSections.forEach(section => rightCellFragment.appendChild(section));
  // If none found, fallback to the whole rightColumn
  const rightCell = iconSections.length ? rightCellFragment : rightColumn;

  // Compose the table: header row, then one row with two columns
  const cells = [
    headerRow,
    [leftCell, rightCell],
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the new block table
  element.replaceWith(blockTable);
}
