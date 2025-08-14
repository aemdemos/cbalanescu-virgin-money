/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows, starting with the header
  const rows = [['Accordion (accordion16)']];
  // For edge case handling: if there are no LI children, don't error
  const items = Array.from(element.children).filter((li) => li.tagName === 'LI');
  items.forEach((li) => {
    // 1. Title cell: get text content from the <a> accordion-item, excluding any icon DIVs
    let title = '';
    const a = li.querySelector('a.accordion-item');
    if (a) {
      // Only use the direct text nodes of <a> (before any icons/divs)
      const titleParts = [];
      a.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          if (n.textContent.trim()) {
            titleParts.push(n.textContent.trim());
          }
        }
      });
      if (titleParts.length) {
        title = titleParts.join(' ');
      } else {
        // fallback to textContent if only one node
        title = a.textContent.trim();
      }
    }
    // 2. Content cell: reference the .module__content block if it exists, else the collapse content
    let content = '';
    const expandContent = li.querySelector('.expandcollapse-content');
    if (expandContent) {
      const moduleContent = expandContent.querySelector('.module__content');
      if (moduleContent) {
        content = moduleContent;
      } else {
        content = expandContent;
      }
    }
    // Edge case: ensure cells are always present (avoid null/undefined)
    rows.push([
      title || '',
      content || ''
    ]);
  });
  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
