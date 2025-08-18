/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion30)'];
  const rows = [headerRow];

  // Get all <li> items (each is an accordion panel)
  const items = element.querySelectorAll(':scope > li');

  items.forEach((li) => {
    // --- TITLE CELL ---
    // The clickable <a> contains the question/title
    // Ignore child <div class="ec">, only get text
    const a = li.querySelector('a');
    let title = '';
    // Only use direct text nodes, not children like <div>
    a.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        title += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'DIV') {
        title += node.textContent;
      }
    });
    title = title.trim();
    // Use <p> element for semantic heading (matches screenshot styling)
    const titleEl = document.createElement('p');
    titleEl.textContent = title;

    // --- CONTENT CELL ---
    // Find the expanded content for this panel
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCellEl;
    if (contentDiv) {
      // Prefer the .module__content div if present
      const richContent = contentDiv.querySelector('.module__content');
      if (richContent) {
        contentCellEl = richContent; // Reference existing element
      } else {
        // If not, reference the entire contentDiv
        contentCellEl = contentDiv;
      }
    } else {
      // If content is missing, use empty div
      contentCellEl = document.createElement('div');
    }

    rows.push([titleEl, contentCellEl]);
  });

  // Build the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element
  element.replaceWith(block);
}
