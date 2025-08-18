/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as required
  const headerRow = ['Hero (hero15)'];

  // Row 2: Background image (optional)
  let bgImgEl = '';
  // Find any descendant with a background-image style
  const bgImgDiv = element.querySelector('[style*="background-image"]');
  if (bgImgDiv && bgImgDiv.style && bgImgDiv.style.backgroundImage) {
    const match = bgImgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      // Use text from a visually hidden span if present as alt, else empty string
      const altSpan = bgImgDiv.querySelector('span');
      img.alt = altSpan ? altSpan.textContent.trim() : '';
      bgImgEl = img;
    }
  }
  const row2 = [bgImgEl];

  // Row 3: Content (title, subtitle, description, CTA) -- keep all text content
  const contentDiv = element.querySelector('.content');
  const contentArr = [];
  if (contentDiv) {
    // Use all children for coverage, maintain order
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // For the .cta span, replace with a link to the parent <a> (CTA)
        if (node.classList && node.classList.contains('cta')) {
          // Only add if not already a link
          const outerLink = element.querySelector('a[href]');
          if (outerLink) {
            const a = document.createElement('a');
            a.href = outerLink.href;
            a.textContent = node.textContent.trim();
            contentArr.push(a);
          } else {
            contentArr.push(node);
          }
        } else {
          contentArr.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Add non-empty text nodes
        const trimmed = node.textContent.trim();
        if (trimmed) {
          const span = document.createElement('span');
          span.textContent = trimmed;
          contentArr.push(span);
        }
      }
    });
  }
  // Fallback: if nothing found but .content exists, include it in full
  const row3 = [contentArr.length ? contentArr : (contentDiv ? [contentDiv] : [''])];

  // Compose and replace
  const cells = [headerRow, row2, row3];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
