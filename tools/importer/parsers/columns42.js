/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching block name exactly
  const headerRow = ['Columns (columns42)'];

  // Find the .sl-list container (the columns wrapper)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct children that are columns (.sl-item)
  const columnElements = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));

  // For each column, gather its sections into a fragment
  const columnContents = columnElements.map(col => {
    const sections = Array.from(col.querySelectorAll(':scope > section'));
    const frag = document.createDocumentFragment();
    sections.forEach((section, idx) => {
      // Insert a <br> between sections for separation, only if not the first
      if (idx > 0) frag.appendChild(document.createElement('br'));
      frag.appendChild(section);
    });
    return frag;
  });

  // Only add columns if there's actual content
  if (columnContents.length === 0) return;

  // Create the table structure
  const cells = [
    headerRow,
    columnContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
