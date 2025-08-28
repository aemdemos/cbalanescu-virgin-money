/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Accordion (accordion16)'];
  const rows = [headerRow];

  // Each item is a <li>
  const items = Array.from(element.querySelectorAll(':scope > li'));
  items.forEach(li => {
    // Title cell: the clickable <a> element. Use text only, as in example.
    const a = li.querySelector(':scope > a');
    let titleCell;
    if (a) {
      // Remove any child <div> (e.g., the .ec icon)
      Array.from(a.querySelectorAll('div')).forEach(div => div.remove());
      const titleText = a.textContent.trim();
      const titleDiv = document.createElement('div');
      titleDiv.textContent = titleText;
      titleCell = titleDiv;
    } else {
      // fallback in case there's no <a>
      const emptyDiv = document.createElement('div');
      emptyDiv.textContent = '';
      titleCell = emptyDiv;
    }

    // Content cell: the expandcollapse-content div, which may contain a .module__content rich text div
    const content = li.querySelector(':scope > div.expandcollapse-content');
    let contentCell;
    if (content) {
      // Prefer the actual .module__content rich text div if present
      const rich = content.querySelector(':scope > div.module__content');
      if (rich) {
        contentCell = rich;
      } else {
        contentCell = content;
      }
    } else {
      // fallback in case there's no content div
      const emptyDiv = document.createElement('div');
      emptyDiv.textContent = '';
      contentCell = emptyDiv;
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
