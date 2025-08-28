/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];
  // Find all card items
  const cardItems = element.querySelectorAll('.product-key-rate-item');
  cardItems.forEach((item) => {
    // First cell: the <img> element, referenced directly
    const img = item.querySelector('img');
    // Second cell: Title, description (with possible <p>, <sup>, <a>), and CTA (if present)
    const textParts = [];
    // Title
    const titleSpan = item.querySelector('.key-value-text span');
    if (titleSpan) {
      // Bold the title (semantic: strong, like an <h3> in card)
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textParts.push(strong);
    }
    // Description and CTA(s)
    const keyTop = item.querySelector('.key-top-text');
    if (keyTop) {
      // If first child is a <p> and there are multiple <p>, handle separately
      const paragraphs = keyTop.querySelectorAll('p');
      if (paragraphs.length > 0) {
        // Add first paragraph (description)
        textParts.push(document.createElement('br'));
        textParts.push(paragraphs[0]);
        // Add subsequent paragraphs (usually CTA)
        for (let i = 1; i < paragraphs.length; i++) {
          textParts.push(paragraphs[i]);
        }
        // Also add any text before the first paragraph
        let node = keyTop.firstChild;
        let beforeP = '';
        while (node && node !== paragraphs[0]) {
          if (node.nodeType === Node.TEXT_NODE) {
            beforeP += node.textContent;
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SUP') {
            beforeP += node.outerHTML;
          }
          node = node.nextSibling;
        }
        if (beforeP.trim()) {
          const span = document.createElement('span');
          span.innerHTML = beforeP;
          // Insert before the first <p>
          textParts.splice(1, 0, span);
        }
      } else {
        // No paragraphs, just text and <sup>
        textParts.push(document.createElement('br'));
        Array.from(keyTop.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SUP' || node.tagName === 'A')) {
            textParts.push(node);
          } else {
            // text node
            textParts.push(document.createTextNode(node.textContent));
          }
        });
      }
    }
    // Remove empty <br> at the end if present
    while (textParts.length && textParts[textParts.length - 1].tagName === 'BR') {
      textParts.pop();
    }
    cells.push([
      img,
      textParts
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
