/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Columns (columns42)'];

  // Find the container for the columns
  // .sl-list.has-2-items > .sl-item (each column)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Each .sl-item contains one or more <section class="cm cm-icon-title">
  // We'll create a parent div for each column if there are multiple sections
  const columns = slItems.map((slItem) => {
    // Collect all immediate section children
    const sections = Array.from(slItem.querySelectorAll(':scope > section.cm.cm-icon-title'));
    if (sections.length === 0) {
      // fallback: in case no sections, include all content
      return slItem;
    } else if (sections.length === 1) {
      return sections[0];
    } else {
      // group in a div for layout
      const colDiv = document.createElement('div');
      sections.forEach((section) => colDiv.appendChild(section));
      return colDiv;
    }
  });

  // Only proceed if we have at least one column with content
  if (!columns.length) return;

  const rows = [headerRow, columns];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  element.replaceWith(table);
}
