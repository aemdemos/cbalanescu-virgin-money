/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Accordion (accordion47)'];
  const rows = [];

  // Get all <li> direct children of the <ul class="accordion-list">
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;

  // Each row: [Title, Content]
  const items = Array.from(ul.children).filter(child => child.tagName === 'LI');
  items.forEach(li => {
    // Title: <a class="js-ec-link accordion-item">
    const titleAnchor = li.querySelector('a.accordion-item');
    let titleCell = '';
    if (titleAnchor) {
      // Remove trailing <div class="ec"> if present
      // (usually the title is just the text before <div class="ec">)
      // We'll extract only the plain text up to the <div class="ec"> if present, including any HTML inline formatting (not present in this example)
      let titleParts = [];
      for (let node of titleAnchor.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ec')) {
          break;
        }
        // Keep all text and inline elements
        titleParts.push(node);
      }
      // If single text node, use its text content; otherwise, use the array
      if (titleParts.length === 1 && titleParts[0].nodeType === Node.TEXT_NODE) {
        titleCell = titleParts[0].textContent.trim();
      } else {
        // Wrap in a <span> so the DOMUtils table can accept it
        const span = document.createElement('span');
        titleParts.forEach(part => span.appendChild(part.cloneNode(true)));
        titleCell = span;
      }
    }
    // Content: <div class="expandcollapse-content">
    const contentDiv = li.querySelector('div.expandcollapse-content');
    let contentCell = '';
    if (contentDiv) {
      // Find the rich text block(s) inside
      const contentBlocks = Array.from(contentDiv.children);
      const meaningfulBlocks = contentBlocks.filter(block => block.childNodes.length > 0);
      if (meaningfulBlocks.length > 0) {
        contentCell = meaningfulBlocks.length === 1 ? meaningfulBlocks[0] : meaningfulBlocks;
      } else {
        // Fallback: use the contentDiv itself if nothing else
        contentCell = contentDiv;
      }
    }
    // Always push [titleCell, contentCell]
    rows.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
