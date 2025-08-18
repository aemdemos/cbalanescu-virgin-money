/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Cards (cards19)'];
  // Get all card items
  const cardItems = Array.from(element.querySelectorAll('.sl-list > .sl-item'));
  const rows = cardItems.map(cardItem => {
    // Each card: .sl-item > section > a
    const link = cardItem.querySelector('a');
    if (!link) return null;
    // First cell: image (reference existing element)
    const image = link.querySelector('.image img');
    // Second cell: Text content (include all text, preserve semantic html)
    const contentDiv = link.querySelector('.content');
    const textCell = [];
    if (contentDiv) {
      // Include header if exists
      const header = contentDiv.querySelector('.header');
      if (header) textCell.push(header);
      // If there are other text nodes, include them (for future flexibility)
      Array.from(contentDiv.childNodes).forEach(node => {
        // If node is text and not empty, include as span
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textCell.push(span);
        }
        // If node is element and not header, include
        if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('header')) {
          textCell.push(node);
        }
      });
    }
    // Add CTA link at the bottom with heading text, as per block description
    if (link.href && contentDiv) {
      const header = contentDiv.querySelector('.header');
      if (header) {
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.textContent = header.textContent;
        textCell.push(cta);
      }
    }
    // Always [image, textCell]
    return [image, textCell];
  }).filter(row => row[0] && row[1].length > 0);
  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(table);
}
