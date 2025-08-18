/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the required block name
  const headerRow = ['Accordion (accordion47)'];
  const rows = [headerRow];

  // Find all immediate li children of the accordion-list
  const list = element.querySelector('ul.accordion-list');
  if (list) {
    const items = Array.from(list.children);
    items.forEach((li) => {
      // Find the title link (first <a> inside li)
      let titleElem = null;
      const a = li.querySelector('a');
      if (a) {
        // Remove icon div for clean title
        const icon = a.querySelector('div.ec');
        if (icon) icon.remove(); // removes from DOM (it is ok, soon replaced)
        titleElem = a;
      } else {
        // Fallback: use first text node
        titleElem = document.createElement('span');
        titleElem.textContent = li.textContent.trim();
      }

      // Find the content: <div class="expandcollapse-content">
      let contentElem = null;
      const expandContent = li.querySelector('div.expandcollapse-content');
      if (expandContent) {
        // Use the inner content, if there is a module__content, use only that
        const moduleContent = expandContent.querySelector('.module__content');
        if (moduleContent) {
          contentElem = moduleContent;
        } else {
          contentElem = expandContent;
        }
      } else {
        // Fallback: empty div
        contentElem = document.createElement('div');
      }
      rows.push([titleElem, contentElem]);
    });
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
