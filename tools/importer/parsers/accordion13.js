/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows
  const rows = [];
  // Header row, matching the required format exactly
  rows.push(['Accordion (accordion13)']);

  // Find the accordion list
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  // Each accordion item is an <li>
  const liNodes = Array.from(ul.children).filter((li) => li.tagName === 'LI');

  liNodes.forEach((li) => {
    // Title cell: first <a> tag with class 'accordion-item'.
    const a = li.querySelector('a.accordion-item');
    let titleCell = null;
    if (a) {
      // Remove any child <div> with class 'ec' (the dropdown arrow)
      const ec = a.querySelector('div.ec');
      if (ec) ec.remove();
      titleCell = a;
    }

    // Content cell: the <div> with class 'expandcollapse-content'
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell = null;
    if (contentDiv) {
      contentCell = contentDiv;
    }

    // Only push row if both cells exist (robustness)
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
