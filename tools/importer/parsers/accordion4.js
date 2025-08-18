/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block table
  const headerRow = ['Accordion (accordion4)'];

  // Find all accordion items (li under ul.accordion-list)
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li');

  const rows = [];
  items.forEach((li) => {
    // Title: the <a> inside the li
    const titleLink = li.querySelector(':scope > a');
    let titleContent = '';
    if (titleLink) {
      // Remove any .ec icon or sub element
      const ecDiv = titleLink.querySelector('.ec');
      if (ecDiv) ecDiv.remove();
      titleContent = titleLink.textContent.trim();
    } else {
      // If no <a> present, skip this row
      return;
    }
    // Content: the <div class="expandcollapse-content"> inside the li
    const contentDiv = li.querySelector(':scope > div.expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      // If an <ol> exists inside contentDiv, use it (preserves all nested <li>s, wrappers, etc)
      const ol = contentDiv.querySelector('ol');
      if (ol) {
        contentCell = ol;
      } else {
        // If there is any other content, use whole div
        contentCell = contentDiv;
      }
    }
    rows.push([titleContent, contentCell]);
  });

  // Compose table cell array
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original accordion element with the block table
  element.replaceWith(blockTable);
}
