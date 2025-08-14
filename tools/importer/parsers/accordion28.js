/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows, starting with the correct header
  const headerRow = ['Accordion (accordion28)'];
  const rows = [headerRow];
  // Get all accordion sections (filtered-content)
  const items = Array.from(element.querySelectorAll('.filtered-content'));
  items.forEach((item) => {
    // Title comes from data-title; fallback to first heading if not present
    let title = item.getAttribute('data-title') || '';
    if (!title) {
      const h = item.querySelector('h2, h3, h4, h5, h6');
      if (h) title = h.textContent.trim();
    }
    // Content is everything inside the first .column-container in the item
    const content = item.querySelector('.column-container');
    // Defensive: if content missing, create an empty div
    const contentCell = content ? content : document.createElement('div');
    // Defensive: title fallback empty string
    rows.push([title, contentCell]);
  });
  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
