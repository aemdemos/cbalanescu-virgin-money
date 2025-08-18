/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header EXACTLY as shown in the example
  const headerRow = ['Hero (hero21)'];

  // 2. Extract background image from any 'background-image' style
  let imageCellContent = '';
  const bgEl = element.querySelector('[style*="background-image"]');
  if (bgEl) {
    const style = bgEl.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      // Pull alt text from visually hidden span if present (for accessibility)
      const vh = bgEl.querySelector('span');
      if (vh && vh.textContent) {
        img.alt = vh.textContent.trim();
      }
      imageCellContent = img;
    }
  }

  // 3. Extract all text content from the source HTML, including from visually hidden spans
  let textParts = [];

  // - Collect visually hidden span text (if any)
  const hiddenSpans = element.querySelectorAll('span');
  hiddenSpans.forEach(span => {
    const txt = span.textContent.trim();
    if (txt) textParts.push(txt);
  });

  // - Also collect any other non-empty text nodes outside the image block
  // Only add text nodes that are not inside a background-image div
  function collectDirectText(el) {
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === 3) { // Text node
        const txt = node.textContent.trim();
        if (txt) textParts.push(txt);
      } else if (node.nodeType === 1 && node !== bgEl) {
        collectDirectText(node);
      }
    });
  }
  collectDirectText(element);

  // Combine all text parts
  const textContent = textParts.join('\n');

  // 4. Compose the table rows according to example structure
  const cells = [
    headerRow,
    [imageCellContent],
    [textContent || '']
  ];

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
