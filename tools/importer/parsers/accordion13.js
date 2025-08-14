/* global WebImporter */
export default function parse(element, { document }) {
  // Get the accordion items
  const ul = element.querySelector('ul.accordion-list');
  const items = ul ? Array.from(ul.children) : [];

  // Header row as in the example
  const rows = [['Accordion (accordion13)']];

  items.forEach(li => {
    // Title: <a class="accordion-item"> ... </a>
    const link = li.querySelector('a.accordion-item');
    let titleCell = '';
    if (link) {
      // Copy the link's text content, excluding any child nodes that are not text (such as the trailing <div.ec>)
      // We'll construct a span with only the text up to the first <div> child
      let titleText = '';
      link.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          titleText += node.textContent;
        }
      });
      const titleSpan = document.createElement('span');
      titleSpan.textContent = titleText.trim();
      titleCell = titleSpan;
    }
    // Content: <div class="expandcollapse-content"> ... </div>
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      // Find the first child with .cm-rich-text if exists, otherwise fallback to all direct child nodes
      const richContent = contentDiv.querySelector('.cm-rich-text');
      if (richContent) {
        contentCell = richContent;
      } else {
        // Fallback: include all children (robustness for edge cases)
        const elements = Array.from(contentDiv.children);
        if (elements.length > 0) {
          contentCell = elements;
        } else {
          // fallback to text
          contentCell = contentDiv.textContent.trim();
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Build and replace with the accordion table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
