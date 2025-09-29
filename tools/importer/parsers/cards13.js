/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all card sections
  const sections = Array.from(element.querySelectorAll('section.cm.cm-icon-title'));
  const rows = [];

  sections.forEach((section) => {
    // First cell: icon image
    const img = section.querySelector('.header img');
    // Second cell: text content
    const textDiv = document.createElement('div');
    const title = section.querySelector('.header h2');
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent;
      textDiv.appendChild(h);
    }
    const content = section.querySelector('.content');
    if (content) {
      const ps = content.querySelectorAll('p');
      if (ps[0]) textDiv.appendChild(ps[0].cloneNode(true));
      if (ps[1]) textDiv.appendChild(ps[1].cloneNode(true));
    }
    rows.push([img ? img : '', textDiv]);
  });

  // Header row: must be a single column (no colspan)
  // Use WebImporter.DOMUtils.createTable to ensure correct structure
  const headerRow = ['Cards (cards13)'];
  const tableRows = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
