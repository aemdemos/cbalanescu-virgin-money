/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example, exactly one column
  const headerRow = ['Hero (hero31)'];

  // Background image row
  let imageEl = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (match && match[1]) {
      imageEl = document.createElement('img');
      imageEl.src = match[1];
      // Use alt from .vh span inside bgDiv, if present
      const altSpan = bgDiv.querySelector('.vh');
      imageEl.alt = altSpan ? altSpan.textContent.trim() : '';
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // Content row: get all child nodes, preserving semantic meaning and all text
  let contentCell = [];
  const a = element.querySelector('a');
  if (a) {
    const content = a.querySelector('.content');
    if (content) {
      const nodes = Array.from(content.childNodes).filter(n => {
        // Omit empty text nodes
        return n.nodeType !== Node.TEXT_NODE || (n.textContent && n.textContent.trim());
      });
      // For CTA, if we find a span.cta, replace it with a link referencing the parent a's href
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('cta')) {
          const ctaLink = document.createElement('a');
          ctaLink.href = a.href;
          ctaLink.textContent = node.textContent;
          contentCell.push(ctaLink);
        } else {
          contentCell.push(node);
        }
      }
    }
  }
  // If no content was found, push empty string
  if (contentCell.length === 0) contentCell = [''];
  const contentRow = [contentCell];

  // Compose the table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
