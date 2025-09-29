/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we're working with the expected structure
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;

  // Table header row as specified
  const headerRow = ['Accordion (accordion48)'];
  const rows = [headerRow];

  // Each <li> is an accordion item
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Title cell: the <a> element's text content (excluding arrow icon)
    const a = li.querySelector('a.accordion-item');
    let titleText = '';
    if (a) {
      // Remove any child <div> (icon container)
      const aClone = a.cloneNode(true);
      aClone.querySelectorAll('div').forEach(div => div.remove());
      titleText = aClone.textContent.trim();
    }

    // Content cell: the expandcollapse-content div
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell;
    if (contentDiv) {
      // Defensive: find the actual content block inside
      const richText = contentDiv.querySelector('.cm-rich-text');
      if (richText) {
        contentCell = richText;
      } else {
        // fallback: use the whole contentDiv
        contentCell = contentDiv;
      }
    } else {
      contentCell = document.createElement('div');
    }

    rows.push([titleText, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
