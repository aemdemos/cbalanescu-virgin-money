/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Accordion (accordion27)'];
  const rows = [headerRow];

  // Find <ul class="accordion-list">
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  // Only direct <li> children are accordion items
  const lis = Array.from(ul.children);
  lis.forEach(li => {
    // Title cell: <a class="accordion-item">
    const titleAnchor = li.querySelector('a.accordion-item');
    let titleCell = '';
    if (titleAnchor) {
      // Remove any icon-like div.ec in the anchor (dropdown arrow)
      const icon = titleAnchor.querySelector('div.ec');
      if (icon) icon.remove();
      // Reference existing element (not clone)
      titleCell = titleAnchor;
    }
    // Content cell: <div class="expandcollapse-content">
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      // Reference the content container directly
      contentCell = contentDiv;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
