/* global WebImporter */
export default function parse(element, { document }) {
  // Find root columns container: Only parse if we get the correct column structure
  const rootList = element.querySelector('.column-container > .sl > .sl-list');
  if (!rootList) return;
  // Get all columns: direct children with .sl-item
  const columnEls = Array.from(rootList.children).filter(child => child.classList.contains('sl-item'));
  // Each .sl-item is a column panel: extract each cell's content
  const columnCells = columnEls.map(col => {
    // In each column, find the main content panel
    const panel = col.querySelector('.cm-content-panel-container');
    // Gather all relevant sections (panel, icon-title sections, CTA)
    const cellParts = [];
    if (panel) {
      cellParts.push(panel);
    }
    // All icon-title sections (immediate children only)
    const iconSections = Array.from(col.querySelectorAll(':scope > section.cm-icon-title'));
    iconSections.forEach(sec => {
      cellParts.push(sec);
    });
    // CTA at the end (cm-rich-text, immediate child only)
    const cta = col.querySelector(':scope > .cm-rich-text');
    if (cta) {
      cellParts.push(cta);
    }
    // If only one part, just use it; else, use fragment
    if (cellParts.length === 1) {
      return cellParts[0];
    } else {
      const frag = document.createDocumentFragment();
      cellParts.forEach(part => frag.appendChild(part));
      return frag;
    }
  });
  // Table header matches example exactly
  const headerRow = ['Columns (columns12)'];
  // Each content row is the set of columns extracted above
  const tableRows = [headerRow, columnCells];
  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace original element with table
  element.replaceWith(table);
}
