/* global WebImporter */
export default function parse(element, { document }) {
  // === Critical Review Steps: ===
  // - Header must be 'Columns (columns42)'
  // - Only create one table, as in the example
  // - Section Metadata is not present in the example; do not create it
  // - No markdown syntax should be used
  // - Reference (not clone) existing elements
  // - All content from the source columns should be included
  // - The table must have a header row, then one row with one cell per column
  // - Each column cell should include all of the .cm.cm-icon-title sections in order
  // - All headings, icons, formatted text, and paragraphs must be retained as in the source
  // =================================

  // Prepare header row
  const headerRow = ['Columns (columns42)'];

  // Find the .sl-list (column wrapper)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Select columns - direct children with class sl-item
  const columns = Array.from(slList.children).filter(c => c.classList.contains('sl-item'));
  if (columns.length === 0) return;

  // For each column, gather all content sections within that column
  // For resilience: all direct child sections with class cm-icon-title
  const columnCells = columns.map(col => {
    // All .cm-icon-title sections in this column (direct children)
    const sections = Array.from(col.querySelectorAll(':scope > section.cm-icon-title'));
    // If no sections, fall back to all child nodes
    if (sections.length > 0) {
      // Use all sections as an array (multi-element cell)
      return sections.length === 1 ? sections[0] : sections;
    } else {
      // Defensive: fallback to all content
      return Array.from(col.childNodes);
    }
  });

  // Table: header, then one row for the columns
  const tableData = [
    headerRow,
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
