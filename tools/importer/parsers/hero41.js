/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row matches example
  const headerRow = ['Hero (hero41)'];

  // --- Extract background image ---
  let imgCell = '';
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const urlMatch = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (urlMatch && urlMatch[1]) {
      const altSpan = bgDiv.querySelector('.vh');
      const altText = altSpan ? altSpan.textContent.trim() : '';
      const img = document.createElement('img');
      img.src = urlMatch[1];
      if (altText) img.alt = altText;
      imgCell = img;
    }
  }

  // --- Extract text content block ---
  let textCellContent = [];
  const contentDiv = element.querySelector('.content');
  if (contentDiv) {
    // Collect all direct children (preserving order and full structure)
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        textCellContent.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Preserve meaningful text nodes
        const span = document.createElement('span');
        span.textContent = node.textContent;
        textCellContent.push(span);
      }
    });
  }
  // If no content found, ensure cell is not empty
  if (textCellContent.length === 0) {
    textCellContent = [''];
  }

  // Compose table as in example
  const cells = [
    headerRow,
    [imgCell],
    [textCellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
