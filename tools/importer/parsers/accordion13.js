/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: always use exact block name from example
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find all top-level li elements that represent accordion items
  const items = element.querySelectorAll('ul.accordion-list > li');

  items.forEach((item) => {
    // Title cell: use text content of <a> that acts as the accordion toggle
    const titleAnchor = item.querySelector('a.accordion-item');
    let titleCell;
    if (titleAnchor) {
      // Remove embedded icon (div.ec) and use only the visible question text
      const title = Array.from(titleAnchor.childNodes)
        .filter((n) => !(n.nodeType === Node.ELEMENT_NODE && n.classList && n.classList.contains('ec')))
        .map((n) => n.nodeType === Node.TEXT_NODE ? n.textContent : n)
        .filter((v) => v && (typeof v === 'string' ? v.trim() : true));
      if (title.length === 1 && typeof title[0] === 'string') {
        titleCell = title[0].trim();
      } else {
        // If there are inline elements, wrap in a span
        const span = document.createElement('span');
        title.forEach((v) => {
          if (typeof v === 'string') {
            span.appendChild(document.createTextNode(v));
          } else {
            span.appendChild(v);
          }
        });
        titleCell = span;
      }
    } else {
      titleCell = '';
    }

    // Content cell: extract the rich content block inside the expandcollapse-content
    const contentDiv = item.querySelector('div.expandcollapse-content');
    let contentCell;
    if (contentDiv) {
      // Reference all child nodes inside contentDiv, ignoring the wrapper itself
      // Prefer referencing existing child elements instead of clones
      const mainContentNodes = Array.from(contentDiv.childNodes).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      );
      if (mainContentNodes.length === 1) {
        contentCell = mainContentNodes[0];
      } else {
        contentCell = mainContentNodes;
      }
    } else {
      contentCell = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
